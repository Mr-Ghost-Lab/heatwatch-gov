import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Droplets, HeartPulse, PhoneCall, ShieldCheck, SunMedium } from "lucide-react";
import { AuthenticatedPage } from "@/components/authenticated-page";
import { PageHeader } from "@/components/page-header";
import { PrototypeNotice } from "@/components/prototype-notice";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/health-metric")({
  head: () => ({
    meta: [
      { title: "Personal Health Metric — ThermoShield" },
      {
        name: "description",
        content:
          "A personal heat-safety guide that adapts precautions to age, physical state and medical conditions.",
      },
      { property: "og:title", content: "Personal Health Metric — ThermoShield" },
      {
        property: "og:description",
        content: "Personalised heat-health precautions for Chennai residents.",
      },
    ],
  }),
  component: () => (
    <AuthenticatedPage path="/health-metric">
      <HealthMetricModule />
    </AuthenticatedPage>
  ),
});

type Condition =
  | "heart"
  | "diabetes"
  | "respiratory"
  | "kidney"
  | "pregnancy"
  | "diuretics";

type Profile = {
  age: string;
  activity: string;
  symptoms: string;
  conditions: Condition[];
};

const CONDITIONS: { id: Condition; label: string; detail: string }[] = [
  { id: "heart", label: "Heart or blood-pressure condition", detail: "Cardiac disease, hypertension or prior stroke" },
  { id: "diabetes", label: "Diabetes", detail: "Type 1 or Type 2 diabetes" },
  { id: "respiratory", label: "Respiratory condition", detail: "Asthma, COPD or other breathing condition" },
  { id: "kidney", label: "Kidney condition", detail: "Chronic kidney disease or dialysis" },
  { id: "pregnancy", label: "Pregnant or recently delivered", detail: "Pregnancy or up to six weeks after delivery" },
  { id: "diuretics", label: "Taking water tablets", detail: "Diuretics or medicines affecting fluid balance" },
];

const BASE_PRECAUTIONS = [
  "Plan outdoor activity before 10:00 or after 16:00 and take frequent shade breaks.",
  "Drink water regularly; do not wait until you feel thirsty. Avoid alcohol during extreme heat.",
  "Wear loose, light-coloured clothing and use a hat or umbrella when outside.",
  "Check on older neighbours, children and anyone living alone during the hottest hours.",
];

