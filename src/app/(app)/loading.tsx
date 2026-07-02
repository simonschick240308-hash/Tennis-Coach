export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-8 w-64 animate-pulse rounded-md bg-muted" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-md border bg-muted/50" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-md border bg-muted/50" />
    </div>
  );
}
