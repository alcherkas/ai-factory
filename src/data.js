// Placeholder glossary — all text is lorem ipsum, swap in real content later.
// This is the ONLY file you need to edit to change what the graph shows:
// nodes + their connections drive both the graph and the detail panel.
//
// Each node: { id, label, description, notes?, connectsTo[] }
// Links between nodes are derived from `connectsTo` automatically (see bottom).

export const nodes = [
  {
    id: 'lorem',
    label: 'Lorem',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    notes: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.'],
    connectsTo: ['dolor', 'magna', 'aliqua', 'tempor', 'veniam', 'nostrud', 'labore'],
  },
  {
    id: 'ipsum',
    label: 'Ipsum',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
    connectsTo: ['dolor', 'sit'],
  },
  {
    id: 'dolor',
    label: 'Dolor',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    notes: [
      'Sed do eiusmod tempor incididunt ut labore et dolore.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    ],
    connectsTo: ['lorem', 'ipsum', 'aliqua', 'veniam', 'tempor', 'incididunt', 'nostrud', 'ullamco', 'magna'],
  },
  {
    id: 'sit',
    label: 'Sit',
    description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.',
    connectsTo: ['ipsum', 'ullamco', 'elit'],
  },
  {
    id: 'amet',
    label: 'Amet',
    description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    connectsTo: ['adipiscing', 'elit', 'magna'],
  },
  {
    id: 'consectetur',
    label: 'Consectetur',
    description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.',
    connectsTo: ['aliqua', 'labore'],
  },
  {
    id: 'adipiscing',
    label: 'Adipiscing',
    description: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
    connectsTo: ['amet', 'ullamco'],
  },
  {
    id: 'elit',
    label: 'Elit',
    description: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae.',
    connectsTo: ['ullamco', 'sit', 'amet'],
  },
  {
    id: 'sed',
    label: 'Sed',
    description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.',
    connectsTo: ['magna', 'aliqua'],
  },
  {
    id: 'tempor',
    label: 'Tempor',
    description: 'Et harum quidem rerum facilis est et expedita distinctio nam libero tempore cum soluta nobis.',
    connectsTo: ['lorem', 'incididunt', 'dolor', 'magna'],
  },
  {
    id: 'incididunt',
    label: 'Incididunt',
    description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet.',
    connectsTo: ['veniam', 'tempor', 'lorem'],
  },
  {
    id: 'labore',
    label: 'Labore',
    description: 'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias.',
    connectsTo: ['aliqua', 'ullamco', 'consectetur', 'lorem'],
  },
  {
    id: 'magna',
    label: 'Magna',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
    connectsTo: ['lorem', 'sed', 'aliqua', 'tempor', 'dolor', 'exercitation'],
  },
  {
    id: 'aliqua',
    label: 'Aliqua',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
    connectsTo: ['lorem', 'labore', 'consectetur', 'sed', 'magna', 'dolor'],
  },
  {
    id: 'veniam',
    label: 'Veniam',
    description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.',
    connectsTo: ['incididunt', 'nostrud', 'lorem', 'dolor'],
  },
  {
    id: 'nostrud',
    label: 'Nostrud',
    description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id.',
    connectsTo: ['veniam', 'lorem', 'aliqua', 'dolor'],
  },
  {
    id: 'exercitation',
    label: 'Exercitation',
    description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni.',
    notes: ['Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.'],
    connectsTo: ['magna', 'aliqua', 'dolor'],
  },
  {
    id: 'ullamco',
    label: 'Ullamco',
    description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam.',
    connectsTo: ['elit', 'adipiscing', 'sit', 'labore', 'dolor'],
  },
]

// --- derive undirected links from connectsTo (dedupe a–b / b–a) ---
const ids = new Set(nodes.map((n) => n.id))
const seen = new Set()
export const links = []
for (const n of nodes) {
  for (const target of n.connectsTo || []) {
    if (!ids.has(target)) continue // skip dangling references
    const key = [n.id, target].sort().join('::')
    if (seen.has(key)) continue
    seen.add(key)
    links.push({ source: n.id, target })
  }
}
