import Link from "next/link";
import { Mail } from "lucide-react";
import type { ReactNode } from "react";
import { CommandStage } from "@/components/CommandStage";
import { EllaFace } from "@/components/EllaFace";
import { SpinBadge } from "@/components/SpinBadge";
import { Ticker } from "@/components/Ticker";
import { VoiceClip } from "@/components/VoiceClip";
import { DownloadButton } from "@/components/DownloadButton";
import { DOWNLOADS_ENABLED } from "@/lib/release";
import { IntroFilm, WatchFilmButton } from "@/components/film/IntroFilm";

/** A heading phrase set in a cut-paper highlight block. */
function Block({ children, tone = "lav" }: { children: ReactNode; tone?: "lav" | "ink" | "star" }) {
  const tones = {
    lav: "bg-lav text-ink",
    ink: "bg-ink text-paper",
    star: "bg-star text-ink",
  };
  // inline-block: Anton's tall letters would otherwise paint the block over the line above.
  return <span className={`mt-[0.06em] inline-block px-[0.12em] pt-[0.03em] leading-[1.02] ${tones[tone]}`}>{children}</span>;
}

/** A doubt, struck through by hand on every line it wraps onto. */
const HAND_STRIKE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 16'%3E%3Cpath d='M0 9 C 30 5, 60 12, 90 7 S 116 9, 120 8' fill='none' stroke='%23FF8C9E' stroke-width='3.5' stroke-linecap='round'/%3E%3C/svg%3E\")";

function StruckDoubt({ children }: { children: ReactNode }) {
  return (
    <p className="font-display text-[clamp(1.6rem,3.4vw,2.4rem)] uppercase leading-tight text-moon/45">
      <s
        className="no-underline [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
        style={{ backgroundImage: HAND_STRIKE, backgroundRepeat: "repeat-x", backgroundSize: "120px 16px", backgroundPosition: "0 55%", textDecoration: "none" }}
      >
        “{children}”
      </s>
    </p>
  );
}

function HandArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 70" className={className} fill="none" aria-hidden>
      <path d="M6 8 C 30 4, 58 14, 66 46" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M54 38 L 67 50 L 76 33" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Ella's menu, grouped the way a macOS menu separates its sections. */
const FEATURE_GROUPS = [
  [
    { title: "See your screen", example: "“what's this error?”", keys: "⌃ ⌥" },
    { title: "Read the page you're on", example: "“summarise this article”", keys: "⌃ ⇧" },
    { title: "Draw on your screen", example: "circles and highlights as she explains", keys: "⌃ ⌥" },
  ],
  [
    { title: "Sort your Gmail, draft replies", example: "“any interview mails today?”", keys: "⌃ ⇧" },
    { title: "Open, quit and switch apps", example: "“open Notes, pause the music”", keys: "⌃ ⇧" },
    { title: "Run your browser", example: "“new tab, search for flights to Goa”", keys: "⌃ ⇧" },
    { title: "Search the web", example: "“what's the weather today?”", keys: "⌃ ⇧" },
  ],
  [
    { title: "Remember you", example: "“remember, my exam is on Friday”", keys: "⌃ ⇧" },
    { title: "Follow up", example: "the next day: “how did the exam go?”", keys: "" },
  ],
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "to start",
    summary: "Try everything Ella does. No card needed.",
    features: ["50 messages, once, for a new account", "Every feature included"],
  },
  {
    name: "Ella Pro",
    price: "$15",
    period: "per month",
    summary: "For using Ella every day. Cancel anytime.",
    features: [
      "Unlimited talk, by hotkey or auto mode",
      "100 Gmail automations a month",
      "100 whiteboard explanations a month",
      "200 web searches a month",
      "200 screen readings a month",
    ],
  },
];

const FAQS = [
  {
    question: "Which Macs will Ella run on?",
    answer:
      "Macs on macOS 14.2 or later. She asks for the microphone, Accessibility and Screen Recording, plus Full Disk Access only if you connect Gmail.",
  },
  {
    question: "How much will it cost?",
    answer: "Your first 50 messages are free, with no card. After that, Ella Pro is $15 a month. Cancel anytime.",
  },
  {
    question: "How does she read my Gmail?",
    answer:
      "Through Apple Mail on your Mac: add your Gmail account there, then pick it in Ella. She reads only that account, only when you ask, and sends her AI model just subjects and first lines to sort and answer.",
  },
  {
    question: "Can Ella send an email on her own?",
    answer: "No. She can write a draft for you to edit. The Send button on her mail card, pressed by you, is the only way mail goes out.",
  },
  {
    question: "Windows, iPhone, Android?",
    answer: "Mac only for now.",
  },
];