function HealthMetricModule() {
  const [profile, setProfile] = useState<Profile>({ age: "", activity: "usual", symptoms: "well", conditions: [] });
  const [submitted, setSubmitted] = useState(false);

  const assessment = useMemo(() => buildAssessment(profile), [profile]);

  function toggleCondition(condition: Condition) {
    setSubmitted(false);
    setProfile((current) => ({
      ...current,
      conditions: current.conditions.includes(condition)
        ? current.conditions.filter((item) => item !== condition)
        : [...current.conditions, condition],
    }));
  }

  function updateProfile<K extends keyof Profile>(key: K, value: Profile[K]) {
    setSubmitted(false);
    setProfile((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Personal Health Metric"
        description="A practical heat-safety guide based on your age, current physical state and health conditions."
        meta="For residents · Review before each heatwave day"
      />
      <PrototypeNotice />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <section className="gov-panel p-5" aria-labelledby="profile-heading">
          <div className="flex items-start gap-3 border-b border-border pb-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <HeartPulse className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="profile-heading" className="text-base font-semibold text-foreground">Build your heat-safety profile</h2>
              <p className="mt-1 text-xs text-muted-foreground">Your answers stay in this session and are not shared.</p>
            </div>
          </div>

          <div className="mt-5 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="0"
                max="120"
                inputMode="numeric"
                placeholder="Enter your age"
                value={profile.age}
                onChange={(event) => updateProfile("age", event.target.value)}
              />
              <p className="text-xs text-muted-foreground">Age helps us identify heat-sensitive groups.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="activity">Physical state today</Label>
              <Select value={profile.activity} onValueChange={(value) => updateProfile("activity", value)}>
                <SelectTrigger id="activity" aria-label="Physical state today">
                  <SelectValue placeholder="Choose your physical state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usual">Feeling well and active as usual</SelectItem>
                  <SelectItem value="limited">Low energy or limited mobility today</SelectItem>
                  <SelectItem value="outdoor">Working or exercising outdoors today</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="symptoms">How are you feeling right now?</Label>
              <Select value={profile.symptoms} onValueChange={(value) => updateProfile("symptoms", value)}>
                <SelectTrigger id="symptoms" aria-label="How are you feeling right now">
                  <SelectValue placeholder="Choose how you feel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="well">Well — no unusual symptoms</SelectItem>
                  <SelectItem value="warning">Headache, heavy sweating, cramps or unusual tiredness</SelectItem>
                  <SelectItem value="urgent">Confusion, fainting, seizure or very hot skin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <fieldset>
              <legend className="text-sm font-medium text-foreground">Medical conditions or medicines</legend>
              <p className="mt-1 text-xs text-muted-foreground">Select all that apply. Choose none if nothing applies.</p>
              <div className="mt-3 space-y-2">
                {CONDITIONS.map((condition) => (
                  <label
                    key={condition.id}
                    className="flex cursor-pointer items-start gap-3 rounded-sm border border-border p-3 transition-colors hover:bg-muted/50"
                  >
                    <Checkbox
                      checked={profile.conditions.includes(condition.id)}
                      onCheckedChange={() => toggleCondition(condition.id)}
                      aria-label={condition.label}
                    />
                    <span className="-mt-0.5">
                      <span className="block text-sm font-medium text-foreground">{condition.label}</span>
                      <span className="block text-xs text-muted-foreground">{condition.detail}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <Button type="button" className="w-full" onClick={() => setSubmitted(true)} disabled={!profile.age}>
              Generate my health metric
            </Button>
            {!profile.age ? <p className="text-center text-xs text-muted-foreground">Enter your age to generate guidance.</p> : null}
          </div>
        </section>

        <section aria-live="polite" aria-labelledby="guidance-heading" className="space-y-4">
          <div className="gov-panel border-primary/30 bg-primary/5 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="gov-section-title">Your current guidance</p>
                <h2 id="guidance-heading" className="mt-2 text-xl font-semibold text-foreground">
                  {submitted && profile.age ? assessment.title : "Complete your profile"}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {submitted && profile.age
                    ? assessment.summary
                    : "Tell us a little about yourself to receive practical precautions for today."}
                </p>
              </div>
              <div className="hidden size-11 shrink-0 items-center justify-center rounded-sm border border-primary/20 bg-background text-primary sm:flex">
                <SunMedium className="size-6" aria-hidden="true" />
              </div>
            </div>
            {submitted && profile.age ? (
              <div className="mt-4 flex items-center gap-2 border-t border-primary/20 pt-4 text-sm font-semibold text-primary">
                <ShieldCheck className="size-4" aria-hidden="true" />
                {assessment.levelLabel}
              </div>
            ) : null}
          </div>

          {submitted && profile.age && profile.symptoms === "urgent" ? (
            <div className="gov-panel border-destructive/40 bg-destructive/5 p-5" role="alert">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-destructive">Get emergency help now</h3>
                  <p className="mt-1 text-sm text-foreground">Move to a cool place, have someone stay with you and call emergency services. Do not take fever medicine to treat suspected heat illness.</p>
                  <Button variant="destructive" size="sm" className="mt-3" asChild>
                    <a href="tel:108"><PhoneCall className="size-4" aria-hidden="true" /> Call 108</a>
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          <div className="gov-panel p-5">
            <div className="flex items-center gap-2">
              <Droplets className="size-4 text-primary" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-foreground">Precautions for you</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {assessment.precautions.map((precaution) => (
                <li key={precaution} className="flex gap-3 text-sm text-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-risk-low" aria-hidden="true" />
                  <span>{precaution}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="gov-panel p-5">
            <h3 className="text-sm font-semibold text-foreground">Warning signs to act on</h3>
            <p className="mt-2 text-sm text-muted-foreground">Stop activity and move to a cool place if you develop intense thirst, dizziness, nausea, weakness, cramps or a headache.</p>
            <p className="mt-3 border-t border-border pt-3 text-xs font-medium text-destructive">Confusion, fainting, seizure or loss of consciousness is an emergency. Call 108.</p>
          </div>
        </section>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        This tool provides general heat-safety information and is not a diagnosis or substitute for medical care. Follow your clinician&apos;s advice about fluid, salt and medication restrictions. If you have a medical condition or symptoms that concern you, contact a healthcare professional.
      </p>
    </div>
  );
}

function buildAssessment(profile: Profile) {
  const age = Number(profile.age);
  const olderAdult = age >= 65;
  const child = age > 0 && age <= 5;
  const higherRiskCondition = profile.conditions.length > 0;
  const highExposure = profile.activity === "outdoor";
  const urgent = profile.symptoms === "urgent";
  const precautions = [...BASE_PRECAUTIONS];

  if (olderAdult || child) {
    precautions.unshift("Stay in a cool, well-ventilated room during the hottest hours and ask someone to check on you twice a day.");
  }
  if (higherRiskCondition) {
    precautions.push("Keep prescribed medicines accessible, continue them as directed and ask your clinician how to manage them during extreme heat.");
  }
  if (profile.conditions.includes("heart") || profile.conditions.includes("kidney") || profile.conditions.includes("diuretics")) {
    precautions.push("Do not increase water or salt intake beyond your clinician's advice, especially if you have fluid restrictions.");
  }
  if (profile.conditions.includes("respiratory")) {
    precautions.push("Keep rescue inhalers or prescribed respiratory medicines with you and avoid smoky or poorly ventilated spaces.");
  }
  if (profile.conditions.includes("diabetes")) {
    precautions.push("Keep glucose treatment available and monitor your blood sugar as advised, since heat can affect glucose levels.");
  }
  if (profile.conditions.includes("pregnancy")) {
    precautions.push("Rest more often, avoid prolonged heat exposure and contact your maternity care team if you feel unwell.");
  }
  if (highExposure) {
    precautions.unshift("Schedule heavy work for cooler hours, use a shaded rest area and take a short cooling break at least every hour.");
  }
  if (profile.activity === "limited") {
    precautions.push("Keep a phone, water and a cool cloth within reach, and ask a family member or neighbour to check on you.");
  }

  if (urgent) {
    return {
      title: "Urgent symptoms reported",
      summary: "Your symptoms may indicate a serious heat illness. Follow the emergency steps below rather than waiting for this guide.",
      levelLabel: "Emergency action recommended",
      precautions,
    };
  }

  if (olderAdult || child || higherRiskCondition || highExposure || profile.activity === "limited") {
    return {
      title: "Take extra precautions today",
      summary: "Your profile includes factors that can make heat illness more likely. Keep activity light, stay cool and use the safeguards below.",
      levelLabel: "Increased heat sensitivity",
      precautions,
    };
  }

  return {
    title: "Standard heat-safety guidance",
    summary: "Your profile does not show an additional risk factor, but hot weather can affect anyone. Follow the basic precautions below.",
    levelLabel: "Routine precautions advised",
    precautions,
  };
}