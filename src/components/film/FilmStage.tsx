/**
 * The intro film's stage (1280 x 720) and its timeline. Ella is a
 * character here, not a logo: she flies into the notch, lands on the keys,
 * draws with a pen while riding its line, kicks spam away, throws the
 * interview onto the calendar, hops across apps, sketches with a marker and
 * dozes off when the keys let go. Every spoken word pops onto the screen as
 * Simran says it. Her mouth follows the real loudness of the voice
 * (IntroFilm drives `.actor-mouth`), everything else follows the clock.
 */
import { Bell, Calendar, Globe, MessageCircle, Music, NotebookPen } from "lucide-react";
import { FILM_CUES, FILM_DURATION, FILM_WORDS, type FilmSceneID } from "./filmScript";

const INK = "#1C163A";
/** How fast the moves run against the voice (1 was for a 1.05x voice; it's now 1.6x). */
const TEMPO = 0.62;
const PEN = "#6E5CF0";
const PAPER_INK = "#2A2450";

/** Words that get a colour block and a bigger size. */
const KEY_WORDS = new Set([
  "ella", "menu", "bar", "two", "keys", "talk", "anything", "english", "hindi", "loud", "screen", "explain", "pen",
  "gmail", "needs", "interviews", "calendar", "apps", "browser", "type", "sketch", "whiteboard", "remember", "goals",
  "listen", "hold", "mac", "let's", "control", "shift", "option",
]);
const BLOCK_COLOURS = ["bg-lav", "bg-star", "bg-mint", "bg-blush"];

/** Where each line of words sits, and how big. */
const LINE_LAYOUT: Record<FilmSceneID, { top: number; left: number; width: number; size: number; align: "center" | "left" }> = {
  hello: { top: 440, left: 0, width: 1280, size: 150, align: "center" },
  menubar: { top: 70, left: 60, width: 1160, size: 70, align: "center" },
  talk: { top: 120, left: 60, width: 640, size: 78, align: "left" },
  screen: { top: 24, left: 50, width: 1180, size: 52, align: "center" },
  mail: { top: 24, left: 50, width: 1180, size: 52, align: "center" },
  control: { top: 24, left: 60, width: 1160, size: 58, align: "center" },
  board: { top: 18, left: 60, width: 1160, size: 58, align: "center" },
  memory: { top: 130, left: 60, width: 620, size: 76, align: "left" },
  privacy: { top: 40, left: 60, width: 1160, size: 74, align: "center" },
  cta: { top: 370, left: 60, width: 1160, size: 100, align: "center" },
};

