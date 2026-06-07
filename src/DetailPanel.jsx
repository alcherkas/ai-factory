// The panel that slides in when a node is clicked. Pure data rendering —
// everything here comes from the selected node in data.js.
export default function DetailPanel({ node, allNodes, onSelect, onClose }) {
  if (!node) return null

  const byId = (id) => allNodes.find((n) => n.id === id)
  const idx = allNodes.findIndex((n) => n.id === node.id)
  const prev = allNodes[(idx - 1 + allNodes.length) % allNodes.length]
  const next = allNodes[(idx + 1) % allNodes.length]

  return (
    <aside className="panel">
      <button className="panel-close" onClick={onClose} aria-label="Close">
        ×
      </button>

      {/* keyed by node id so swapping entries replays the content fade,
          while the <aside> itself stays mounted (no re-slide on navigate) */}
      <div className="panel-body" key={node.id}>
        <p className="panel-kicker">Section</p>
        <h1 className="panel-title">{node.label}</h1>
        <p className="panel-desc">{node.description}</p>

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

        {node.connectsTo?.length > 0 && (
          <>
            <p className="panel-section">Connects to</p>
            <div className="chips">
              {node.connectsTo.map((id) => {
                const target = byId(id)
                if (!target) return null
                return (
                  <button key={id} className="chip" onClick={() => onSelect(id)}>
                    {target.label}
                  </button>
                )
              })}
            </div>
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
