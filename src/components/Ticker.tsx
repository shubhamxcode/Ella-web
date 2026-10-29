import { Sparkle } from "lucide-react";

const TICKER_ITEMS = [
  "Talks back out loud",
  "Reads your Gmail",
  "Draws on your screen",
  "Runs your browser",
  "Opens your apps",
  "Remembers you",
  "Asks before it sends",
  "Made for Mac",
];

/** A tilted strip that drifts left forever. Decorative, so screen readers skip it. */
export function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative z-10 -my-3 -rotate-[1.6deg] border-y-[2.5px] border-ink bg-star py-3 text-ink shadow-[0_6px_0_#05040f]" aria-hidden>
      <div className="overflow-hidden">
        <div className="ticker-track flex w-max items-center">
          {items.map((item, itemIndex) => (
            <span key={itemIndex} className="flex items-center gap-6 px-6 font-display text-[22px] uppercase tracking-wide whitespace-nowrap">
              {item}
              <Sparkle size={18} strokeWidth={2.6} className="fill-plum text-ink" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
