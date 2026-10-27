"use client";

import { Check, Mail, NotebookPen, ScanEye, Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { MayaFace, type MayaMood } from "./MayaFace";

/**
 * The signature interaction: Maya working on a Mac, one command at a time.
 * keys → listening (the words type in) → thinking (steps tick) →
 * speaking (her reply) → holding (the result stays) → next command.
 * Every name, email and number on the stage is sample data.
 */
type Phase = "keys" | "listening" | "thinking" | "speaking" | "holding";

type Scenario = {
  id: "mail" | "screen" | "mac";
  chip: string;
  keys: [string, string];
  keysLabel: string;
  heard: string;
  heardInEnglish?: string;
  steps: string[];
  reply: string;
  replyInEnglish?: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "mail",
    chip: "Check my Gmail",
    keys: ["⌃", "⇧"],
    keysLabel: "Control + Shift",
    heard: "Hey Maya, aaj ki important mails dikhao",
    heardInEnglish: "show me today's important mail",
    steps: ["Read 7 days of inbox, on your Mac", "Sorted into 10 groups", "3 need you today"],
    reply: "तीन ज़रूरी mails हैं, और एक interview का भी!",
    replyInEnglish: "Three need you, and one is an interview!",
  },
  {
    id: "screen",
    chip: "Explain my screen",
    keys: ["⌃", "⌥"],
    keysLabel: "Control + Option shares the screen",
    heard: "What does this chart mean?",
    steps: ["Looked at your screen", "Found the March bar", "Drew on your screen"],
    reply: "Sales dipped in March, about a third. I circled it.",
  },
  {
    id: "mac",
    chip: "Open Notes, lower the volume",
    keys: ["⌃", "⇧"],
    keysLabel: "Control + Shift",
    heard: "Notes kholo aur volume thoda kam karo",
    heardInEnglish: "open Notes and turn the volume down a bit",
    steps: ["Opened Notes", "Volume 70% → 40%"],
    reply: "Notes खोल दिया, volume भी कम कर दिया।",
    replyInEnglish: "Opened Notes, and turned the volume down.",
  },
];

const PHASE_MOOD: Record<Phase, MayaMood> = {
  keys: "resting",
  listening: "listening",
  thinking: "thinking",
  speaking: "speaking",
  holding: "resting",
};

