import { db } from "@/lib/db";
import { createSubject, deleteSubject, createStage, deleteStage } from "../actions";
import { DeleteRowButton } from "@/components/admin/DeleteRowButton";

export const dynamic = "force-dynamic";

function CatalogList({
  title,
  items,
  createAction,
  deleteAction,
  placeholder,
}: {
  title: string;
  items: { id: string; name: string }[];
  createAction: (formData: FormData) => void;
  deleteAction: (formData: FormData) => void;
  placeholder: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <h2 className="font-display text-lg font-bold text-charcoal">{title}</h2>

      <form action={createAction} className="mt-3 flex gap-2">
        <input
          name="name"
          required
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-ink/10 px-3 py-2 text-sm outline-none focus:border-ink/40"
        />
        <button className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink-light">
          إضافة
        </button>
      </form>

      <ul className="mt-4 divide-y divide-ink-50">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between py-2">
            <span className="text-sm text-charcoal">{item.name}</span>
            <DeleteRowButton
              action={deleteAction}
              id={item.id}
              itemLabel={item.name}
              successMessage="تم الحذف بنجاح"
            />
          </li>
        ))}
        {items.length === 0 && <li className="py-3 text-sm text-mist">لا توجد عناصر بعد</li>}
      </ul>
    </div>
  );
}

export default async function CatalogPage() {
  const [subjects, stages] = await Promise.all([
    db.subject.findMany({ orderBy: { name: "asc" } }),
    db.stage.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">المواد والمراحل</h1>
        <p className="text-sm text-mist">هذه القوائم تُستخدم عند إضافة أي ملزمة جديدة</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CatalogList
          title="المواد الدراسية"
          items={subjects}
          createAction={createSubject}
          deleteAction={deleteSubject}
          placeholder="مثال: أحياء"
        />
        <CatalogList
          title="المراحل الدراسية"
          items={stages}
          createAction={createStage}
          deleteAction={deleteStage}
          placeholder="مثال: الصف الأول الثانوي"
        />
      </div>
    </div>
  );
}
