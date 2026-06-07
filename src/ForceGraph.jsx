import { useEffect, useMemo, useRef, useState } from 'react'
import { forceSimulation, forceManyBody, forceLink, forceCenter, forceCollide } from 'd3-force'
import { select } from 'd3-selection'
import { zoom as d3zoom, zoomIdentity } from 'd3-zoom'
import 'd3-transition' // augments d3 selections with .transition() for smooth camera moves

// A force-directed graph: d3-force runs the physics (the "dynamically moving
// nodes"), React renders the SVG. On every simulation tick we bump a counter
// to re-render, reading the positions d3 mutates in place on each node.
export default function ForceGraph({ nodes, links, selectedId, onSelect }) {
  const svgRef = useRef(null)
  const simRef = useRef(null)
  const zoomRef = useRef(null)
  const dragRef = useRef(null)
  const [, setTick] = useState(0)
  const [transform, setTransform] = useState(zoomIdentity)
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))

  // node radius scales with how connected the concept is (degree)
  const radii = useMemo(() => {
    const deg = Object.fromEntries(nodes.map((n) => [n.id, 0]))
    for (const l of links) {
      deg[idOf(l.source)]++
      deg[idOf(l.target)]++
    }
    return Object.fromEntries(nodes.map((n) => [n.id, 10 + Math.sqrt(deg[n.id]) * 6]))
  }, [nodes, links])

  // the selected node + its direct neighbors (everything else dims)
  const neighbors = useMemo(() => {
    const set = new Set()
    if (selectedId) {
      set.add(selectedId)
      for (const l of links) {
        if (idOf(l.source) === selectedId) set.add(idOf(l.target))
        if (idOf(l.target) === selectedId) set.add(idOf(l.source))
      }
    }
    return set
  }, [selectedId, links])

  // build + run the simulation once
  useEffect(() => {
    const sim = forceSimulation(nodes)
      // stronger repulsion + longer links + a generous collision radius spread
      // the nodes out, which keeps their labels from piling on top of each other
      .force('charge', forceManyBody().strength(-650))
      .force('link', forceLink(links).id((d) => d.id).distance(120).strength(0.3))
      .force('center', forceCenter(size.w / 2, size.h / 2))
      .force('collide', forceCollide().radius((d) => radii[d.id] + 24))
      .on('tick', () => setTick((t) => t + 1))
    simRef.current = sim
    return () => sim.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, links])

  // keep the centering force in sync with the viewport
  useEffect(() => {
    const sim = simRef.current
    if (!sim) return
    sim.force('center', forceCenter(size.w / 2, size.h / 2))
    sim.alpha(0.3).restart()
  }, [size])

  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // zoom + pan on the whole canvas (but not when grabbing a node to drag it)
  useEffect(() => {
    const svg = select(svgRef.current)
    const z = d3zoom()
      .scaleExtent([0.3, 4])
      .filter((e) => e.type === 'wheel' || !e.target.closest('[data-node]'))
      .on('zoom', (e) => setTransform(e.transform))
    zoomRef.current = z
    svg.call(z)
    return () => svg.on('.zoom', null)
  }, [])

  // clicking a node: pin it as a focal point and re-heat the simulation so the
  // graph visibly re-settles around it (otherwise the layout is frozen on click)
  useEffect(() => {
    const sim = simRef.current
    if (!sim) return
    nodes.forEach((n) => {
      n.fx = null
      n.fy = null
    })
    if (selectedId) {
      const node = nodes.find((n) => n.id === selectedId)
      if (node && node.x != null) {
        node.fx = node.x
        node.fy = node.y
      }
    }
    sim.alpha(0.5).restart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  // ...and glide the camera so the focused node lands in the open space to the
  // left of the detail panel (or reset to the full graph when nothing's selected)
  useEffect(() => {
    const z = zoomRef.current
    if (!z || !svgRef.current) return
    const svg = select(svgRef.current)
    if (selectedId) {
      const node = nodes.find((n) => n.id === selectedId)
      if (!node || node.x == null) return
      const panelW = Math.min(520, window.innerWidth * 0.92)
      const focalX = (size.w - panelW) / 2
      const focalY = size.h / 2
      const k = 1.45
      const target = zoomIdentity.translate(focalX - k * node.x, focalY - k * node.y).scale(k)
      svg.transition().duration(650).call(z.transform, target)
    } else {
      svg.transition().duration(450).call(z.transform, zoomIdentity)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, size])

  // convert a screen point to graph coordinates (undo the current zoom transform)
  const toGraph = (clientX, clientY) => {
    const r = svgRef.current.getBoundingClientRect()
    return { x: (clientX - r.left - transform.x) / transform.k, y: (clientY - r.top - transform.y) / transform.k }
  }

  const onNodePointerDown = (e, node) => {
    e.stopPropagation()
    dragRef.current = { node, moved: false }
    const p = toGraph(e.clientX, e.clientY)
    node.fx = p.x
    node.fy = p.y
    simRef.current.alphaTarget(0.3).restart()
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    const d = dragRef.current
    if (!d) return
    d.moved = true
    const p = toGraph(e.clientX, e.clientY)
    d.node.fx = p.x
    d.node.fy = p.y
  }
  const onPointerUp = () => {
    const d = dragRef.current
    if (!d) return
    d.node.fx = null
    d.node.fy = null
    simRef.current.alphaTarget(0)
    dragRef.current = null
  }

  return (
    <svg
      ref={svgRef}
      className="graph"
      width={size.w}
      height={size.h}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onClick={() => onSelect(null)}
    >
      <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
        {links.map((l, i) => {
          const s = l.source
          const t = l.target
          if (typeof s !== 'object' || s.x == null || t.x == null) return null
          const active = !selectedId || (neighbors.has(s.id) && neighbors.has(t.id))
          return <line key={i} className="link" x1={s.x} y1={s.y} x2={t.x} y2={t.y} opacity={active ? 0.5 : 0.07} />
        })}
        {nodes.map((n) => {
          if (n.x == null) return null
          const r = radii[n.id]
          const dim = selectedId && !neighbors.has(n.id)
          const cls = `node${n.id === selectedId ? ' selected' : ''}${dim ? ' dim' : ''}`
          return (
            <g
              key={n.id}
              data-node="true"
              className={cls}
              transform={`translate(${n.x},${n.y})`}
              onPointerDown={(e) => onNodePointerDown(e, n)}
              onClick={(e) => {
                e.stopPropagation()
                if (!dragRef.current?.moved) onSelect(n.id)
              }}
            >
              <circle r={r} />
              <text dy={-r - 7}>{n.label}</text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

function idOf(endpoint) {
  return typeof endpoint === 'object' ? endpoint.id : endpoint
}