export default function Home() {
  return (
    <>
      <IntroFilm />
      {/* Nav */}
      <header className="on-night mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 px-[clamp(18px,4vw,40px)] pt-6">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Ella home">
          <span className="-my-4 -ml-3">
            <EllaFace size={28} />
          </span>
          <span className="font-display text-[28px] tracking-wide text-moon uppercase">Ella</span>
          <span className="cut-sm -rotate-3 rounded-md bg-lav px-2 py-0.5 font-label text-sm font-bold uppercase tracking-wider text-ink">
            for Mac
          </span>
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-7 text-[16px] font-medium text-moon/85 md:flex">
          <a href="#stage" className="hover:text-moon hover:underline">How it works</a>
          <a href="#doubts" className="hover:text-moon hover:underline">Her voice</a>
          <a href="#privacy" className="hover:text-moon hover:underline">Privacy</a>
          <a href="#pricing" className="hover:text-moon hover:underline">Pricing</a>
          <a href="#faq" className="hover:text-moon hover:underline">FAQ</a>
        </nav>
        <a
          href={DOWNLOADS_ENABLED ? "/download" : "#download"}
          className="press cut rounded-xl bg-lav px-4 py-2 font-display text-lg tracking-wide text-ink uppercase"
        >
          {DOWNLOADS_ENABLED ? "Download" : "Coming soon"}
        </a>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="on-night mx-auto w-full max-w-[1180px] px-[clamp(18px,4vw,40px)] pt-[clamp(48px,8vw,88px)] pb-24 text-center">
          <h1 className="mx-auto font-display text-[clamp(3.3rem,9vw,6rem)] leading-[1.02] tracking-[0.005em] text-moon uppercase [text-wrap:balance]">
            Talk to your Mac.
            <br />
            <Block>It talks back.</Block>
          </h1>
          <p className="mx-auto mt-6 max-w-[62ch] text-[clamp(1.05rem,1.6vw,1.25rem)] leading-relaxed text-moon/80">
            Ella lives in your menu bar. Hold two keys and say what you need: she sees your screen, reads your Gmail,
            opens apps and runs the browser, then answers out loud.
          </p>
          <div className="mx-auto mt-9 flex max-w-[860px] flex-col items-center justify-center gap-5 sm:flex-row sm:items-start">
            <div className="flex flex-col items-center gap-3 sm:items-start">
              <DownloadButton />
              <WatchFilmButton />
            </div>
            <VoiceClip src="/audio/ella-english.mp3" label="Hear Ella" caption="Her real voice, 6 sec" />
          </div>

          <div id="stage" className="relative mt-16 scroll-mt-10">
            <p className="mb-2 flex items-center justify-center gap-2 font-hand text-xl font-bold text-lav-l md:absolute md:-top-12 md:left-2 md:mb-0">
              watch her work, or pick a command
              <HandArrow className="hidden h-12 w-14 rotate-[18deg] text-lav md:block" />
            </p>
            <CommandStage />
          </div>
        </section>

        <Ticker />

        {/* Doubts, answered */}
        <section id="doubts" className="on-night relative bg-night-2 pt-28 pb-24">
          <div className="mx-auto w-full max-w-[1180px] px-[clamp(18px,4vw,40px)]">
            <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
              <div>
                <h2 className="font-display text-[clamp(2.8rem,7vw,5.25rem)] leading-[1.02] text-moon uppercase">
                  You might be
                  <br />
                  <Block>thinking…</Block>
                  <span aria-hidden className="ml-3 inline-block -rotate-6 align-top font-hand text-[clamp(1.4rem,2.6vw,2rem)] font-bold text-blush normal-case">
                    hmm
                  </span>
                </h2>
              </div>
            </div>

            <div className="mt-20 flex flex-col gap-24">
              {/* Voice */}
              <article className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div>
                  <StruckDoubt>It won&apos;t get how I talk</StruckDoubt>
                  <h3 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.75rem)] leading-[1.04] text-moon uppercase">
                    Talk normally. <Block tone="star">She keeps up.</Block>
                  </h3>
                  <p className="mt-5 max-w-[58ch] text-lg leading-relaxed text-moon/80">
                    No commands to memorise. Say it the way you&apos;d say it to a friend, and Ella answers out loud in her
                    own voice: Simran, warm and clear.
                  </p>
                </div>
                <div className="flex flex-col items-start gap-5 lg:items-end">
                  <VoiceClip src="/audio/ella-english.mp3" label="Hear her say it" caption="Her real voice, 6 sec" tone="star" />
                  <p className="cut max-w-md rotate-[1.2deg] rounded-2xl bg-paper px-5 py-4 font-hand text-xl leading-snug font-bold text-ink">
                    “Hi, I&apos;m Ella. I live in your Mac&apos;s menu bar. Hold two keys, tell me what you need, and I&apos;ll take
                    it from there.”
                  </p>
                </div>
              </article>

              {/* Approval */}
              <article className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="lg:col-start-2 lg:row-start-1">
                  <StruckDoubt>It&apos;ll do things I never asked for</StruckDoubt>
                  <h3 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.75rem)] leading-[1.04] text-moon uppercase">
                    Nothing sends <Block>until you press Send.</Block>
                  </h3>
                  <p className="mt-5 max-w-[58ch] text-lg leading-relaxed text-moon/80">
                    Reading is instant. Anything that changes something waits for you. Ella writes the reply, you edit it,
                    and the Send button is yours: it&apos;s the only way mail leaves, and she can&apos;t press it by voice.
                  </p>
                </div>
                <div className="lg:col-start-1 lg:row-start-1">
                  <MailCardMock />
                </div>
              </article>

              {/* Privacy */}
              <article id="privacy" className="grid scroll-mt-24 items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div>
                  <StruckDoubt>My whole inbox ends up on some server</StruckDoubt>
                  <h3 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.75rem)] leading-[1.04] text-moon uppercase">
                    She reads it <Block tone="star">on your Mac.</Block>
                  </h3>
                  <p className="mt-5 max-w-[58ch] text-lg leading-relaxed text-moon/80">
                    Ella reads Gmail from Apple Mail&apos;s own files on your Mac, only when you ask, and only the account
                    you pick. To sort it and answer you, she sends her AI model just the bits it needs, like subjects and
                    first lines, never your whole inbox, and we don&apos;t store it. Your memories and conversations
                    are locked to your account, and there&apos;s no analytics.
                  </p>
                </div>
                <div className="relative flex justify-center lg:justify-end">
                  <PrivacyReceipt />
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* What she does */}
        <section className="paper relative border-y-[2.5px] border-ink py-24">
          <div className="mx-auto grid w-full max-w-[1180px] gap-12 px-[clamp(18px,4vw,40px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,470px)] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <h2 className="font-display text-[clamp(2.8rem,7vw,5.25rem)] leading-[1.02] uppercase">
                Two keys.
                <br />
                <Block tone="ink">A lot of hands.</Block>
              </h2>
              <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-ink/80">
                Hold <Kbd>⌃</Kbd> <Kbd>⇧</Kbd> to talk, or <Kbd>⌃</Kbd> <Kbd>⌥</Kbd> to let her see your screen too. Click her
                face in the menu bar, and this is what she can do.
              </p>
            </div>

            {/* Ella's menu, opened from her face in the menu bar. */}
            <div className="w-full">
              <div className="cut-sm flex items-center justify-end gap-4 rounded-t-xl bg-paper-2 px-4 py-1.5 text-[13px] font-semibold">
                <span className="rounded-md bg-lav px-1.5 py-0.5" aria-hidden>
                  <span className="-my-4 inline-flex">
                    <EllaFace size={16} mood="listening" />
                  </span>
                </span>
                <span className="tabular-nums">9:41</span>
              </div>
              <div className="cut ml-auto w-full rounded-b-2xl bg-white p-1.5 sm:w-[94%]">
                <p className="px-3 pt-2 pb-1 font-label text-[14px] font-bold uppercase tracking-wider text-ink/70">Ella can</p>
                {FEATURE_GROUPS.map((group, groupIndex) => (
                  <ul key={groupIndex} className={groupIndex > 0 ? "mt-1 border-t-2 border-ink/12 pt-1" : undefined}>
                    {group.map((feature) => (
                      <li key={feature.title} className="flex items-start justify-between gap-4 rounded-lg px-3 py-2 transition-colors hover:bg-lav-l/55">
                        <span className="flex min-w-0 flex-col">
                          <span className="text-[16px] font-bold">{feature.title}</span>
                          <span className="font-hand text-[16px] leading-snug text-plum">{feature.example}</span>
                        </span>
                        {feature.keys && <span className="shrink-0 pt-0.5 font-sans text-[14px] text-ink/75">{feature.keys}</span>}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="on-night mx-auto w-full max-w-[1180px] scroll-mt-10 px-[clamp(18px,4vw,40px)] py-24">
          <h2 className="font-display text-[clamp(2.6rem,6vw,4.5rem)] leading-[1.02] text-moon uppercase">
            Simple <Block>pricing.</Block>
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {PLANS.map((plan) => (
              <div key={plan.name} className="cut flex flex-col rounded-[22px] bg-paper p-7 text-ink">
                <h3 className="font-display text-3xl tracking-wide uppercase">{plan.name}</h3>
                <p className="mt-3 font-display text-5xl">
                  {plan.price}
                  <span className="ml-2 font-sans text-lg font-medium text-ink/70">{plan.period}</span>
                </p>
                <p className="mt-3 text-[17px] leading-relaxed text-ink/80">{plan.summary}</p>
                <ul className="mt-5 space-y-2 text-[17px] leading-relaxed">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5">
                      <span aria-hidden className="font-bold">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-[70ch] text-[15px] leading-relaxed text-moon/70">
            Prices are in US dollars; tax may be added at checkout. Unlimited talk is subject to a fair use limit of 200 talks a
            day. See the <Link href="/terms" className="underline underline-offset-4 hover:text-moon">Terms</Link> and{" "}
            <Link href="/refund" className="underline underline-offset-4 hover:text-moon">Refund Policy</Link>.
          </p>
        </section>

        {/* Download */}
        <section id="download" className="relative scroll-mt-0 overflow-hidden border-b-[2.5px] border-ink bg-lav text-ink">
          <div
            className="absolute inset-0 opacity-100"
            style={{ backgroundImage: "radial-gradient(rgb(28 22 58 / 0.16) 1px, transparent 1.2px)", backgroundSize: "22px 22px" }}
            aria-hidden
          />
          <div className="relative mx-auto grid w-full max-w-[1180px] items-end gap-10 px-[clamp(18px,4vw,40px)] pt-24 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
            <div className="pb-24">
              <h2 className="font-display text-[clamp(3rem,8vw,5.75rem)] leading-[1.02] uppercase">
                Stop typing.
                <br />
                <Block tone="ink">Start talking.</Block>
              </h2>
              <p className="mt-6 max-w-[52ch] text-xl leading-relaxed text-ink/85">
                Ella is here for your Mac. Download her, hold two keys, and say hi.
              </p>
              <div className="mt-8">
                <DownloadButton tone="lav" />
              </div>
            </div>
            <div className="relative hidden justify-center pb-24 md:flex md:justify-end">
              <EllaFace size={200} title="Ella, winking" />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="on-night mx-auto w-full max-w-[1180px] scroll-mt-10 px-[clamp(18px,4vw,40px)] py-24">
          <h2 className="font-display text-[clamp(2.6rem,6vw,4.5rem)] leading-[1.02] text-moon uppercase">
            Fair <Block>questions.</Block>
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {FAQS.map((faq) => (
              <details key={faq.question} className="group cut rounded-2xl bg-paper text-ink open:bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[18px] font-bold [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-ink bg-lav transition-transform duration-200 group-open:rotate-45" aria-hidden>
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                      <path d="M8 2v12M2 8h12" stroke="#1C163A" strokeWidth="2.6" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className="px-5 pb-5 text-[16px] leading-relaxed text-ink/80">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t-[2.5px] border-ink bg-night-2">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col justify-between gap-3 px-[clamp(18px,4vw,40px)] py-8 text-[15px] text-moon/70 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2">
            <span className="-my-4 -ml-2">
              <EllaFace size={20} />
            </span>
            Ella · heyyella.com · For Mac
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <span>Demo screens on this page use sample data.</span>
            <Link href="/privacy" className="hover:text-moon hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:text-moon hover:underline">Terms</Link>
            <Link href="/refund" className="hover:text-moon hover:underline">Refunds</Link>
          </p>
        </div>
      </footer>

      <SpinBadge />
    </>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-grid h-8 min-w-8 place-items-center rounded-md border-2 border-ink bg-paper px-1.5 align-middle font-sans text-base text-ink shadow-[0_3px_0_#1C163A]">
      {children}
    </kbd>
  );
}

/** Ella's mail card, as it looks on a Mac: her draft, your Send button. Sample data. */
function MailCardMock() {
  return (
    <div className="cut -rotate-[1.4deg] rounded-[20px] bg-paper p-5 text-ink">
      <div className="flex items-center justify-between gap-3 border-b-2 border-ink/20 pb-3">
        <div>
          <p className="text-[15px] font-bold">Interview on Thursday, 3:30 PM</p>
          <p className="text-[13px] text-ink/65">Riya · Nimbus Labs</p>
        </div>
        <span className="rounded-full border-2 border-ink bg-star px-2 py-0.5 font-label text-xs font-bold uppercase">Interview</span>
      </div>
      <p className="mt-3 font-label text-sm font-bold uppercase tracking-wide text-plum">Ella&apos;s draft · edit anything</p>
      <p className="mt-1.5 rounded-xl border-2 border-dashed border-ink/35 bg-white p-3 text-[15px] leading-relaxed">
        Hi Riya, thank you! Thursday at 3:30 PM works for me. Could you share the meeting link? Looking forward to it.
      </p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="font-hand text-[17px] font-bold text-ink/75">only your click sends this</p>
        <span className="cut-sm flex items-center gap-2 rounded-xl bg-ink px-4 py-2 font-display text-lg tracking-wide text-paper uppercase">
          <Mail size={17} strokeWidth={2.4} /> Send
        </span>
      </div>
      <p className="mt-3 font-label text-[12px] uppercase tracking-widest text-ink/70">Sample data</p>
    </div>
  );
}

const RECEIPT_LINES = [
  { item: "Your inbox", where: "read on your Mac" },
  { item: "To the AI", where: "subjects + first lines, when you ask" },
  { item: "Screenshots", where: "only while you hold ⌃ ⌥" },
  { item: "Gmail accounts read", where: "the one you pick" },
  { item: "Memories", where: "locked to your account" },
  { item: "Conversations", where: "saved to your account" },
  { item: "Mail sent by voice", where: "never" },
  { item: "Analytics", where: "none" },
];

/** What leaves your Mac, itemised like a receipt. */
function PrivacyReceipt() {
  return (
    <div className="relative w-full max-w-[430px] rotate-[1.8deg]">
      <div className="cut rounded-t-md bg-star px-6 pt-6 pb-8 font-mono text-[13px] text-ink">
        <p className="text-center font-display text-2xl tracking-wide uppercase">Ella · privacy</p>
        <p className="mt-1 text-center text-[13px] text-ink/75">what leaves your Mac</p>
        <div className="my-4 border-t-2 border-dashed border-ink/40" />
        <ul className="flex flex-col gap-2.5">
          {RECEIPT_LINES.map((line) => (
            <li key={line.item} className="grid grid-cols-1 gap-0.5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-baseline sm:gap-3">
              <span className="font-label text-[15px] font-semibold uppercase tracking-wide text-ink/75">{line.item}</span>
              <span className="font-bold sm:text-right">{line.where}</span>
            </li>
          ))}
        </ul>
        <div className="my-4 border-t-2 border-dashed border-ink/40" />
        <p className="flex items-baseline justify-between font-bold">
          <span>Writes without your OK</span>
          <span className="rounded bg-lav px-1.5">0</span>
        </p>
        <p className="mt-5 text-center text-[13px] text-ink/75">thank you · now go talk to your Mac</p>
      </div>
      {/* The torn edge of the receipt paper. */}
      <svg className="-mt-px block w-full" viewBox="0 0 360 14" preserveAspectRatio="none" aria-hidden>
        <path d="M0 0 H360 V2 L348 13 L336 2 L324 13 L312 2 L300 13 L288 2 L276 13 L264 2 L252 13 L240 2 L228 13 L216 2 L204 13 L192 2 L180 13 L168 2 L156 13 L144 2 L132 13 L120 2 L108 13 L96 2 L84 13 L72 2 L60 13 L48 2 L36 13 L24 2 L12 13 L0 2 Z" fill="#FFE2A6" stroke="#1C163A" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
