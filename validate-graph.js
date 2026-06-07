#!/usr/bin/env node
// validate-graph.js — conformance checker for the AI-Factory knowledge graph.
//
// Loads the metamodel from graph-schema.yaml and the graph from src/data.js,
// then reports violations grouped by category. Exits 1 on any hard error, 0 when
// clean (warnings are allowed). Validates the AUTHORED source (nodes[].connectsTo
// + EDGE_META), since the derived `links` array silently drops dangling edges.
//
//   npm run validate            # summary report
//   node validate-graph.js --all  # don't truncate long offender lists

import { readFileSync } from 'node:fs'
import yaml from 'js-yaml'
import { nodes, links, EDGE_TYPES, EDGE_META } from './src/data.js'

const showAll = process.argv.includes('--all')
const CAP = 20 // max offenders printed per category unless --all

// ── load + index the schema ──────────────────────────────────────────────
const schema = yaml.load(
  readFileSync(new URL('./graph-schema.yaml', import.meta.url), 'utf8')
)

const aliases = schema.node?.aliases ?? {}
const required = schema.node?.required ?? []
const getField = (n, logical) => n[aliases[logical] ?? logical]

const typeSet = new Set(Object.keys(schema.nodeTypes ?? {}))
const domainSet = new Set(schema.domains ?? [])
const relationSet = new Set(schema.edgeRelations ?? [])
const idSet = new Set(nodes.map((n) => n.id))
const nodeById = new Map(nodes.map((n) => [n.id, n]))

const sev = (key) => schema.severity?.[key] ?? 'error'

const grammar = {}
for (const [type, def] of Object.entries(schema.nodeTypes ?? {})) {
  const flags = def.flags ?? 'i'
  const compile = (arr) => (arr ?? []).map((src) => new RegExp(src, flags))
  grammar[type] = { note: def.note ?? '', match: compile(def.match), forbid: compile(def.forbid) }
}

const atomSubs = schema.atomicity?.forbiddenSubstrings ?? []
const atomPhrases = schema.atomicity?.forbiddenPhrases ?? []

// ── collect findings ──────────────────────────────────────────────────────
const findings = []
const add = (category, id, detail) =>
  findings.push({ category, severity: sev(category), id, detail })

// node-level checks
const labelGroups = new Map() // normalized prefLabel -> { label, ids[] }
for (const n of nodes) {
  const id = n.id ?? '(no-id)'

  // required-field presence (type/domain get their own categories; the rest are generic)
  for (const field of required) {
    const v = getField(n, field)
    const empty = v == null || (typeof v === 'string' && v.trim() === '')
    if (!empty) continue
    if (field === 'type') add('untypedNode', id, 'missing "type" — one of: ' + [...typeSet].join(', '))
    else if (field === 'domain') add('missingDomain', id, 'missing "domain"')
    else add('missingField', id, `missing required field "${field}"`)
  }

  // closed-vocabulary checks
  if (n.type != null && n.type !== '' && !typeSet.has(n.type))
    add('invalidType', id, `type "${n.type}" not in {${[...typeSet].join(', ')}}`)
  if (n.domain != null && n.domain !== '' && !domainSet.has(n.domain))
    add('invalidDomain', id, `domain "${n.domain}" not in {${[...domainSet].join(', ')}}`)

  const label = getField(n, 'prefLabel') ?? ''

  // label grammar (only when the node has a valid type)
  if (n.type && typeSet.has(n.type)) {
    const g = grammar[n.type]
    if (g.forbid.some((re) => re.test(label)))
      add('labelGrammarForbid', id, `"${label}" violates ${n.type} rule — ${g.note}`)
    else if (g.match.length && !g.match.some((re) => re.test(label)))
      add('labelGrammarMiss', id, `"${label}" doesn't look like a ${n.type} — ${g.note}`)
  }

  // atomicity
  const hits = [
    ...atomSubs.filter((s) => label.includes(s)),
    ...atomPhrases.filter((p) => label.includes(p)),
  ]
  if (hits.length)
    add('atomicitySmell', id, `"${label}" contains ${hits.map((h) => JSON.stringify(h)).join(', ')} — should name ONE concept`)

  // duplicate prefLabel bucketing
  const key = label.trim().toLowerCase()
  if (key) {
    if (!labelGroups.has(key)) labelGroups.set(key, { label, ids: [] })
    labelGroups.get(key).ids.push(id)
  }
}

