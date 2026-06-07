import { useEffect, useMemo, useState } from 'react'
import ForceGraph from './ForceGraph.jsx'
import DetailPanel from './DetailPanel.jsx'
import SearchBar from './SearchBar.jsx'
import Legend from './Legend.jsx'
import { nodes, links } from './data.js'

// GitHub Pages gotcha #2: no server, so we route with the URL hash
// (e.g. #/spec-driven). Direct links and refreshes always resolve to
// index.html, and every entry still gets its own shareable URL.
function parseHash() {
  const id = decodeURIComponent(window.location.hash.replace(/^#\/?/, ''))
  return nodes.some((n) => n.id === id) ? id : null
}

export default function App() {
  const [selectedId, setSelectedId] = useState(parseHash)
  const [query, setQuery] = useState('')

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

  // case-insensitive substring match on label -> Set of matching ids
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return new Set()
    return new Set(nodes.filter((n) => n.label.toLowerCase().includes(q)).map((n) => n.id))
  }, [query])

  // Enter in the search box jumps to the first match (in node order)
  const submitSearch = () => {
    const first = nodes.find((n) => matches.has(n.id))
    if (first) select(first.id)
  }

  const reset = () => {
    select(null)
    setQuery('')
  }

  const selectedNode = nodes.find((n) => n.id === selectedId) || null

  return (
    <div className="app">
      <ForceGraph nodes={nodes} links={links} selectedId={selectedId} onSelect={select} matches={matches} />

      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} onSubmit={submitSearch} />
        {(selectedId || query) && (
          <button className="reset-btn" onClick={reset}>
            Reset view
          </button>
        )}
      </div>

      {!selectedId && <Legend />}
      <header className="brand">AI&nbsp;Factory</header>
      <DetailPanel node={selectedNode} allNodes={nodes} links={links} onSelect={select} onClose={() => select(null)} />
    </div>
  )
}
