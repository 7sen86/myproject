import { getLibrarySettings } from "@/lib/settings";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const settings = await getLibrarySettings();

  return <LoginForm libraryName={settings.name} logoUrl={settings.logoUrl} />;
}
