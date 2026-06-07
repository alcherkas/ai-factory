import { CATEGORIES } from './data.js'

const idOf = (e) => (typeof e === 'object' ? e.id : e)

// The panel that slides in when a node is clicked. Pure data rendering —
// everything here comes from the selected node + the derived links.
export default function DetailPanel({ node, allNodes, links, onSelect, onClose }) {
  if (!node) return null

  const byId = (id) => allNodes.find((n) => n.id === id)
  const idx = allNodes.findIndex((n) => n.id === node.id)
  const prev = allNodes[(idx - 1 + allNodes.length) % allNodes.length]
  const next = allNodes[(idx + 1) % allNodes.length]
  const category = CATEGORIES.find((c) => c.id === node.category)
  const indexLabel = `${String(idx + 1).padStart(2, '0')} / ${String(allNodes.length).padStart(2, '0')}`

  // every edge incident to this node, with its relationship type + description,
  // strongest first (derived from links so it matches what the graph draws)
  const connections = links
    .filter((l) => idOf(l.source) === node.id || idOf(l.target) === node.id)
    .map((l) => {
      const otherId = idOf(l.source) === node.id ? idOf(l.target) : idOf(l.source)
      return { other: byId(otherId), type: l.type, description: l.description, weight: l.weight ?? 0 }
    })
    .filter((c) => c.other)
    .sort((a, b) => b.weight - a.weight)

  return (
    <aside className="panel">
      <button className="panel-close" onClick={onClose} aria-label="Close">
        ×
      </button>

      {/* keyed by node id so swapping entries replays the content fade,
          while the <aside> itself stays mounted (no re-slide on navigate) */}
      <div className="panel-body" key={node.id}>
        <div className="panel-head">
          <span className="panel-cat">{category ? category.label : 'Concept'}</span>
          <span className="panel-index">{indexLabel}</span>
        </div>
        <h1 className="panel-title">{node.label}</h1>
        <p className="panel-desc">{node.description}</p>

        {node.stat && <p className="panel-stat">{node.stat}</p>}

        {node.notes?.length > 0 && (
          <>
            <p className="panel-section">Notes</p>
            {node.notes.map((quote, i) => (
              <blockquote key={i} className={`panel-quote${i % 2 ? ' dark' : ''}`}>
                {quote}
              </blockquote>
            ))}
          </>
        )}

        {node.sources?.length > 0 && (
          <>
            <p className="panel-section">Sources</p>
            <ul className="panel-sources">
              {node.sources.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </>
        )}

        {connections.length > 0 && (
          <>
            <p className="panel-section">Connects to</p>
            <ul className="conn-list">
              {connections.map((c) => (
                <li key={c.other.id} className="conn-row">
                  <button className="conn-link" onClick={() => onSelect(c.other.id)}>
                    {c.type && <span className="conn-type">{c.type}</span>}
                    <span className="conn-name">{c.other.label}</span>
                  </button>
                  {c.description && <span className="conn-desc">{c.description}</span>}
                </li>
              ))}
            </ul>
          </>
        )}

        <nav className="panel-nav">
          <button onClick={() => onSelect(prev.id)}>‹ {prev.label}</button>
          <button onClick={() => onSelect(next.id)}>{next.label} ›</button>
        </nav>
      </div>
    </aside>
  )
}
