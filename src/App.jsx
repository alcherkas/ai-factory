import { useEffect, useState } from 'react'
import ForceGraph from './ForceGraph.jsx'
import DetailPanel from './DetailPanel.jsx'
import { nodes, links } from './data.js'

// GitHub Pages gotcha #2: no server, so we route with the URL hash
// (e.g. #/token). Direct links and refreshes always resolve to index.html,
// and every entry still gets its own shareable URL.
function parseHash() {
  const id = decodeURIComponent(window.location.hash.replace(/^#\/?/, ''))
  return nodes.some((n) => n.id === id) ? id : null
}

export default function App() {
  const [selectedId, setSelectedId] = useState(parseHash)

  // hash -> state (browser back/forward, opening a shared link)
  useEffect(() => {
    const onHash = () => setSelectedId(parseHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // state -> hash
  const select = (id) => {
    setSelectedId(id)
    const target = id ? `#/${encodeURIComponent(id)}` : '#/'
    if (window.location.hash !== target) window.location.hash = target
  }

  const selectedNode = nodes.find((n) => n.id === selectedId) || null

  return (
    <div className="app">
      <ForceGraph nodes={nodes} links={links} selectedId={selectedId} onSelect={select} />
      <header className="brand">AI&nbsp;Factory</header>
      <DetailPanel node={selectedNode} allNodes={nodes} onSelect={select} onClose={() => select(null)} />
    </div>
  )
}
