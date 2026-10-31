import Link from "next/link";
import type { ReactNode } from "react";
import { EllaFace } from "@/components/EllaFace";

/**
 * The frame for Ella's long-read pages (privacy, terms): the site's header
 * and footer around one readable column of paper on the night sky.
 */
export function LegalPage({ title, updated, intro, children }: { title: string; updated: string; intro: ReactNode; children: ReactNode }) {
  return (
    <>
      <header className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 px-[clamp(18px,4vw,40px)] pt-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Ella home">
          <span className="-my-4 -ml-3">
            <EllaFace size={28} />
          </span>
          <span className="font-display text-[28px] tracking-wide text-moon uppercase">Ella</span>
          <span className="cut-sm -rotate-3 rounded-md bg-lav px-2 py-0.5 font-label text-sm font-bold uppercase tracking-wider text-ink">
            for Mac
          </span>
        </Link>
        <Link href="/" className="text-[16px] font-medium text-moon/85 hover:text-moon hover:underline">
          ← Back to Ella
        </Link>
      </header>

      <main className="mx-auto w-full max-w-[860px] px-[clamp(18px,4vw,40px)] pt-[clamp(40px,7vw,72px)] pb-24">
        <h1 className="font-display text-[clamp(2.6rem,7vw,4.4rem)] leading-[1.02] tracking-[0.005em] text-moon uppercase">{title}</h1>
        <p className="mt-3 font-label text-base font-bold uppercase tracking-wider text-lav">Last updated {updated}</p>
        <div className="mt-6 max-w-[64ch] text-[18px] leading-relaxed text-moon/85">{intro}</div>

        <article className="legal cut mt-10 rounded-[22px] bg-paper px-[clamp(20px,4vw,44px)] py-[clamp(24px,4vw,40px)] text-ink">
          {children}
        </article>
      </main>

      <footer className="border-t-[2.5px] border-ink bg-night-2">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col justify-between gap-3 px-[clamp(18px,4vw,40px)] py-8 text-[15px] text-moon/70 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2">
            <span className="-my-4 -ml-2">
              <EllaFace size={20} />
            </span>
            Ella · heyyella.com
          </p>
          <p className="flex gap-5">
            <Link href="/privacy" className="hover:text-moon hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:text-moon hover:underline">Terms</Link>
            <Link href="/refund" className="hover:text-moon hover:underline">Refunds</Link>
          </p>
        </div>
      </footer>
    </>
  );
}
