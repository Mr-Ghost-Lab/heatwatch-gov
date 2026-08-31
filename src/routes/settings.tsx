import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Settings2 } from "lucide-react";
import { AuthenticatedPage } from "@/components/authenticated-page";
import { PageHeader } from "@/components/page-header";
import { PrototypeNotice } from "@/components/prototype-notice";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [
    { title: "Settings — ThermoShield" },
    { name: "description", content: "Manage ThermoShield notification, display and accessibility preferences." },
    { property: "og:title", content: "Settings — ThermoShield" },
    { property: "og:description", content: "Manage your ThermoShield platform preferences." },
  ] }),
  component: () => <AuthenticatedPage path="/settings"><SettingsModule /></AuthenticatedPage>,
});

function SettingsModule() {
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("en");
  return <div className="space-y-6"><PageHeader title="Settings" description="Configure personal display and notification preferences for this session." meta="Preferences are stored locally in this prototype" /><PrototypeNotice /><section aria-labelledby="settings-heading" className="gov-panel max-w-2xl p-5"><div className="flex items-start gap-3 border-b border-border pb-4"><Settings2 className="mt-0.5 size-5 text-primary" aria-hidden="true" /><div><h2 id="settings-heading" className="font-semibold text-foreground">Platform preferences</h2><p className="mt-1 text-xs text-muted-foreground">These settings do not change alert thresholds or official data.</p></div></div><div className="mt-5 space-y-5"><div className="space-y-1.5"><Label htmlFor="language">Display language</Label><Select value={language} onValueChange={setLanguage}><SelectTrigger id="language" aria-label="Display language"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="ta">தமிழ் (Tamil)</SelectItem></SelectContent></Select></div><div className="flex items-start gap-3 rounded-sm border border-border p-3"><Checkbox id="notifications" checked={notifications} onCheckedChange={(checked) => setNotifications(checked === true)} /><div><Label htmlFor="notifications" className="cursor-pointer">Show alert notifications</Label><p className="mt-1 text-xs text-muted-foreground">Keep newly issued heat alerts visible in the response workspace.</p></div></div><Button type="button" onClick={() => { setSaved(true); window.setTimeout(() => setSaved(false), 2200); }}>{saved ? <Check className="size-4" aria-hidden="true" /> : null}{saved ? "Preferences saved" : "Save preferences"}</Button><p className="text-xs text-muted-foreground" aria-live="polite">{saved ? "Your preferences are saved for this session." : ""}</p></div></section></div>;
}