/**
 * Ella's face, the same "winky screen" character as the Mac app
 * (EllaOrb.swift), drawn on a 100-unit grid.
 * - resting: winks, breathes, blinks now and then
 * - listening: both eyes open, a small smile, rings flow in
 * - thinking: eyes look up, a little "o" mouth
 * - speaking: the mouth moves, rings ripple out
 */
export type EllaMood = "resting" | "listening" | "thinking" | "speaking";

const INK = "#1C163A";
const BLUSH = "#FF8C9E";

function GlossyEye({ cx, lookUp }: { cx: number; lookUp: boolean }) {
  const cy = 38.5;
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={7.25} ry={9.06} fill={INK} />
      <circle cx={cx - 2.03} cy={cy - (lookUp ? 4.9 : 3.19)} r={3.05} fill="#fff" />
      <circle cx={cx + 2.61} cy={cy + (lookUp ? 0.3 : 2.9)} r={1.16} fill="#fff" opacity={0.85} />
    </g>
  );
}

function Mouth({ mood }: { mood: EllaMood }) {
  if (mood === "listening") {
    return <path d="M41 62 Q50 70 59 62" fill="none" stroke={INK} strokeWidth={3.4} strokeLinecap="round" />;
  }
  if (mood === "thinking") {
    return <ellipse cx={50} cy={64} rx={3.5} ry={4} fill={INK} />;
  }
  return (
    <g className={mood === "speaking" ? "ella-talk" : undefined}>
      <clipPath id="ella-mouth">
        <path d="M37 60 H63 Q50 80 37 60 Z" />
      </clipPath>
      <path d="M37 60 H63 Q50 80 37 60 Z" fill={INK} />
      <ellipse cx={50} cy={70} rx={6.5} ry={3.8} fill={BLUSH} clipPath="url(#ella-mouth)" />
    </g>
  );
}

function VoiceRings({ mood }: { mood: EllaMood }) {
  if (mood !== "listening" && mood !== "speaking") return null;
  const ringClass = mood === "listening" ? "ella-ring-in" : "ella-ring-out";
  return (
    <g aria-hidden>
      {[0, 1, 2].map((ringIndex) => (
        <rect
          key={ringIndex}
          className={ringClass}
          style={{ animationDelay: `${-ringIndex * 0.55}s` }}
          x={0}
          y={0}
          width={100}
          height={93}
          rx={33}
          fill="none"
          stroke="#A69FF0"
          strokeWidth={3}
        />
      ))}
    </g>
  );
}

export function EllaFace({
  mood = "resting",
  size = 96,
  className = "",
  title,
}: {
  mood?: EllaMood;
  size?: number;
  className?: string;
  /** Spoken label; leave out when the face is decoration next to text. */
  title?: string;
}) {
  const lookUp = mood === "thinking";
  return (
    <svg
      viewBox="-32 -32 164 157"
      width={size * 1.64}
      height={size * 1.57}
      className={`overflow-visible ${className}`}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id="ella-face-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CCC6FF" />
          <stop offset="1" stopColor="#A69FF0" />
        </linearGradient>
      </defs>
      <VoiceRings mood={mood} />
      <g className="ella-breathe">
        <rect x={0} y={0} width={100} height={93} rx={33} fill="url(#ella-face-fill)" stroke={INK} strokeWidth={2.5} />
        <g className={mood === "resting" ? "ella-blink" : undefined}>
          <GlossyEye cx={30} lookUp={lookUp} />
        </g>
        {mood === "resting" ? (
          <path d="M61.5 41 Q70 33 78.5 41" fill="none" stroke={INK} strokeWidth={3.4} strokeLinecap="round" />
        ) : (
          <GlossyEye cx={70} lookUp={lookUp} />
        )}
        <ellipse cx={26} cy={54.5} rx={6} ry={3.3} fill={BLUSH} opacity={0.85} />
        <ellipse cx={74} cy={54.5} rx={6} ry={3.3} fill={BLUSH} opacity={0.85} />
        <Mouth mood={mood} />
      </g>
    </svg>
  );
}