const TYPE_MS = 38;
const STEP_MS = 620;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void) {
  const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  motionQuery.addEventListener("change", onChange);
  return () => motionQuery.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

export function CommandStage() {
  // Opens on a finished command (also the server-rendered, no-JS frame), then the loop moves on.
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("holding");
  const [typedCount, setTypedCount] = useState(SCENARIOS[0].heard.length);
  const [doneSteps, setDoneSteps] = useState(SCENARIOS[0].steps.length);
  const [isVisible, setIsVisible] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  const scenario = SCENARIOS[scenarioIndex];

  const startScenario = useCallback((nextIndex: number) => {
    setScenarioIndex(nextIndex);
    setPhase("keys");
    setTypedCount(0);
    setDoneSteps(0);
  }, []);

  // Run only while the stage is on screen.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || reduceMotion) return;
    let timer: number;
    if (phase === "keys") {
      timer = window.setTimeout(() => setPhase("listening"), 900);
    } else if (phase === "listening") {
      timer =
        typedCount < scenario.heard.length
          ? window.setTimeout(() => setTypedCount((count) => count + 1), TYPE_MS)
          : window.setTimeout(() => setPhase("thinking"), 450);
    } else if (phase === "thinking") {
      timer =
        doneSteps < scenario.steps.length
          ? window.setTimeout(() => setDoneSteps((count) => count + 1), STEP_MS)
          : window.setTimeout(() => setPhase("speaking"), 300);
    } else if (phase === "speaking") {
      timer = window.setTimeout(() => setPhase("holding"), 2600);
    } else {
      timer = window.setTimeout(() => startScenario((scenarioIndex + 1) % SCENARIOS.length), 3200);
    }
    return () => window.clearTimeout(timer);
  }, [phase, typedCount, doneSteps, isVisible, reduceMotion, scenario, scenarioIndex, startScenario]);

  // Under reduced motion each command shows its finished state; the loop never runs.
  const shownPhase: Phase = reduceMotion ? "holding" : phase;
  const shownTypedCount = reduceMotion ? scenario.heard.length : typedCount;
  const shownDoneSteps = reduceMotion ? scenario.steps.length : doneSteps;
  const resultIsShown = shownDoneSteps === scenario.steps.length;
  const keysAreDown = shownPhase === "keys" || shownPhase === "listening";

  return (
    <div ref={stageRef} className="w-full">
      {/* Pick a command */}
      <div className="mb-5 flex flex-wrap justify-center gap-2.5" role="group" aria-label="Pick a command for Maya">
        {SCENARIOS.map((choice, choiceIndex) => {
          const isCurrent = choiceIndex === scenarioIndex;
          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => startScenario(choiceIndex)}
              aria-pressed={isCurrent}
              className={`press cut-sm cursor-pointer rounded-full px-4 py-1.5 font-label text-[15px] font-semibold uppercase tracking-wide ${
                isCurrent ? "bg-star text-ink" : "bg-paper text-ink/80 hover:text-ink"
              }`}
            >
              {choice.chip}
            </button>
          );
        })}
      </div>

      {/* The Mac */}
      <div className="cut relative overflow-hidden rounded-[22px] bg-twilight">
        <MenuBar mood={PHASE_MOOD[shownPhase]} />
        <div className="relative grid gap-4 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-6">
          <ResultWindow scenario={scenario} isShown={resultIsShown} cursorIsAtTarget={shownPhase !== "keys" && shownPhase !== "listening"} cursorMood={PHASE_MOOD[shownPhase]} />
          <VoiceCard
            scenario={scenario}
            phase={shownPhase}
            typedCount={shownTypedCount}
            doneSteps={shownDoneSteps}
            keysAreDown={keysAreDown}
          />
        </div>
        <p className="absolute bottom-2 left-4 font-label text-[11px] uppercase tracking-widest text-lav-l/60">
          Sample data · demo
        </p>
      </div>
      <p className="sr-only" aria-live="polite">
        {shownPhase === "speaking" || shownPhase === "holding" ? `Maya: ${scenario.replyInEnglish ?? scenario.reply}` : ""}
      </p>
    </div>
  );
}

function MenuBar({ mood }: { mood: MayaMood }) {
  return (
    <div className="flex items-center justify-between border-b-[2.5px] border-ink bg-paper px-4 py-1.5 text-[13px] font-semibold text-ink">
      <div className="flex gap-4">
        <span className="font-bold">Finder</span>
        <span className="hidden sm:inline">File</span>
        <span className="hidden sm:inline">Edit</span>
        <span className="hidden sm:inline">View</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="-my-3 inline-flex scale-[0.85]">
          <MayaFace mood={mood} size={18} />
        </span>
        <span className="tabular-nums">9:41</span>
      </div>
    </div>
  );
}