for (const { label, ids } of labelGroups.values()) {
  if (ids.length > 1) add('duplicatePrefLabel', ids.join(', '), `prefLabel "${label}" reused by ${ids.length} nodes`)
}

// edge-level checks (authored source)
const edgeKeys = new Set()
const danglingSeen = new Set()
for (const n of nodes) {
  for (const target of n.connectsTo ?? []) {
    if (!idSet.has(target)) {
      const k = `${n.id}::${target}`
      if (!danglingSeen.has(k)) {
        danglingSeen.add(k)
        add('danglingEdge', k, `target "${target}" is not a node`)
      }
      continue
    }
    edgeKeys.add([n.id, target].sort().join('::'))
  }
}

// non-vocabulary relations — check EDGE_META entries and EDGE_TYPES keys
for (const [k, meta] of Object.entries(EDGE_META)) {
  if (meta?.type && !relationSet.has(meta.type))
    add('nonVocabRelation', k, `relation "${meta.type}" not in closed vocabulary`)
}
for (const k of Object.keys(EDGE_TYPES)) {
  if (!relationSet.has(k))
    add('nonVocabRelation', `EDGE_TYPES:${k}`, `style def for "${k}" not in closed vocabulary`)
}

// orphan EDGE_META — a metadata entry with no backing connectsTo edge
for (const key of Object.keys(EDGE_META)) {
  const [a, b] = key.split('::')
  const backed =
    (nodeById.get(a)?.connectsTo ?? []).includes(b) ||
    (nodeById.get(b)?.connectsTo ?? []).includes(a)
  if (!backed) add('orphanMeta', key, 'EDGE_META entry has no matching connectsTo edge')
}

// ── report ────────────────────────────────────────────────────────────────
const order = [
  'missingField', 'untypedNode', 'invalidType', 'missingDomain', 'invalidDomain',
  'nonVocabRelation', 'danglingEdge', 'duplicatePrefLabel', 'labelGrammarForbid',
  'labelGrammarMiss', 'atomicitySmell', 'orphanMeta',
]
const byCat = new Map()
for (const f of findings) {
  if (!byCat.has(f.category)) byCat.set(f.category, [])
  byCat.get(f.category).push(f)
}

const errors = findings.filter((f) => f.severity === 'error')
const warns = findings.filter((f) => f.severity === 'warn')

console.log(`\nAI-Factory graph validation  (schema v${schema.version})`)
console.log(
  `  nodes: ${nodes.length}   authored edges: ${edgeKeys.size}   derived links: ${links.length}` +
    `   relations: ${relationSet.size}   domains: ${domainSet.size}\n`
)

const printGroup = (label, severity) => {
  const cats = order.filter((c) => byCat.has(c) && sev(c) === severity)
  if (!cats.length) {
    console.log(`${label}: none`)
    return
  }
  console.log(`${label}:`)
  for (const cat of cats) {
    const items = byCat.get(cat)
    console.log(`  ${cat} (${items.length})`)
    const shown = showAll ? items : items.slice(0, CAP)
    for (const f of shown) console.log(`    - ${f.id}: ${f.detail}`)
    if (!showAll && items.length > CAP)
      console.log(`    … +${items.length - CAP} more (run with --all)`)
  }
}

printGroup('ERRORS', 'error')
console.log('')
printGroup('WARNINGS', 'warn')

const verdict = errors.length ? 'FAIL' : 'PASS'
console.log(`\nSummary: ${errors.length} errors, ${warns.length} warnings  →  ${verdict}\n`)
process.exit(errors.length ? 1 : 0)
