export default function ProductLoading() {
  return (
    <div
      className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8"
      role="status"
      aria-busy="true"
    >
      <span className="sr-only">Бараа ачааллаж байна…</span>
      <div className="h-5 w-20 bg-paper-100 rounded animate-pulse mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-square bg-paper-100 border-4 border-ink-900 rounded-xl animate-pulse" />
        <div className="flex flex-col gap-4">
          <div className="h-6 w-32 bg-paper-100 rounded animate-pulse" />
          <div className="h-10 w-3/4 bg-paper-100 rounded animate-pulse" />
          <div className="h-8 w-40 bg-paper-100 rounded animate-pulse" />
          <div className="h-24 w-full bg-paper-100 rounded animate-pulse" />
          <div className="h-14 w-full bg-paper-100 rounded-pill animate-pulse mt-2" />
        </div>
      </div>
    </div>
  )
}