function VoiceCard({
  scenario,
  phase,
  typedCount,
  doneSteps,
  keysAreDown,
}: {
  scenario: Scenario;
  phase: Phase;
  typedCount: number;
  doneSteps: number;
  keysAreDown: boolean;
}) {
  const isReplying = phase === "speaking" || phase === "holding";
  return (
    <div className="cut flex flex-col gap-4 rounded-[18px] bg-night-2 p-4 text-moon sm:p-5">
      <div className="flex items-center gap-3">
        {scenario.keys.map((keyLabel) => (
          <kbd
            key={keyLabel}
            className={`grid h-11 w-11 place-items-center rounded-lg border-2 border-ink font-sans text-xl text-ink transition-all duration-150 ${
              keysAreDown ? "translate-y-[3px] bg-lav shadow-[0_1px_0_#05040f]" : "bg-paper shadow-[0_4px_0_#05040f]"
            }`}
          >
            {keyLabel}
          </kbd>
        ))}
        <span className="font-label text-sm uppercase tracking-wide text-lav-l/80">{scenario.keysLabel}</span>
      </div>

      <div className="min-h-[4.5rem]">
        <p className="font-mono text-[15px] leading-snug text-moon">
          {typedCount > 0 && <span className="text-lav">“</span>}
          {scenario.heard.slice(0, typedCount)}
          {phase === "listening" && <span className="ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] bg-lav" />}
          {typedCount === scenario.heard.length && <span className="text-lav">”</span>}
        </p>
        {scenario.heardInEnglish && typedCount === scenario.heard.length && (
          <p className="mt-1 text-sm text-lav-l/70">({scenario.heardInEnglish})</p>
        )}
      </div>

      <ul className="flex flex-col gap-2">
        {scenario.steps.map((step, stepIndex) => {
          const isDone = stepIndex < doneSteps;
          return (
            <li key={step} className={`flex items-center gap-2.5 text-[15px] ${isDone ? "text-moon" : "text-moon/35"}`}>
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                  isDone ? "border-mint bg-mint text-ink" : "border-moon/30"
                }`}
              >
                {isDone && <Check size={13} strokeWidth={3.2} />}
              </span>
              {step}
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex items-end gap-3">
        <span className="-mb-4 -ml-4 shrink-0">
          <MayaFace mood={PHASE_MOOD[phase]} size={46} />
        </span>
        <div
          className={`cut-sm relative rounded-2xl rounded-bl-sm bg-paper px-3.5 py-2 text-ink transition-all duration-300 ${
            isReplying ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
          }`}
        >
          <p lang={scenario.replyInEnglish ? "hi" : "en"} className="font-hand text-lg leading-snug font-bold">
            {scenario.reply}
          </p>
          {scenario.replyInEnglish && <p className="text-[13px] text-ink/70">{scenario.replyInEnglish}</p>}
        </div>
      </div>
    </div>
  );
}

/** Where Maya's cursor lands for each command, in % of the result window. */
const CURSOR_TARGETS: Record<Scenario["id"], { left: string; top: string }> = {
  mail: { left: "46%", top: "34%" },
  screen: { left: "60%", top: "50%" },
  mac: { left: "52%", top: "24%" },
};

function ResultWindow({
  scenario,
  isShown,
  cursorIsAtTarget,
  cursorMood,
}: {
  scenario: Scenario;
  isShown: boolean;
  cursorIsAtTarget: boolean;
  cursorMood: MayaMood;
}) {
  const cursorPosition = cursorIsAtTarget ? CURSOR_TARGETS[scenario.id] : { left: "94%", top: "2%" };
  return (
    <div className="cut relative min-h-[17rem] overflow-hidden rounded-[18px] bg-paper text-ink">
      {/* Maya's face is her cursor, as in the app: it flies from the menu bar to what she's working on. */}
      <span
        className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
        style={cursorPosition}
        aria-hidden
      >
        <span className="block drop-shadow-[2px_3px_0_rgb(28_22_58/0.35)]">
          <MayaFace mood={cursorMood} size={24} />
        </span>
      </span>
      <div className="flex items-center gap-2 border-b-2 border-ink/80 px-3.5 py-2">
        <span className="h-3 w-3 rounded-full border-[1.5px] border-ink bg-blush" />
        <span className="h-3 w-3 rounded-full border-[1.5px] border-ink bg-star" />
        <span className="h-3 w-3 rounded-full border-[1.5px] border-ink bg-mint" />
        <span className="ml-2 flex items-center gap-1.5 font-label text-sm font-bold uppercase tracking-wide">
          {scenario.id === "mail" && (
            <>
              <Mail size={15} strokeWidth={2.4} /> Maya · Mail digest
            </>
          )}
          {scenario.id === "screen" && (
            <>
              <ScanEye size={15} strokeWidth={2.4} /> Q1 report · browser
            </>
          )}
          {scenario.id === "mac" && (
            <>
              <NotebookPen size={15} strokeWidth={2.4} /> Notes
            </>
          )}
        </span>
      </div>
      <div className="p-4">
        {scenario.id === "mail" && <MailDigest isShown={isShown} />}
        {scenario.id === "screen" && <ChartWithDrawing isShown={isShown} />}
        {scenario.id === "mac" && <NotesAndVolume isShown={isShown} />}
      </div>
    </div>
  );
}

const SAMPLE_MAIL = [
  { from: "Riya · Nimbus Labs", subject: "Interview on Thursday, 3:30 PM", tag: "Interview", needsYou: true },
  { from: "Prof. Mehta", subject: "Project review moved to Monday", tag: "Study", needsYou: true },
  { from: "Arjun", subject: "Can you send today's notes?", tag: "People", needsYou: true },
  { from: "Kite Bank", subject: "Your card statement is ready", tag: "Money", needsYou: false },
];

function MailDigest({ isShown }: { isShown: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-label text-[15px] font-bold uppercase tracking-wide text-plum">Needs you · 3</p>
      {SAMPLE_MAIL.map((mail, mailIndex) => (
        <div
          key={mail.subject}
          className={`flex items-start justify-between gap-3 rounded-xl border-2 px-3 py-2 transition-all duration-500 ${
            mail.needsYou ? "border-ink bg-white" : "border-ink/25 bg-transparent"
          } ${isShown ? "opacity-100" : "opacity-25"}`}
          style={{ transitionDelay: isShown ? `${mailIndex * 90}ms` : "0ms" }}
        >
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold">{mail.subject}</p>
            <p className="truncate text-[13px] text-ink/65">{mail.from}</p>
          </div>
          <span
            className={`shrink-0 rounded-full border-2 border-ink px-2 py-0.5 font-label text-xs font-bold uppercase ${
              mail.tag === "Interview" ? "bg-star" : "bg-lav-l"
            }`}
          >
            {mail.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

const CHART_BARS = [
  { month: "Jan", value: 78 },
  { month: "Feb", value: 84 },
  { month: "Mar", value: 55 },
  { month: "Apr", value: 88 },
];

function ChartWithDrawing({ isShown }: { isShown: boolean }) {
  return (
    <div>
      <p className="text-[15px] font-semibold">Monthly sales, first quarter</p>
      <div className="relative mt-3 flex h-44 items-end gap-5 border-b-2 border-l-2 border-ink/70 px-4">
        {CHART_BARS.map((bar) => (
          <div key={bar.month} className="relative flex flex-1 flex-col items-center gap-1.5">
            <div
              className={`w-full rounded-t-md border-2 border-ink ${bar.month === "Mar" ? "bg-blush" : "bg-lav"}`}
              style={{ height: `${bar.value * 1.6}px` }}
            />
            <span className="font-label text-sm font-bold uppercase">{bar.month}</span>
            {bar.month === "Mar" && (
              /* Maya's pen: a hand-drawn ring around March, drawn as she speaks. */
              <svg
                className="pointer-events-none absolute -inset-x-4 -top-5 -bottom-2 h-[calc(100%+1.75rem)] w-[calc(100%+2rem)]"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M58 4 C 88 6, 98 40, 94 70 C 90 98, 20 100, 8 72 C -2 44, 10 8, 52 5 L 64 9"
                  fill="none"
                  stroke="#6E5CF0"
                  strokeWidth={2.6}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={isShown ? 0 : 1}
                  style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.16, 1, 0.3, 1)" }}
                />
              </svg>
            )}
          </div>
        ))}
      </div>
      <p
        className={`mt-3 inline-block rounded px-1 text-[15px] transition-colors duration-700 ${
          isShown ? "bg-star" : "bg-transparent"
        }`}
      >
        March: 55 orders, down from 84.
      </p>
    </div>
  );
}

function NotesAndVolume({ isShown }: { isShown: boolean }) {
  return (
    <div className="relative min-h-[13rem]">
      <div className={`transition-all duration-500 ${isShown ? "opacity-100" : "opacity-0"}`}>
        <p className="text-lg font-bold">Interview prep</p>
        <ul className="mt-2 list-disc pl-5 text-[15px] leading-relaxed text-ink/80">
          <li>Read the job post again</li>
          <li>Two stories about past projects</li>
          <li>Questions to ask them</li>
        </ul>
      </div>
      <div
        className={`cut-sm absolute right-0 bottom-0 flex w-44 items-center gap-2.5 rounded-2xl bg-night-2 px-3 py-2.5 text-moon transition-all duration-500 ${
          isShown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <Volume2 size={18} strokeWidth={2.4} className="shrink-0 text-lav" />
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-moon/20">
          <div
            className="h-full rounded-full bg-lav transition-all duration-700"
            style={{ width: isShown ? "40%" : "70%" }}
          />
        </div>
      </div>
    </div>
  );
}
