const stack = [
  { rotate: "-6deg", top: "10%", right: "12%", color: "bg-ink", label: "فيزياء" },
  { rotate: "4deg", top: "26%", right: "34%", color: "bg-marker", label: "رياضيات" },
  { rotate: "-2deg", top: "4%", right: "48%", color: "bg-leaf", label: "عربي" },
];

export function HeroNotebookStack() {
  return (
    <div className="relative hidden h-72 w-full max-w-sm sm:block" aria-hidden="true">
      {stack.map((n, i) => (
        <div
          key={i}
          className="notebook-edge absolute h-44 w-32 rounded-xl bg-white pl-3 pr-5 py-3 shadow-card"
          style={{ transform: `rotate(${n.rotate})`, top: n.top, right: n.right }}
        >
          <div className={`h-2 w-8 rounded-full ${n.color}`} />
          <div className="mt-4 space-y-1.5">
            <div className="h-1.5 w-full rounded bg-ink-50" />
            <div className="h-1.5 w-4/5 rounded bg-ink-50" />
            <div className="h-1.5 w-2/3 rounded bg-ink-50" />
          </div>
          <span className="absolute bottom-3 right-5 text-[11px] font-medium text-mist">
            {n.label}
          </span>
        </div>
      ))}
    </div>
  );
}