const cleanWord = (word: string) => word.toLowerCase().replace(/[^a-z']/g, "");

// MARK: - Ella, the character

/** Ella with little hands, a pen, voice rings, sleepy Zs and a lock badge, all driven by the timeline. */
function EllaActor() {
  return (
    <div className="actor absolute top-[-100px] left-[-100px] z-30 h-[200px] w-[200px]">
      <svg viewBox="-60 -60 220 220" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="actor-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#CCC6FF" />
            <stop offset="1" stopColor="#A69FF0" />
          </linearGradient>
        </defs>
        {[0, 1, 2].map((ringIndex) => (
          <rect key={ringIndex} className={`actor-ring actor-ring-${ringIndex}`} x={0} y={0} width={100} height={93} rx={33} fill="none" stroke="#A69FF0" strokeWidth={3} opacity={0} style={{ transformOrigin: "50px 46px" }} />
        ))}
        <g className="actor-body" style={{ transformOrigin: "50px 93px" }}>
          <rect x={0} y={0} width={100} height={93} rx={33} fill="url(#actor-fill)" stroke={INK} strokeWidth={2.5} />
          <g className="actor-eyes" style={{ transformOrigin: "50px 38px" }}>
            <g className="actor-eye-open">
              <ellipse cx={30} cy={38.5} rx={7.25} ry={9.06} fill={INK} />
              <circle className="actor-glint" cx={28} cy={35.3} r={3.05} fill="#fff" />
              <ellipse cx={70} cy={38.5} rx={7.25} ry={9.06} fill={INK} className="actor-eye-right" />
              <circle className="actor-glint actor-eye-right" cx={68} cy={35.3} r={3.05} fill="#fff" />
            </g>
            <path className="actor-wink" d="M61.5 41 Q70 33 78.5 41" fill="none" stroke={INK} strokeWidth={3.4} strokeLinecap="round" opacity={0} />
            <path className="actor-sleep" d="M22 40 Q30 46 38 40 M62 40 Q70 46 78 40" fill="none" stroke={INK} strokeWidth={3.4} strokeLinecap="round" opacity={0} />
          </g>
          <ellipse cx={26} cy={54.5} rx={6} ry={3.3} fill="#FF8C9E" opacity={0.85} />
          <ellipse cx={74} cy={54.5} rx={6} ry={3.3} fill="#FF8C9E" opacity={0.85} />
          <g className="actor-mouth" style={{ transformOrigin: "50px 60px" }}>
            <path d="M37 60 H63 Q50 80 37 60 Z" fill={INK} />
            <ellipse cx={50} cy={70} rx={6.5} ry={3.8} fill="#FF8C9E" />
          </g>
        </g>
        {/* Little mitten hands */}
        <g className="actor-hand-l" style={{ transformOrigin: "-4px 74px" }}>
          <circle cx={-6} cy={74} r={12} fill="#B9B2F6" stroke={INK} strokeWidth={2.5} />
        </g>
        <g className="actor-hand-r" style={{ transformOrigin: "106px 74px" }}>
          <g className="actor-pen" opacity={0}>
            <rect x={100} y={70} width={10} height={52} rx={3} fill={PEN} stroke={INK} strokeWidth={2} transform="rotate(-35 105 96)" />
            <path d="M120 113 L127 128 L113 121 Z" fill={INK} transform="rotate(-35 105 96)" />
          </g>
          <circle cx={106} cy={74} r={12} fill="#B9B2F6" stroke={INK} strokeWidth={2.5} />
        </g>
        <g className="actor-zs" fill="#ECE6D8" fontFamily="var(--font-anton)" fontSize={26}>
          <text className="actor-z actor-z-0" x={96} y={-6} opacity={0}>z</text>
          <text className="actor-z actor-z-1" x={112} y={-24} opacity={0}>z</text>
          <text className="actor-z actor-z-2" x={128} y={-42} opacity={0}>z</text>
        </g>
        <g className="actor-lock" opacity={0} style={{ transformOrigin: "100px 100px" }}>
          <circle cx={100} cy={100} r={20} fill="#FFE2A6" stroke={INK} strokeWidth={2.5} />
          <rect x={91} y={98} width={18} height={13} rx={3} fill={INK} />
          <path d="M94 98 V92 Q100 84 106 92 V98" fill="none" stroke={INK} strokeWidth={3} />
        </g>
      </svg>
    </div>
  );
}

// MARK: - Words

function KineticLines() {
  return (
    <>
      {FILM_CUES.map((cue) => {
        const layout = LINE_LAYOUT[cue.id];
        let keyWordCount = 0;
        return (
          <p
            key={cue.id}
            data-line={cue.id}
            className="absolute z-20 flex flex-wrap gap-x-[0.24em] gap-y-[0.06em] font-display leading-[1.04] text-moon uppercase"
            style={{ top: layout.top, left: layout.left, width: layout.width, fontSize: layout.size, justifyContent: layout.align === "center" ? "center" : "flex-start" }}
          >
            {FILM_WORDS[cue.id].map((spokenWord, wordIndex) => {
              const isKeyWord = KEY_WORDS.has(cleanWord(spokenWord.w));
              const blockColour = isKeyWord ? BLOCK_COLOURS[keyWordCount++ % BLOCK_COLOURS.length] : "";
              return (
                <span
                  key={wordIndex}
                  className={`kin-word inline-block opacity-0 ${isKeyWord ? `rounded-[0.12em] px-[0.12em] text-ink ${blockColour}` : ""}`}
                  style={isKeyWord ? { fontSize: "1.08em", boxShadow: "0.06em 0.07em 0 #05040f" } : undefined}
                >
                  {spokenWord.w}
                </span>
              );
            })}
          </p>
        );
      })}
    </>
  );
}

// MARK: - Props

function Scene({ id, children }: { id: FilmSceneID; children: React.ReactNode }) {
  return (
    <div data-scene={id} className="invisible absolute inset-0 opacity-0">
      {children}
    </div>
  );
}

function Keycap({ symbol, word, className = "", left, top = 430, size = 1 }: { symbol: string; word: string; className?: string; left: number; top?: number; size?: number }) {
  return (
    <div
      className={`absolute flex flex-col items-center justify-center rounded-[22px] border-[3px] border-ink bg-paper text-ink shadow-[0_12px_0_#1C163A] ${className}`}
      style={{ left: left - 75 * size, top, width: 150 * size, height: 128 * size, borderRadius: 22 * size }}
    >
      <span className="leading-none font-bold" style={{ fontSize: 56 * size }}>{symbol}</span>
      <span className="mt-1 font-label font-bold tracking-wider uppercase" style={{ fontSize: 22 * size }}>{word}</span>
    </div>
  );
}

/** What a pair of keys does, under the keys. */
function KeyLabel({ className, left, top, width, children }: { className: string; left: number; top: number; width: number; children: React.ReactNode }) {
  return (
    <p className={`absolute rounded-full border-[3px] border-ink bg-star px-4 py-1.5 text-center font-label text-[24px] font-bold tracking-wide text-ink uppercase opacity-0 shadow-[5px_6px_0_#05040f] ${className}`} style={{ left, top, width }}>
      {children}
    </p>
  );
}

const MAILS = [
  { from: "Riya · Nimbus Labs", subject: "Interview, Thursday 3:30 PM", tag: "Interview", kind: "interview" },
  { from: "Prof. Mehta", subject: "Project review moved to Monday", tag: "Study", kind: "keep" },
  { from: "ShopMart", subject: "MEGA SALE ends tonight!!!", tag: "Promo", kind: "spam" },
  { from: "Newsletter", subject: "10 tips you didn't ask for", tag: "Promo", kind: "spam" },
];

function FilmProps() {
  return (
    <>
      {/* Menu bar, notch and the two keys */}
      <Scene id="menubar">
        <div className="film-menubar absolute top-0 left-0 flex h-[38px] w-full items-center justify-between bg-[#e9e6f7] px-6 text-[16px] font-semibold text-ink">
          <span className="flex gap-6"><span>Finder</span><span className="font-normal">File</span><span className="font-normal">Edit</span><span className="font-normal">View</span></span>
          <span className="font-normal">9:41</span>
        </div>
        <div className="film-notch absolute top-0 left-[540px] flex h-[38px] w-[200px] items-center justify-between overflow-hidden rounded-b-[16px] bg-black px-4">
          <span className="film-notch-word text-[15px] font-semibold whitespace-nowrap text-moon opacity-0">Listening</span>
          <span className="film-notch-bars flex h-4 items-center gap-[3px] opacity-0">
            {[0, 1, 2, 3, 4].map((barIndex) => <span key={barIndex} className="film-bar h-4 w-[3px] rounded-full bg-lav" />)}
          </span>
        </div>
        <Keycap symbol="⌃" word="control" className="film-key-a" left={540} />
        <Keycap symbol="⇧" word="shift" className="film-key-b" left={740} />
        <KeyLabel className="film-key-label-talk" left={440} top={600} width={400}>control + shift · talk</KeyLabel>
      </Scene>

      {/* Talk: languages orbit her */}
      <Scene id="talk">
        <span className="film-chip-en absolute top-[580px] left-[820px] rounded-full border-[3px] border-ink bg-star px-6 py-2 font-label text-[34px] font-bold text-ink uppercase shadow-[5px_6px_0_#05040f]">English</span>
        <span className="film-chip-hi absolute top-[580px] left-[1030px] rounded-full border-[3px] border-ink bg-mint px-6 py-2 text-[34px] font-bold text-ink shadow-[5px_6px_0_#05040f]">हिन्दी</span>
        <span className="film-sound absolute top-[150px] left-[1110px] font-display text-[80px] text-star">♪</span>
      </Scene>

      {/* Screen: a diagram Ella draws on */}
      <Scene id="screen">
        <div className="film-window absolute top-[180px] left-[250px] h-[450px] w-[880px] overflow-hidden rounded-[18px] border-[3px] border-ink bg-white shadow-[10px_12px_0_#05040f]">
          <div className="flex h-10 items-center gap-2 border-b-2 border-ink/15 bg-paper px-4">
            <span className="h-3 w-3 rounded-full bg-[#ff6b6b]" /><span className="h-3 w-3 rounded-full bg-[#ffd166]" /><span className="h-3 w-3 rounded-full bg-[#7ad48a]" />
            <span className="ml-4 text-[15px] font-semibold text-ink/60">Physics · How planes fly</span>
          </div>
          <svg viewBox="0 0 880 410" className="absolute top-10 left-0 h-[410px] w-[880px]">
            <g fill="#e8e6f2" stroke="#9a96b8" strokeWidth="3" strokeLinejoin="round">
              <path d="M250 205 Q260 180 300 175 L640 171 Q700 171 720 205 Q700 239 640 239 L300 235 Q260 230 250 205 Z" />
              <path d="M450 180 L380 45 L430 45 L540 180 Z" />
              <path d="M450 230 L380 365 L430 365 L540 230 Z" />
              <path d="M300 185 L250 125 L285 125 L340 183 Z" />
              <path d="M300 225 L250 285 L285 285 L340 227 Z" />
            </g>
          </svg>
        </div>
        <svg viewBox="0 0 1280 720" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          <g fill="none" stroke={PEN} strokeWidth={6} strokeLinecap="round">
            <path id="film-path-wing" className="film-pen film-pen-wing" d="M640 270 Q620 230 690 222 Q790 214 800 290 Q806 370 720 384 Q640 392 630 330" />
            <path id="film-path-tail" className="film-pen film-pen-tail" d="M500 380 Q520 350 560 352 Q610 360 604 410 Q598 450 556 450 Q512 448 506 412" />
          </g>
        </svg>
        <div className="film-capture pointer-events-none absolute top-[180px] left-[250px] h-[450px] w-[880px] rounded-[18px] border-[6px] border-lav opacity-0 shadow-[0_0_60px_#A69FF0]" />
        <Keycap symbol="⌃" word="control" className="film-skey film-skey-a" left={68} top={420} size={0.7} />
        <Keycap symbol="⌥" word="option" className="film-skey film-skey-b" left={180} top={420} size={0.7} />
        <KeyLabel className="film-key-label-screen" left={16} top={530} width={226}>⌃ ⌥ · sees your screen</KeyLabel>
        <span className="film-pill film-pill-wing absolute top-[190px] left-[820px] rounded-full border-2 border-white bg-plum px-4 py-1.5 text-[24px] font-bold text-white">Wings: lift</span>
        <span className="film-pill film-pill-tail absolute top-[470px] left-[440px] rounded-full border-2 border-white bg-plum px-4 py-1.5 text-[24px] font-bold text-white">Tail: steering</span>
      </Scene>

      {/* Mail: spam gets kicked, the interview lands on Thursday */}
      <Scene id="mail">
        {MAILS.map((mail, mailIndex) => (
          <div
            key={mail.subject}
            className={`film-mail film-mail-${mail.kind} film-mail-${mailIndex} absolute flex w-[440px] items-center justify-between rounded-2xl border-[3px] border-ink bg-paper px-5 py-3.5 text-ink shadow-[6px_7px_0_#05040f]`}
            style={{ left: 70, top: 200 + mailIndex * 96 }}
          >
            <div>
              <p className="text-[21px] font-bold">{mail.subject}</p>
              <p className="text-[16px] text-ink/60">{mail.from}</p>
            </div>
            <span className={`rounded-full border-2 border-ink px-3 py-0.5 font-label text-[15px] font-bold uppercase ${mail.kind === "spam" ? "bg-white" : "bg-star"}`}>{mail.tag}</span>
          </div>
        ))}
        <div className="film-calendar absolute top-[190px] left-[760px] w-[460px] rounded-[22px] border-[3px] border-ink bg-paper p-5 text-ink shadow-[8px_9px_0_#05040f]">
          <p className="flex items-center gap-2 font-label text-[24px] font-bold uppercase"><Calendar size={24} /> This week</p>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
              <div key={day} className={`flex h-[230px] flex-col rounded-xl border-2 border-ink/20 bg-white p-2 ${day === "Thu" ? "film-cal-thu" : ""}`}>
                <span className="text-center font-label text-[18px] font-bold text-ink/60 uppercase">{day}</span>
                {day === "Thu" && <span className="film-cal-event mt-8 rounded-lg border-2 border-ink bg-lav p-1.5 text-center text-[15px] leading-tight font-bold opacity-0">Interview 3:30 PM</span>}
              </div>
            ))}
          </div>
          <p className="film-bell mt-4 flex items-center gap-2 text-[18px] font-semibold opacity-0"><Bell size={20} className="film-bell-icon text-plum" /> Reminders set: 1 day, 1 hour, 15 min</p>
        </div>
      </Scene>

      {/* Control: hop across the apps, then the browser types */}
      <Scene id="control">
        {[Music, Globe, NotebookPen, MessageCircle, Calendar].map((AppIcon, appIndex) => (
          <div key={appIndex} className={`film-app film-app-${appIndex} absolute flex h-[110px] w-[110px] items-center justify-center rounded-[28px] border-[3px] border-ink bg-paper text-ink shadow-[0_9px_0_#05040f]`} style={{ left: 345 + appIndex * 130, top: 330 }}>
            <AppIcon size={52} strokeWidth={2.2} />
          </div>
        ))}
        <div className="film-browser absolute top-[240px] left-[210px] h-[360px] w-[860px] overflow-hidden rounded-[18px] border-[3px] border-ink bg-white text-ink opacity-0 shadow-[10px_12px_0_#05040f]">
          <div className="flex h-11 items-center gap-3 border-b-2 border-ink/15 bg-paper px-4">
            <span className="h-3 w-3 rounded-full bg-[#ff6b6b]" /><span className="h-3 w-3 rounded-full bg-[#ffd166]" /><span className="h-3 w-3 rounded-full bg-[#7ad48a]" />
            <span className="ml-3 flex-1 rounded-lg bg-white px-3 py-1 text-[17px] text-ink/70">mail.google.com</span>
          </div>
          <div className="p-7">
            <p className="text-[18px] font-semibold text-ink/55">Reply to Riya</p>
            <p className="mt-3 min-h-[70px] rounded-xl border-2 border-dashed border-ink/30 p-4 text-[32px] font-semibold">
              <span className="film-typed" />
              <span className="film-caret ml-0.5 inline-block h-8 w-[3px] translate-y-1 bg-plum" />
            </p>
          </div>
        </div>
      </Scene>

      {/* Board: Ella sketches with a marker */}
      <Scene id="board">
        <div className="film-paper absolute top-[130px] left-[190px] h-[540px] w-[900px] rounded-[22px] border-[3px] border-ink bg-[#FBF9F3] shadow-[10px_12px_0_#05040f]" style={{ backgroundImage: "radial-gradient(#e2ddcf 1.2px, transparent 1.4px)", backgroundSize: "24px 24px" }}>
          <p className="absolute top-4 left-7 font-hand text-[32px] font-bold" style={{ color: PAPER_INK }}>How a plane flies</p>
        </div>
        <svg viewBox="0 0 1280 720" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path id="film-path-airfoil" className="film-sketch film-sketch-airfoil" d="M420 430 Q490 360 660 362 Q810 366 880 422 Q790 440 660 442 Q520 444 420 430 Z" stroke={PAPER_INK} strokeWidth={6} fill="rgba(47,111,214,0.12)" />
            <path id="film-path-fast" className="film-sketch film-sketch-fast" d="M300 330 Q490 280 660 290 Q830 300 980 350 M958 335 L980 351 L956 366" stroke="#2F6FD6" strokeWidth={6} />
            <path id="film-path-slow" className="film-sketch film-sketch-slow" d="M300 500 Q510 490 660 492 Q830 495 980 490 M958 476 L980 490 L958 504" stroke="#2F6FD6" strokeWidth={6} />
            <path id="film-path-lift" className="film-sketch film-sketch-lift" d="M650 620 L650 465 M632 490 L650 462 L668 490" stroke="#2E9A5B" strokeWidth={8} />
          </g>
        </svg>
        <span className="film-hand film-hand-fast absolute top-[250px] left-[860px] font-hand text-[32px] font-bold text-[#2F6FD6] opacity-0">fast air</span>
        <span className="film-hand film-hand-slow absolute top-[505px] left-[860px] font-hand text-[32px] font-bold text-[#2F6FD6] opacity-0">slow air</span>
        <span className="film-hand film-hand-lift absolute top-[560px] left-[680px] font-hand text-[38px] font-bold text-[#2E9A5B] opacity-0">LIFT!</span>
        <span className="film-hand film-hand-wing absolute top-[380px] left-[300px] font-hand text-[30px] font-bold opacity-0" style={{ color: PAPER_INK }}>wing</span>
      </Scene>

      {/* Memory: notes slap on, the goal ring fills */}
      <Scene id="memory">
        {["Exam on Friday", "Likes short answers", "Building a Mac app"].map((memory, memoryIndex) => (
          <div key={memory} className={`film-note film-note-${memoryIndex} absolute flex items-center gap-4 rounded-2xl border-[3px] border-ink bg-paper px-6 py-4 text-ink shadow-[7px_8px_0_#05040f]`} style={{ left: 740, top: 130 + memoryIndex * 100, rotate: `${[-3, 2, -1.5][memoryIndex]}deg` }}>
            <span className="h-4 w-4 rounded-full bg-star shadow-[0_0_14px_#F5B85C]" />
            <span className="text-[30px] font-bold">{memory}</span>
          </div>
        ))}
        <div className="film-goal absolute top-[450px] left-[960px] flex h-[240px] w-[240px] flex-col items-center justify-center rounded-full border-[3px] border-ink bg-paper text-ink shadow-[8px_9px_0_#05040f]">
          <svg width="200" height="200" viewBox="0 0 200 200" className="absolute -rotate-90">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#e2dcfb" strokeWidth="18" />
            <circle className="film-ring" cx="100" cy="100" r="80" fill="none" stroke={PEN} strokeWidth="18" strokeLinecap="round" />
          </svg>
          <p className="relative font-display text-[52px] leading-none"><span className="film-goal-count">0</span>/30</p>
          <p className="relative font-label text-[20px] font-bold uppercase">DSA this week</p>
        </div>
      </Scene>

      {/* Privacy */}
      <Scene id="privacy">
        <Keycap symbol="⌃" word="control" className="film-pkey" left={540} />
        <Keycap symbol="⇧" word="shift" className="film-pkey" left={740} />
        <p className="film-mic absolute top-[600px] w-full text-center font-label text-[34px] font-bold tracking-wider uppercase">
          <span className="film-mic-on text-lav opacity-0">● Listening</span>
          <span className="film-mic-off absolute left-1/2 -translate-x-1/2 text-moon/60">○ Not listening</span>
        </p>
      </Scene>

      {/* Call to action */}
      <Scene id="cta">
        <p className="film-cta-sub absolute top-[612px] w-full text-center font-label text-[34px] font-bold tracking-wide text-lav-l uppercase">Talk to your Mac. It talks back.</p>
      </Scene>
    </>
  );
}

