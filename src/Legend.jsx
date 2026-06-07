// Decodes the monochrome line styles. Reuses the .link / .link-* classes so it
// always matches what the graph draws.
const ROWS = [
  { style: 'solid', label: 'enables · requires · feeds · part-of' },
  { style: 'dashed', label: 'mitigates · tradeoff' },
  { style: 'dotted', label: 'measures · contradicts' },
]

export default function Legend() {
  return (
    <div className="legend">
      <p className="legend-title">Connections</p>
      {ROWS.map((r) => (
        <div key={r.style} className="legend-row">
          <svg width="30" height="8" aria-hidden="true">
            <line className={`link link-${r.style}`} x1="1" y1="4" x2="29" y2="4" strokeWidth="1.5" />
          </svg>
          <span>{r.label}</span>
        </div>
      ))}
      <p className="legend-note">Hover a line for its relationship · thickness = strength</p>
    </div>
  )
}
