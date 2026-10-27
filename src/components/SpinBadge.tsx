import { MayaFace } from "./MayaFace";

/**
 * The round sticker in the corner: a spinning ring of text around Maya, linking to the waitlist.
 * Hidden below md: at phone width a fixed badge covered the copy and forms (seen at 390px),
 * and the nav's "Join waitlist" pill is always in reach there.
 */
export function SpinBadge() {
  return (
    <a
      href="#waitlist"
      aria-label="Join the waitlist"
      className="press fixed right-6 bottom-6 z-40 hidden h-[128px] w-[128px] place-items-center rounded-full border-[2.5px] border-ink bg-lav shadow-[var(--shadow-cut-plum)] md:grid"
    >
      <svg viewBox="0 0 120 120" className="spin-slow absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <path id="badge-ring" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
        </defs>
        <text fill="#1C163A" style={{ font: "700 13.5px var(--font-barlow)", letterSpacing: "0.22em" }}>
          <textPath href="#badge-ring">JOIN THE WAITLIST · COMING TO MAC ·</textPath>
        </text>
      </svg>
      <span className="relative">
        <MayaFace size={30} />
      </span>
    </a>
  );
}
