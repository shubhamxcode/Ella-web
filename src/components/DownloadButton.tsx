import { Download } from "lucide-react";
import { DOWNLOADS_ENABLED, LATEST_RELEASE } from "@/lib/release";

/** The big "Download for Mac" button, with what you need to know under it. */
export function DownloadButton({ tone = "night" }: { tone?: "night" | "lav" }) {
  if (!DOWNLOADS_ENABLED) {
    return (
      <div className="flex w-full flex-col items-center sm:w-auto sm:items-start">
        <span
          aria-disabled="true"
          className={`cut flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-2xl px-7 py-4 font-display text-[clamp(1.4rem,2.4vw,1.75rem)] tracking-wide uppercase opacity-80 sm:w-auto ${
            tone === "lav" ? "bg-ink text-paper" : "bg-lav text-ink"
          }`}
        >
          <Download size={26} strokeWidth={2.6} aria-hidden />
          Download for Mac · Coming soon
        </span>
        <p className={`mt-3 text-[15px] ${tone === "lav" ? "text-ink/75" : "text-lav-l/80"}`}>
          {LATEST_RELEASE.minimumMacOS} or later · Apple silicon and Intel
        </p>
      </div>
    );
  }
  return (
    <div className="flex w-full flex-col items-center sm:w-auto sm:items-start">
      <a
        href="/download"
        className={`press cut flex w-full items-center justify-center gap-3 rounded-2xl px-7 py-4 font-display text-[clamp(1.4rem,2.4vw,1.75rem)] tracking-wide uppercase sm:w-auto ${
          tone === "lav" ? "bg-ink text-paper" : "bg-lav text-ink"
        }`}
      >
        <Download size={26} strokeWidth={2.6} aria-hidden />
        Download for Mac
      </a>
      <p className={`mt-3 text-[15px] ${tone === "lav" ? "text-ink/75" : "text-lav-l/80"}`}>
        {LATEST_RELEASE.minimumMacOS} or later · Apple silicon and Intel · {LATEST_RELEASE.sizeLabel}
      </p>
      <p className={`mt-1 text-[15px] ${tone === "lav" ? "text-ink/65" : "text-lav-l/65"}`}>
        Open the file, drag Ella into Applications, then open her.
      </p>
    </div>
  );
}
