import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "ink",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "ink" | "marker" | "leaf";
}) {
  const accentClasses = {
    ink: "bg-ink-50 text-ink",
    marker: "bg-marker-50 text-marker-dark",
    leaf: "bg-leaf/10 text-leaf",
  }[accent];

  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentClasses}`}>
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-charcoal">{value}</p>
      <p className="text-sm text-mist">{label}</p>
    </div>
  );
}
