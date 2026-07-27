export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-ink-50 ${className}`} />;
}

/** هيكل عظمي لصفحة فيها بطاقات إحصائيات + جدول/قائمة أسفلها */
export function StatsAndListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-5 shadow-card">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="mt-3 h-6 w-16" />
            <Skeleton className="mt-2 h-3 w-20" />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-4 shadow-card">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="mt-3 h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** هيكل عظمي لصفحة فورم مقسّمة إلى أقسام (مثل صفحة إعدادات المكتبة) */
export function FormSkeleton({ sections = 3 }: { sections?: number }) {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      {Array.from({ length: sections }).map((_, i) => (
        <div key={i} className="space-y-4 rounded-2xl bg-white p-6 shadow-card">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}
export function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-11 w-32 rounded-xl" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-4 shadow-card">
            <div className="flex items-center gap-3">
              <Skeleton className="h-14 w-14 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
