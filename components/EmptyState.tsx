import { NotebookPen } from "lucide-react";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink/15 bg-white/60 px-6 py-16 text-center">
      <NotebookPen className="h-8 w-8 text-ink/30" strokeWidth={1.5} />
      <h3 className="font-display text-lg font-semibold text-charcoal">{title}</h3>
      <p className="max-w-sm text-sm text-mist">{description}</p>
    </div>
  );
}
