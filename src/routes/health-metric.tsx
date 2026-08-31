import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Droplets,
  HeartPulse,
  PhoneCall,
  ShieldCheck,
  Snowflake,
  SunMedium,
} from "lucide-react";
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
          "A personal heat-safety guide that adapts precautions, hydration, cooling and urgency to age, activity and health conditions.",
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

type Condition = "heart" | "diabetes" | "respiratory" | "kidney" | "pregnancy" | "diuretics";
type PhysicalState = "well" | "fatigued" | "unwell";
type ActivityLevel = "resting" | "light" | "outdoor";
type Symptoms = "well" | "warning" | "urgent";
type Urgency = "ROUTINE" | "ELEVATED" | "URGENT";

type Profile = {
  age: string;
  physicalState: PhysicalState;
  activity: ActivityLevel;
  symptoms: Symptoms;
  conditions: Condition[];
};

type Assessment = {
  title: string;
  summary: string;
  urgency: Urgency;
  urgencyLabel: string;
  precautions: string[];
  hydrationTips: string[];
  coolingGuidance: string[];
};

const CONDITIONS: { id: Condition; label: string; detail: string }[] = [
  { id: "heart", label: "Heart or blood-pressure condition", detail: "Cardiac disease, hypertension or prior stroke" },
  { id: "diabetes", label: "Diabetes", detail: "Type 1 or Type 2 diabetes" },
  { id: "respiratory", label: "Respiratory condition", detail: "Asthma, COPD or another breathing condition" },
  { id: "kidney", label: "Kidney condition", detail: "Chronic kidney disease or dialysis" },
  { id: "pregnancy", label: "Pregnant or recently delivered", detail: "Pregnancy or up to six weeks after delivery" },
  { id: "diuretics", label: "Taking water tablets", detail: "Diuretics or medicines affecting fluid balance" },
];

const STEPS = [
  { title: "Age", prompt: "How old is the person who needs guidance?" },
  { title: "Physical state", prompt: "How is the person feeling physically today?" },
  { title: "Activity", prompt: "What level of activity is planned today?" },
  { title: "Health conditions", prompt: "Which conditions or medicines should we consider?" },
  { title: "Symptoms", prompt: "Are there any heat-illness symptoms right now?" },
] as const;

const BASE_PRECAUTIONS = [
  "Plan outdoor activity before 10:00 or after 16:00 and take frequent shade breaks.",
  "Wear loose, light-coloured clothing and use a hat or umbrella when outside.",
  "Check on older neighbours, children and anyone living alone during the hottest hours.",
];

const profileSchema = z.object({
  age: z
    .string()
    .trim()
    .min(1, "Enter an age to continue.")
    .regex(/^\d+$/, "Age must be a whole number.")
    .refine((value) => Number(value) >= 0 && Number(value) <= 120, "Enter an age between 0 and 120."),
});

