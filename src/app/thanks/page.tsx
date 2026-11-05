import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ella Pro · Thank you",
  robots: { index: false },
};

export default function ThanksPage() {
  return (
    <main className="on-night mx-auto w-full max-w-[860px] px-[clamp(18px,4vw,40px)] pt-[clamp(64px,12vw,120px)] pb-24">
      <h1 className="font-display text-[clamp(2.6rem,7vw,4.4rem)] leading-[1.02] tracking-[0.005em] text-moon uppercase">Ella Pro</h1>
      <p className="mt-6 max-w-[52ch] text-xl leading-relaxed text-moon/85">
        You&apos;re all set. Go back to Ella: she&apos;ll be ready in a moment.
      </p>
    </main>
  );
}
