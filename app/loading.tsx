export default function Loading() {
  return (
    <div
      className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Ачааллаж байна…</span>

      {/* Hero skeleton */}
      <div className="h-[260px] sm:h-[320px] bg-paper-100 border-4 border-ink-900 rounded-xl shadow-hard-lg animate-pulse" />

      {/* Title skeleton */}
      <div className="h-7 w-44 bg-paper-100 rounded-md animate-pulse mt-10 mb-4" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard-sm overflow-hidden"
          >
            <div className="aspect-square bg-paper-100 animate-pulse" />
            <div className="p-3 flex flex-col gap-2">
              <div className="h-4 w-3/4 bg-paper-100 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-paper-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