function HealthMetricModule() {
  const [profile, setProfile] = useState<Profile>({
    age: "",
    physicalState: "well",
    activity: "resting",
    symptoms: "well",
    conditions: [],
  });
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [ageError, setAgeError] = useState("");
  const assessment = useMemo(() => buildAssessment(profile), [profile]);

  function updateProfile<K extends keyof Profile>(key: K, value: Profile[K]) {
    setSubmitted(false);
    if (key === "age") setAgeError("");
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function toggleCondition(condition: Condition) {
    setSubmitted(false);
    setProfile((current) => ({
      ...current,
      conditions: current.conditions.includes(condition)
        ? current.conditions.filter((item) => item !== condition)
        : [...current.conditions, condition],
    }));
  }

  function nextStep() {
    if (step === 0) {
      const result = profileSchema.safeParse({ age: profile.age });
      if (!result.success) {
        setAgeError(result.error.issues[0]?.message ?? "Enter a valid age.");
        return;
      }
    }
    setAgeError("");
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  }

  function generateGuidance() {
    const result = profileSchema.safeParse({ age: profile.age });
    if (!result.success) {
      setStep(0);
      setAgeError(result.error.issues[0]?.message ?? "Enter a valid age.");
      return;
    }
    setSubmitted(true);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Personal Health Metric"
        description="A step-by-step heat-safety guide based on age, physical state, activity and health conditions."
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
              <h2 id="profile-heading" className="text-base font-semibold text-foreground">
                Build your heat-safety profile
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">Your answers stay in this session and are not shared.</p>
            </div>
          </div>

          <div className="mt-5" aria-label={`Health Metric step ${step + 1} of ${STEPS.length}`}>
            <div className="flex items-center justify-between gap-3">
              <p className="gov-section-title">Step {step + 1} of {STEPS.length}</p>
              <p className="text-xs font-medium text-muted-foreground">{STEPS[step].title}</p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-sm bg-muted" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-label="Health Metric progress">
              <div className="h-full bg-primary transition-[width] duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
            </div>

            <div className="mt-5 min-h-[280px]" aria-live="polite">
              {step === 0 ? (
                <div className="space-y-2">
                  <Label htmlFor="health-age">{STEPS[0].prompt}</Label>
                  <Input
                    id="health-age"
                    type="number"
                    min="0"
                    max="120"
                    step="1"
                    inputMode="numeric"
                    placeholder="Enter age in years"
                    value={profile.age}
                    onChange={(event) => updateProfile("age", event.target.value)}
                    aria-invalid={Boolean(ageError)}
                    aria-describedby="health-age-help health-age-error"
                  />
                  <p id="health-age-help" className="text-xs text-muted-foreground">Age helps identify people who are more sensitive to heat.</p>
                  {ageError ? <p id="health-age-error" className="text-sm font-medium text-destructive" role="alert">{ageError}</p> : null}
                </div>
              ) : null}

              {step === 1 ? (
                <div className="space-y-2">
                  <Label htmlFor="physical-state">{STEPS[1].prompt}</Label>
                  <Select value={profile.physicalState} onValueChange={(value) => updateProfile("physicalState", value as PhysicalState)}>
                    <SelectTrigger id="physical-state" aria-label="Physical state today">
                      <SelectValue placeholder="Choose physical state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="well">Feeling well and active as usual</SelectItem>
                      <SelectItem value="fatigued">Low energy or more tired than usual</SelectItem>
                      <SelectItem value="unwell">Unwell or finding normal activities difficult</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Choose the closest description, even if symptoms are mild.</p>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="space-y-2">
                  <Label htmlFor="activity-level">{STEPS[2].prompt}</Label>
                  <Select value={profile.activity} onValueChange={(value) => updateProfile("activity", value as ActivityLevel)}>
                    <SelectTrigger id="activity-level" aria-label="Activity level today">
                      <SelectValue placeholder="Choose activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resting">Mostly resting indoors</SelectItem>
                      <SelectItem value="light">Light activity or short outdoor trips</SelectItem>
                      <SelectItem value="outdoor">Outdoor work, exercise or prolonged travel</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Include work, exercise, commuting or caring duties.</p>
                </div>
              ) : null}

              {step === 3 ? (
                <fieldset>
                  <legend className="text-sm font-medium text-foreground">{STEPS[3].prompt}</legend>
                  <p className="mt-1 text-xs text-muted-foreground">Select all that apply. Leave unselected if none apply.</p>
                  <div className="mt-3 space-y-2">
                    {CONDITIONS.map((condition) => (
                      <label key={condition.id} className="flex cursor-pointer items-start gap-3 rounded-sm border border-border p-3 transition-colors hover:bg-muted/50">
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
              ) : null}

              {step === 4 ? (
                <div className="space-y-2">
                  <Label htmlFor="symptoms">{STEPS[4].prompt}</Label>
                  <Select value={profile.symptoms} onValueChange={(value) => updateProfile("symptoms", value as Symptoms)}>
                    <SelectTrigger id="symptoms" aria-label="Current heat illness symptoms">
                      <SelectValue placeholder="Choose current symptoms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="well">No unusual symptoms</SelectItem>
                      <SelectItem value="warning">Headache, heavy sweating, cramps or unusual tiredness</SelectItem>
                      <SelectItem value="urgent">Confusion, fainting, seizure or very hot skin</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">If serious symptoms are present, call 108 now rather than waiting for guidance.</p>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
              <Button type="button" variant="ghost" onClick={() => setStep((current) => Math.max(current - 1, 0))} disabled={step === 0}>
                <ChevronLeft className="size-4" aria-hidden="true" /> Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  Continue <ChevronRight className="size-4" aria-hidden="true" />
                </Button>
              ) : (
                <Button type="button" onClick={generateGuidance}>
                  Generate my guidance <ShieldCheck className="size-4" aria-hidden="true" />
                </Button>
              )}
            </div>
            {!submitted && step === STEPS.length - 1 ? <p className="mt-2 text-right text-xs text-muted-foreground">Your answers are used only to tailor this session&apos;s recommendations.</p> : null}
          </div>
        </section>

        <section aria-live="polite" aria-labelledby="guidance-heading" className="space-y-4">
          <div className="gov-panel border-primary/30 bg-primary/5 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="gov-section-title">Your current guidance</p>
                <h2 id="guidance-heading" className="mt-2 text-xl font-semibold text-foreground">
                  {submitted ? assessment.title : "Complete your profile"}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {submitted ? assessment.summary : "Answer the guided questions to receive practical precautions for today."}
                </p>
              </div>
              <div className="hidden size-11 shrink-0 items-center justify-center rounded-sm border border-primary/20 bg-background text-primary sm:flex">
                <SunMedium className="size-6" aria-hidden="true" />
              </div>
            </div>
            {submitted ? (
              <div className="mt-4 flex items-center gap-2 border-t border-primary/20 pt-4 text-sm font-semibold text-primary">
                <ShieldCheck className="size-4" aria-hidden="true" />
                {assessment.urgencyLabel}
              </div>
            ) : null}
          </div>

          <div className="gov-panel border-2 border-risk-critical bg-risk-critical-surface p-5 text-foreground" role="alert" aria-labelledby="emergency-heading">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-6 shrink-0 text-risk-critical" aria-hidden="true" />
              <div className="min-w-0">
                <p className="gov-section-title text-risk-critical">Immediate safety threshold</p>
                <h2 id="emergency-heading" className="mt-1 text-lg font-bold text-risk-critical">Seek help now</h2>
                <p className="mt-2 text-sm font-medium">Call 108 immediately for confusion, fainting, seizure, loss of consciousness, inability to drink, or very hot skin with worsening symptoms.</p>
                <p className="mt-2 text-sm">Move to a cool place, loosen clothing, cool the body with wet cloths and have someone stay with the person. Do not wait for this tool to finish.</p>
                <Button variant="destructive" className="mt-4 min-h-11 w-full sm:w-auto" asChild>
                  <a href="tel:108" aria-label="Call emergency services at 108">
                    <PhoneCall className="size-4" aria-hidden="true" /> Call 108 now
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {submitted && assessment.urgency === "URGENT" ? (
            <div className="gov-panel border-2 border-risk-critical bg-risk-critical-surface p-4" role="status">
              <p className="text-sm font-bold text-risk-critical">Your answers indicate an urgent situation. Use the emergency panel above now.</p>
            </div>
          ) : null}

          <RecommendationList icon={<CheckCircle2 className="size-4 text-risk-low" aria-hidden="true" />} title="Tailored precautions" items={submitted ? assessment.precautions : BASE_PRECAUTIONS} />
          <RecommendationList icon={<Droplets className="size-4 text-primary" aria-hidden="true" />} title="Hydration tips" items={submitted ? assessment.hydrationTips : ["Drink water regularly and do not wait until you feel thirsty.", "If a clinician has given fluid or salt limits, follow that advice instead of increasing intake."]} />
          <RecommendationList icon={<Snowflake className="size-4 text-primary" aria-hidden="true" />} title="Cooling guidance" items={submitted ? assessment.coolingGuidance : ["Stay in the coolest, well-ventilated room available during the hottest hours.", "Use a cool wet cloth, fan or cool shower to lower body temperature."]} />
        </section>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        This tool provides general heat-safety information and is not a diagnosis or substitute for medical care. Follow your clinician&apos;s advice about fluid, salt and medication restrictions. If you have a medical condition or symptoms that concern you, contact a healthcare professional.
      </p>
    </div>
  );
}

function RecommendationList({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="gov-panel p-5">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm text-foreground">
            <span aria-hidden="true" className="mt-0.5 size-1.5 shrink-0 rounded-full bg-foreground" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function buildAssessment(profile: Profile): Assessment {
  const age = Number(profile.age);
  const olderAdult = age >= 65;
  const youngChild = age >= 0 && age <= 5;
  const higherRiskCondition = profile.conditions.length > 0;
  const highExposure = profile.activity === "outdoor";
  const urgentSymptoms = profile.symptoms === "urgent";
  const warningSymptoms = profile.symptoms === "warning";
  const elevatedFactors = olderAdult || youngChild || higherRiskCondition || highExposure || profile.physicalState !== "well";
  const precautions = [...BASE_PRECAUTIONS];
  const hydrationTips = [
    "Drink small amounts of water regularly; do not wait until thirst begins.",
    "Carry water when leaving home and take a drink at every cooling break.",
  ];
  const coolingGuidance = [
    "Use a fan with a cool wet cloth or take a cool shower; avoid direct ice on the skin.",
    "Keep curtains or blinds closed on sunny windows and rest in the coolest available room.",
  ];

  if (olderAdult || youngChild) {
    precautions.unshift("Stay in a cool, well-ventilated room during the hottest hours and ask someone to check on you twice a day.");
    coolingGuidance.unshift("Arrange a check-in with a family member, neighbour or caregiver during the hottest hours.");
  }
  if (highExposure) {
    precautions.unshift("Schedule heavy work for cooler hours, use a shaded rest area and take a cooling break at least every hour.");
    hydrationTips.unshift("Take a shaded rest and water break at least every hour; stop work if dizziness, cramps or unusual tiredness starts.");
  }
  if (profile.physicalState === "fatigued") {
    precautions.push("Reduce exertion today and tell someone nearby that you may need help getting to a cool place.");
  }
  if (profile.physicalState === "unwell" || warningSymptoms) {
    precautions.unshift("Stop strenuous activity, move to a cool place and ask another person to stay nearby while you recover.");
    coolingGuidance.unshift("If symptoms do not improve quickly after cooling and rest, seek same-day medical advice.");
  }
  if (higherRiskCondition) {
    precautions.push("Keep prescribed medicines accessible, continue them as directed and ask your clinician how to manage them during extreme heat.");
  }
  if (profile.conditions.includes("heart") || profile.conditions.includes("kidney") || profile.conditions.includes("diuretics")) {
    hydrationTips.push("Do not increase water, salt or electrolyte drinks beyond your clinician's advice if you have fluid or salt restrictions.");
  } else {
    hydrationTips.push("If you have been sweating for a long period, ask a health professional whether an oral rehydration solution is appropriate.");
  }
  if (profile.conditions.includes("respiratory")) {
    precautions.push("Keep rescue inhalers or prescribed respiratory medicines with you and avoid smoky or poorly ventilated spaces.");
  }
  if (profile.conditions.includes("diabetes")) {
    precautions.push("Keep glucose treatment available and monitor blood sugar as advised, since heat can affect glucose levels.");
  }
  if (profile.conditions.includes("pregnancy")) {
    precautions.push("Rest more often, avoid prolonged heat exposure and contact your maternity care team if you feel unwell.");
  }

  if (urgentSymptoms) {
    return {
      title: "Urgent symptoms reported",
      summary: "Your answers include symptoms that may indicate serious heat illness. Follow the emergency steps now rather than waiting for this guide.",
      urgency: "URGENT",
      urgencyLabel: "Emergency action recommended",
      precautions,
      hydrationTips: ["Do not force fluids if the person is confused, drowsy, vomiting or unable to swallow safely."],
      coolingGuidance: ["Call 108, move to a cool place and cool the body while waiting for emergency help."],
    };
  }
  if (warningSymptoms || profile.physicalState === "unwell") {
    return {
      title: "Act early on warning symptoms",
      summary: "Stop activity and cool down now. If symptoms do not improve quickly, contact a healthcare professional today.",
      urgency: "URGENT",
      urgencyLabel: "Urgent review advised",
      precautions,
      hydrationTips,
      coolingGuidance,
    };
  }
  if (elevatedFactors) {
    return {
      title: "Take extra precautions today",
      summary: "Your profile includes factors that can make heat illness more likely. Keep activity light, stay cool and use the safeguards below.",
      urgency: "ELEVATED",
      urgencyLabel: "Increased heat sensitivity",
      precautions,
      hydrationTips,
      coolingGuidance,
    };
  }
  return {
    title: "Standard heat-safety guidance",
    summary: "Your profile does not show an additional risk factor, but hot weather can affect anyone. Follow the recommendations below.",
    urgency: "ROUTINE",
    urgencyLabel: "Routine precautions advised",
    precautions,
    hydrationTips,
    coolingGuidance,
  };
}