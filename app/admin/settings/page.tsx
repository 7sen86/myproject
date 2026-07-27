import { getLibrarySettings } from "@/lib/settings";
import { updateLibrarySettings } from "../actions";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getLibrarySettings();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">إعدادات المكتبة</h1>
        <p className="text-sm text-mist">
          الاسم والشعار وبيانات التواصل والألوان تظهر تلقائيًا في كل الموقع
        </p>
      </div>

      <SettingsForm action={updateLibrarySettings} settings={settings} />
    </div>
  );
}
