export default function Loading() {
  return (
    <div className="mx-auto space-y-8 p-6 md:p-8 pt-6">
      <div>
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
      </div>

      <div className="space-y-6">
        <div className="h-10 w-full md:w-[600px] bg-muted animate-pulse rounded" />

        <div className="space-y-6">
          <div className="h-64 bg-muted animate-pulse rounded" />
          <div className="h-64 bg-muted animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
