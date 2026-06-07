// Controlled search input. Typing filters the graph (matches highlight, the
// rest dim); Enter jumps to the top match.
export default function SearchBar({ value, onChange, onSubmit }) {
  return (
    <input
      className="searchbar"
      type="search"
      placeholder="Search concepts…"
      aria-label="Search concepts"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSubmit()
      }}
    />
  )
}