export function FilmStage() {
  return (
    <div className="film-shake absolute inset-0">
      <div aria-hidden className="film-glow-a pointer-events-none absolute top-[60px] left-[240px] h-[520px] w-[520px] rounded-full bg-plum opacity-40 blur-[110px]" />
      <div aria-hidden className="film-glow-b pointer-events-none absolute top-[160px] left-[620px] h-[460px] w-[460px] rounded-full bg-star-d opacity-20 blur-[120px]" />
      <div aria-hidden className="film-lead-star absolute top-[260px] left-[640px] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-star shadow-[0_0_60px_20px_#F5B85C]" />
      <div aria-hidden className="film-burst absolute top-[250px] left-[640px] h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-lav opacity-0" />
      <FilmProps />
      <KineticLines />
      <EllaActor />
      <div aria-hidden className="film-wipe absolute top-[-200px] left-0 z-40 h-[1120px] w-[520px] bg-lav" style={{ rotate: "14deg" }} />
    </div>
  );
}

// MARK: - Timeline

type GSAP = typeof import("gsap").gsap;

/** Every move, placed on the audio's clock. */
export function buildFilm(gsap: GSAP, reduceMotion: boolean) {
  const timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
  /** Moves were timed for a slower voice; everything scales with her pace. */
  const D = (seconds: number) => seconds * TEMPO;
  const move = reduceMotion ? 0 : 1;
  const cueStart = (id: FilmSceneID) => FILM_CUES.find((cue) => cue.id === id)!.start;
  const cueEnd = (id: FilmSceneID) => FILM_CUES.find((cue) => cue.id === id)!.end;
  const word = (id: FilmSceneID, wordIndex: number) => FILM_WORDS[id][wordIndex].t;
  const actor = ".actor";
  /** Ella moves to a point on the stage (her centre), at a size. */
  const ella = (x: number, y: number, scale: number, at: number, duration = 0.45, ease = "power3.inOut") =>
    timeline.to(actor, { x, y, scale, duration: D(duration) * (move || 0.01), ease }, at);
  const hop = (at: number, height = 60) =>
    timeline.to(actor, { y: `-=${height * move}`, duration: D(0.14), ease: "power2.out", yoyo: true, repeat: 1 }, at);
  const squash = (at: number) =>
    timeline.fromTo(".actor-body", { scaleX: 1.18, scaleY: 0.82 }, { scaleX: 1, scaleY: 1, duration: D(0.35), ease: "elastic.out(1, 0.4)" }, at);
  const blink = (at: number) => timeline.to(".actor-eyes", { scaleY: 0.1, duration: D(0.06), yoyo: true, repeat: 1, ease: "none" }, at);
  const wink = (at: number, hold = 0.6) => {
    timeline.set(".actor-eye-right", { opacity: 0 }, at).set(".actor-wink", { opacity: 1 }, at);
    timeline.set(".actor-eye-right", { opacity: 1 }, at + D(hold)).set(".actor-wink", { opacity: 0 }, at + D(hold));
  };
  const rings = (at: number, repeat: number) =>
    timeline.fromTo(".actor-ring", { scale: 1, opacity: 0.8 }, { scale: 1.9, opacity: 0, duration: D(0.7), stagger: D(0.23), repeat, ease: "power1.out" }, at);
  const shake = (at: number) => {
    if (!move) return;
    timeline.fromTo(".film-shake", { x: -8, y: 5 }, { x: 0, y: 0, duration: D(0.3), ease: "elastic.out(1.2, 0.3)" }, at);
  };

  // Ella starts hidden in the star (set right away too, so the very first frame is right).
  gsap.set(actor, { x: 640, y: 260, scale: 0, rotate: 0 });
  timeline.set(actor, { x: 640, y: 260, scale: 0, rotate: 0 }, 0);

  // Scenes swap behind a quick wipe.
  for (const [cueIndex, cue] of FILM_CUES.entries()) {
    if (cueIndex > 0 && move) {
      const wipeColour = ["#A69FF0", "#FFE2A6", "#8FE3C4", "#FF8C9E"][cueIndex % 4];
      timeline.fromTo(".film-wipe", { x: -700, backgroundColor: wipeColour }, { x: 1500, duration: D(0.42), ease: "power2.inOut" }, cue.start - D(0.42));
    }
    timeline.set(`[data-scene="${cue.id}"]`, { autoAlpha: 1 }, cue.start - D(0.22));
    const nextCue = FILM_CUES[cueIndex + 1];
    if (nextCue) timeline.set(`[data-scene="${cue.id}"]`, { autoAlpha: 0 }, nextCue.start - D(0.22));
  }

  // Words pop in as she says them, then fly off.
  for (const cue of FILM_CUES) {
    const wordSelector = `[data-line="${cue.id}"] .kin-word`;
    FILM_WORDS[cue.id].forEach((spokenWord, wordIndex) => {
      const isKey = KEY_WORDS.has(cleanWord(spokenWord.w));
      timeline.fromTo(
        `[data-line="${cue.id}"] .kin-word:nth-child(${wordIndex + 1})`,
        { autoAlpha: 0, scale: isKey ? 2.2 : 0.3, y: isKey ? 0 : 50 * move, rotate: ((wordIndex % 3) - 1) * 9 * move },
        { autoAlpha: 1, scale: 1, y: 0, rotate: isKey ? ((wordIndex % 2) * 2 - 1) * 3 * move : 0, duration: isKey ? 0.32 : 0.24, ease: isKey ? "back.out(2.6)" : "back.out(1.8)" },
        spokenWord.t - D(0.04),
      );
    });
    const next = FILM_CUES[FILM_CUES.indexOf(cue) + 1];
    const leaveAt = next ? Math.min(cue.end + D(0.25), next.start - D(0.32)) : FILM_DURATION + 5;
    timeline.to(wordSelector, { autoAlpha: 0, y: -40 * move, scale: 0.9, duration: D(0.2), stagger: D(0.012), ease: "power2.in" }, leaveAt);
  }

  // Light drifts to a new spot and colour each scene.
  const glowSpots: Record<FilmSceneID, [number, number, number, number, string]> = {
    hello: [380, 40, 520, 140, "#6E5CF0"], menubar: [120, -60, 760, 260, "#A69FF0"], talk: [700, 0, 80, 300, "#6E5CF0"],
    screen: [240, 120, 760, 0, "#2F6FD6"], mail: [-40, 80, 760, 220, "#1E7A5C"], control: [640, 160, 60, 0, "#FF8C9E"],
    board: [200, -40, 720, 300, "#2F6FD6"], memory: [-20, 160, 800, 60, "#6E5CF0"], privacy: [380, 120, 400, 160, "#1C163A"], cta: [380, 40, 520, 160, "#6E5CF0"],
  };
  for (const cue of FILM_CUES) {
    const [glowAX, glowAY, glowBX, glowBY, glowColour] = glowSpots[cue.id];
    timeline.to(".film-glow-a", { left: glowAX, top: glowAY, backgroundColor: glowColour, duration: D(1.2), ease: "sine.inOut" }, cue.start - D(0.5));
    timeline.to(".film-glow-b", { left: glowBX, top: glowBY, duration: D(1.4), ease: "sine.inOut" }, cue.start - D(0.4));
  }

  // Blinks now and then.
  FILM_CUES.forEach((cue) => blink(cue.start + (cue.end - cue.start) * 0.6));

  // ── Lead + hello: a star swells during the riser, bursts into Ella on the drop, she waves.
  const drop = cueStart("hello") - D(0.2);
  timeline.fromTo(".film-lead-star", { scale: 0.2, autoAlpha: 1 }, { scale: 3.2, duration: drop - 0.1, ease: "power2.in" }, 0.1);
  timeline.to(".film-lead-star", { autoAlpha: 0, duration: 0.12 }, drop);
  timeline.fromTo(".film-burst", { scale: 0.3, opacity: 0.9 }, { scale: 4.5 * (move || 0.3), opacity: 0, duration: D(1), ease: "power2.out" }, drop);
  timeline.to(actor, { scale: 1.45, duration: D(0.7), ease: "elastic.out(1, 0.5)" }, drop);
  shake(drop + 0.02);
  timeline.to(".actor-hand-r", { rotate: -40, duration: D(0.14), yoyo: true, repeat: 5, ease: "sine.inOut" }, drop + D(0.3));
  FILM_WORDS.hello.forEach((spokenWord) => {
    hop(spokenWord.t, 50);
    shake(spokenWord.t + D(0.06));
  });
  wink(word("hello", 2) + D(0.1), 0.7);

  // ── Menu bar: Ella flies up into the notch, then drops onto the keys and presses them.
  let at = cueStart("menubar");
  timeline.from(".film-menubar", { y: -50 * move, duration: D(0.4) }, at - D(0.22));
  ella(640, 140, 0.8, at - D(0.1), 0.4);
  ella(640, 19, 0.15, word("menubar", 4), 0.45, "power3.in");
  timeline.to(".film-notch", { width: 440, left: 420, duration: D(0.45), ease: "back.out(1.6)" }, word("menubar", 6));
  timeline.to(".film-notch-word, .film-notch-bars", { opacity: 1, duration: D(0.2) }, word("menubar", 6) + D(0.15));
  timeline.to(".film-bar", { scaleY: 0.3, duration: D(0.16), stagger: { each: D(0.05), repeat: 9, yoyo: true } }, word("menubar", 6) + D(0.15));
  timeline.from(".film-key-a, .film-key-b", { y: 200 * move, autoAlpha: 0, stagger: D(0.1), duration: D(0.4), ease: "back.out(1.6)" }, word("menubar", 7) - D(0.3));
  // Pops out of the notch and lands on ⌃ ...
  timeline.to(actor, { keyframes: { x: [640, 600, 540], y: [19, 200, 372], scale: [0.15, 0.6, 0.62], ease: "none" }, duration: D(0.45) * (move || 0.01), ease: "power2.in" }, word("menubar", 7));
  squash(word("menubar", 8));
  timeline.to(".film-key-a", { y: 10, boxShadow: "0 2px 0 #1C163A", duration: D(0.1) }, word("menubar", 8));
  // ... then hops onto ⇧ and holds both.
  timeline.to(actor, { keyframes: { x: [540, 640, 740], y: [372, 290, 372] }, duration: D(0.3) * (move || 0.01), ease: "none" }, word("menubar", 10) - D(0.25));
  squash(word("menubar", 10) + D(0.05));
  timeline.to(".film-key-b", { y: 10, boxShadow: "0 2px 0 #1C163A", duration: D(0.1) }, word("menubar", 10) + D(0.05));
  timeline.to(".film-key-label-talk", { opacity: 1, scale: 1, duration: D(0.3), ease: "back.out(2.4)", startAt: { scale: 0.4 } }, word("menubar", 11));
  ella(640, 300, 0.9, word("menubar", 12), 0.35, "back.out(1.6)");
  rings(word("menubar", 13), 1);

  // ── Talk: she moves aside, sound rings out, the languages pop and orbit.
  at = cueStart("talk");
  ella(985, 380, 1.2, at - D(0.25), 0.4);
  rings(at + D(0.1), 2);
  timeline.from(".film-chip-en", { scale: 0, rotate: -30, duration: D(0.35), ease: "back.out(2.4)" }, word("talk", 4) - D(0.04));
  timeline.from(".film-chip-hi", { scale: 0, rotate: 30, duration: D(0.35), ease: "back.out(2.4)" }, word("talk", 7) - D(0.04));
  timeline.to(".film-chip-en", { y: -14 * move, duration: D(0.5), yoyo: true, repeat: 3, ease: "sine.inOut" }, word("talk", 5));
  timeline.to(".film-chip-hi", { y: 14 * move, duration: D(0.5), yoyo: true, repeat: 3, ease: "sine.inOut" }, word("talk", 8));
  timeline.from(".film-sound", { autoAlpha: 0, scale: 0.4, rotate: -20, duration: D(0.3), ease: "back.out(2)" }, word("talk", 12));
  timeline.to(".film-sound", { y: -30 * move, rotate: 14, duration: D(0.4), yoyo: true, repeat: 2, ease: "sine.inOut" }, word("talk", 12) + D(0.3));
  hop(word("talk", 13), 40);

  // ── Screen: the window lands, Ella picks up her pen and rides the line as she draws.
  at = cueStart("screen");
  timeline.from(".film-window", { y: 80 * move, rotate: 2 * move, autoAlpha: 0, duration: D(0.45), ease: "back.out(1.4)" }, at - D(0.2));
  ella(124, 300, 0.5, at - D(0.25), 0.4);
  // "Show me your screen": the other pair of keys, ⌃ ⌥, and a capture flash.
  timeline.from(".film-skey", { y: 160 * move, autoAlpha: 0, stagger: D(0.08), duration: D(0.35), ease: "back.out(1.8)" }, word("screen", 3) - D(0.25));
  timeline.to(actor, { keyframes: { x: [124, 96, 68], y: [300, 300, 380] }, duration: D(0.3) * (move || 0.01), ease: "none" }, word("screen", 3));
  squash(word("screen", 4));
  timeline.to(".film-skey-a", { y: 8, boxShadow: "0 2px 0 #1C163A", duration: D(0.08) }, word("screen", 4));
  timeline.to(actor, { keyframes: { x: [68, 124, 180], y: [380, 320, 380] }, duration: D(0.26) * (move || 0.01), ease: "none" }, word("screen", 5) - D(0.1));
  squash(word("screen", 6) - D(0.05));
  timeline.to(".film-skey-b", { y: 8, boxShadow: "0 2px 0 #1C163A", duration: D(0.08) }, word("screen", 6) - D(0.05));
  timeline.fromTo(".film-capture", { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: D(0.18), yoyo: true, repeat: 1, ease: "power2.out" }, word("screen", 10));
  timeline.to(".film-key-label-screen", { opacity: 1, scale: 1, duration: D(0.3), ease: "back.out(2.4)", startAt: { scale: 0.4 } }, word("screen", 6));
  timeline.to(".film-window", { scale: 1.03, duration: D(0.15), yoyo: true, repeat: 1 }, word("screen", 10));
  timeline.to(".actor-pen", { opacity: 1, duration: D(0.15) }, word("screen", 10));
  // The pen tip (her right hand) runs along each line while it draws.
  const penTipOffset = { x: -62, y: -50 };
  ella(640 + penTipOffset.x, 270 + penTipOffset.y, 0.55, word("screen", 10), 0.3);
  timeline.to(actor, { motionPath: { path: "#film-path-wing", offsetX: penTipOffset.x, offsetY: penTipOffset.y }, duration: D(1.05) * (move || 0.01), ease: "power1.inOut" }, word("screen", 11));
  timeline.fromTo(".film-pen-wing", { drawSVG: "0%" }, { drawSVG: "100%", duration: D(1.05), ease: "power1.inOut" }, word("screen", 11));
  timeline.from(".film-pill-wing", { scale: 0, rotate: -12, duration: D(0.3), ease: "back.out(2.6)" }, word("screen", 11) + D(1.05));
  ella(500 + penTipOffset.x, 380 + penTipOffset.y, 0.55, word("screen", 14), 0.25);
  timeline.to(actor, { motionPath: { path: "#film-path-tail", offsetX: penTipOffset.x, offsetY: penTipOffset.y }, duration: D(0.7) * (move || 0.01), ease: "power1.inOut" }, word("screen", 15) - D(0.05));
  timeline.fromTo(".film-pen-tail", { drawSVG: "0%" }, { drawSVG: "100%", duration: D(0.7), ease: "power1.inOut" }, word("screen", 15) - D(0.05));
  timeline.from(".film-pill-tail", { scale: 0, rotate: 12, duration: D(0.3), ease: "back.out(2.6)" }, word("screen", 16) + D(0.2));
  wink(word("screen", 16) + D(0.1), 0.4);
  timeline.to(".actor-pen", { opacity: 0, duration: D(0.1) }, cueEnd("screen") + D(0.3));

  // ── Mail: cards rain in, Ella kicks the spam away and throws the interview onto Thursday.
  at = cueStart("mail");
  timeline.from(".film-mail", { y: -500 * move, rotate: (mailIndex: number) => [-14, 10, -8, 16][mailIndex] * move, autoAlpha: 0, stagger: D(0.09), duration: D(0.5), ease: "bounce.out" }, at - D(0.2));
  timeline.from(".film-calendar", { x: 500 * move, autoAlpha: 0, duration: D(0.45), ease: "back.out(1.4)" }, word("mail", 3));
  ella(620, 620, 0.6, at - D(0.2), 0.4);
  ella(560, 450, 0.6, word("mail", 7) - D(0.2), 0.3);
  timeline.to(".actor-hand-l", { rotate: 60, x: -10, duration: D(0.12), yoyo: true, repeat: 1 }, word("mail", 7));
  timeline.to(".film-mail-spam", { x: -900 * move, y: (spamIndex) => [120, 260][spamIndex] * move, rotate: (spamIndex) => [-60, -110][spamIndex] * move, autoAlpha: 0, stagger: D(0.18), duration: D(0.6), ease: "power2.in" }, word("mail", 7) + D(0.08));
  timeline.to(".film-mail-keep, .film-mail-interview", { boxShadow: "6px 7px 0 #05040f, 0 0 0 5px #FFE2A6", duration: D(0.25) }, word("mail", 8));
  // Grabs the interview card ...
  ella(540, 250, 0.6, word("mail", 10), 0.3);
  timeline.to(".film-mail-interview", { scale: 1.06, duration: D(0.15) }, word("mail", 11));
  // ... and throws it onto Thursday.
  timeline.to(".film-mail-interview", { keyframes: { x: [0, 400, 600], y: [0, -140, 60], scale: [1.06, 0.7, 0.25], rotate: [0, 18, 0], ease: "none" }, autoAlpha: 0, duration: D(0.75) * (move || 0.01), ease: "power1.in" }, word("mail", 13));
  ella(700, 330, 0.6, word("mail", 13), 0.35);
  timeline.to(".film-cal-event", { opacity: 1, scale: 1, duration: D(0.3), ease: "back.out(2.6)", startAt: { scale: 2 } }, word("mail", 16) - D(0.05));
  timeline.to(".film-cal-thu", { backgroundColor: "#eeeafe", duration: D(0.2) }, word("mail", 16));
  timeline.to(".film-bell", { opacity: 1, duration: D(0.2) }, word("mail", 16) + D(0.15));
  timeline.to(".film-bell-icon", { rotate: 20, duration: D(0.08), repeat: 7, yoyo: true, transformOrigin: "50% 10%", ease: "sine.inOut" }, word("mail", 16) + D(0.2));
  wink(word("mail", 16) + D(0.15), 0.5);

  // ── Control: apps pop up, Ella hops on three, the browser opens and the reply types itself.
  at = cueStart("control");
  timeline.from(".film-app", { y: 220 * move, scale: 0.4, autoAlpha: 0, stagger: D(0.07), duration: D(0.4), ease: "back.out(2)" }, at - D(0.2));
  ella(280, 300, 0.55, at - D(0.2), 0.35);
  [1, 2, 3].forEach((hopIndex) => {
    const landAt = word("control", [1, 2, 3][hopIndex - 1]);
    const iconX = 345 + (hopIndex - 1) * 130 + 55;
    const fromX = hopIndex === 1 ? 280 : iconX - 130;
    timeline.to(actor, { keyframes: { x: [fromX, iconX], y: [280, 230, 280] }, duration: D(0.26) * (move || 0.01), ease: "none" }, landAt - D(0.24));
    squash(landAt + D(0.02));
    timeline.to(`.film-app-${hopIndex - 1}`, { y: 10, scale: 0.94, boxShadow: "0 2px 0 #05040f, 0 0 0 6px #A69FF0", duration: D(0.1), yoyo: true, repeat: 1 }, landAt);
  });
  timeline.to(".film-app", { y: -500 * move, rotate: (appIndex) => (appIndex - 2) * 25 * move, autoAlpha: 0, stagger: D(0.04), duration: D(0.45), ease: "power3.in" }, word("control", 4));
  timeline.fromTo(".film-browser", { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: D(0.45), ease: "back.out(1.6)" }, word("control", 5));
  ella(1050, 245, 0.5, word("control", 5), 0.4);
  timeline.to(".film-caret", { opacity: 0, duration: D(0.2), repeat: 9, yoyo: true }, word("control", 6));
  timeline.to(".film-typed", { text: "Thanks Riya! See you Thursday at 3:30 🙌", duration: D(1.15), ease: "none" }, word("control", 10));
  timeline.to(".actor-hand-l, .actor-hand-r", { y: 8, duration: D(0.07), repeat: 15, yoyo: true, stagger: D(0.035) }, word("control", 10));

  // ── Board: Ella grabs a marker and draws the sketch, riding each line.
  at = cueStart("board");
  timeline.from(".film-paper", { y: 600 * move, rotate: -6 * move, duration: D(0.5), ease: "back.out(1.2)" }, at - D(0.22));
  ella(300, 600, 0.55, at - D(0.2), 0.4);
  timeline.set(".actor-pen rect", { fill: "#2A2450" }, at - D(0.22));
  timeline.to(".actor-pen", { opacity: 1, duration: D(0.12) }, word("board", 4));
  const markerOffset = { x: -62, y: -50 };
  const sketchSteps: [string, number, number, string | null][] = [
    ["airfoil", word("board", 5), 0.75, ".film-hand-wing"],
    ["fast", word("board", 7) + D(0.05), 0.55, ".film-hand-fast"],
    ["slow", word("board", 9) + D(0.05), 0.5, ".film-hand-slow"],
    ["lift", word("board", 11) - D(0.05), 0.35, ".film-hand-lift"],
  ];
  for (const [sketchName, drawAt, drawSeconds, noteSelector] of sketchSteps) {
    timeline.to(actor, { motionPath: { path: `#film-path-${sketchName}`, offsetX: markerOffset.x, offsetY: markerOffset.y }, duration: D(drawSeconds) * (move || 0.01), ease: "power1.inOut" }, drawAt);
    timeline.fromTo(`.film-sketch-${sketchName}`, { drawSVG: "0%" }, { drawSVG: "100%", duration: D(drawSeconds), ease: "power1.inOut" }, drawAt);
    if (noteSelector) timeline.to(noteSelector, { opacity: 1, duration: D(0.12) }, drawAt + D(drawSeconds));
  }
  ella(1000, 560, 0.6, word("board", 11) + D(0.45), 0.35, "back.out(1.6)");
  wink(word("board", 11) + D(0.7), 0.4);
  timeline.to(".actor-pen", { opacity: 0, duration: D(0.1) }, cueEnd("board") + D(0.3));

  // ── Memory: each note slaps on as Ella taps it; the goal ring fills while she spins.
  at = cueStart("memory");
  ella(1000, 640, 0.6, at - D(0.2), 0.4);
  [word("memory", 1), word("memory", 3), word("memory", 5)].forEach((slapAt, noteIndex) => {
    timeline.from(`.film-note-${noteIndex}`, { scale: 1.8 * move || 1, autoAlpha: 0, rotate: (noteIndex - 1) * 20 * move, duration: D(0.3), ease: "back.out(2.2)" }, slapAt - D(0.04));
    shake(slapAt + D(0.1));
  });
  timeline.from(".film-goal", { scale: 0, rotate: -90 * move, duration: D(0.45), ease: "back.out(1.8)" }, word("memory", 7));
  ella(820, 580, 0.62, word("memory", 7), 0.35);
  timeline.fromTo(".film-ring", { drawSVG: "0%" }, { drawSVG: "73%", duration: D(1.3), ease: "power2.out" }, word("memory", 8));
  timeline.fromTo(".film-goal-count", { textContent: 0 }, { textContent: 22, snap: { textContent: 1 }, duration: D(1.3), ease: "power2.out" }, word("memory", 8));
  timeline.to(actor, { rotate: 360 * move, duration: D(0.6), ease: "power2.inOut" }, word("memory", 10));
  timeline.set(actor, { rotate: 0 }, word("memory", 10) + D(0.62));
  hop(word("memory", 12), 50);

  // ── Privacy: keys down and she listens; keys up and she dozes off, locked.
  at = cueStart("privacy");
  timeline.from(".film-pkey", { y: 220 * move, autoAlpha: 0, stagger: D(0.08), duration: D(0.4), ease: "back.out(1.6)" }, at - D(0.2));
  ella(640, 300, 0.9, at - D(0.2), 0.4);
  timeline.to(".film-pkey", { y: 10, boxShadow: "0 2px 0 #1C163A", duration: D(0.1) }, word("privacy", 4));
  timeline.to(".film-mic-on", { opacity: 1, duration: D(0.1) }, word("privacy", 4));
  timeline.to(".film-mic-off", { opacity: 0, duration: D(0.1) }, word("privacy", 4));
  rings(word("privacy", 4), 1);
  timeline.to(".film-pkey", { y: 0, boxShadow: "0 12px 0 #1C163A", duration: D(0.1) }, word("privacy", 8));
  timeline.to(".film-mic-on", { opacity: 0, duration: D(0.1) }, word("privacy", 8));
  timeline.to(".film-mic-off", { opacity: 1, duration: D(0.1) }, word("privacy", 8));
  timeline.set(".actor-eye-open", { opacity: 0 }, word("privacy", 8)).set(".actor-sleep", { opacity: 1 }, word("privacy", 8));
  timeline.to(actor, { rotate: -10 * move, y: 312, duration: D(0.4), ease: "sine.inOut" }, word("privacy", 8));
  timeline.fromTo(".actor-z", { opacity: 0, y: 10 }, { opacity: 1, y: -10, duration: D(0.4), stagger: D(0.18) }, word("privacy", 8) + D(0.1));
  timeline.to(".actor-lock", { opacity: 1, scale: 1, duration: D(0.3), ease: "back.out(3)", startAt: { scale: 2 } }, word("privacy", 10));
  // Wakes up for the end.
  timeline.set(".actor-eye-open", { opacity: 1 }, cueStart("cta") - D(0.3)).set(".actor-sleep, .actor-z, .actor-lock", { opacity: 0 }, cueStart("cta") - D(0.3));

  // ── Call to action: big, bouncy, on every word.
  at = cueStart("cta");
  timeline.to(actor, { x: 640, y: 185, scale: 1.3, rotate: 0, duration: D(0.5) * (move || 0.01), ease: "back.out(1.8)" }, at - D(0.3));
  FILM_WORDS.cta.forEach((spokenWord) => {
    hop(spokenWord.t, 40);
    shake(spokenWord.t + D(0.05));
  });
  wink(word("cta", 1) + D(0.1), 0.8);
  timeline.to(".actor-hand-r", { rotate: -40, duration: D(0.14), yoyo: true, repeat: 5, ease: "sine.inOut" }, word("cta", 6));
  timeline.from(".film-cta-sub", { y: 30 * move, autoAlpha: 0, duration: D(0.4) }, word("cta", 6));

  timeline.set({}, {}, FILM_DURATION);
  // Render the opening frame now, before the audio's clock starts moving it.
  timeline.time(0.001).time(0);
  return timeline;
}
