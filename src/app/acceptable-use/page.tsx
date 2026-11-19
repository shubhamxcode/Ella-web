import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Acceptable Use Policy · Ella",
  description: "What you may and may not use Ella for.",
  alternates: { canonical: "/acceptable-use" },
};

const CONTACT_EMAIL = "shubh.varshneycode@gmail.com";

export default function AcceptableUsePage() {
  return (
    <LegalPage
      title="Acceptable Use Policy"
      updated="19 November 2026"
      intro={
        <p>
          Ella is a productivity app for your Mac. This policy says what you may not use her for. It&apos;s part of our{" "}
          <Link href="/terms" className="font-semibold text-lav underline underline-offset-4">Terms</Link>.
        </p>
      }
    >
      <h2>What Ella is for</h2>
      <p>
        Getting things done on your own Mac by voice: opening and controlling apps, reading and drafting replies to your email,
        adding calendar events and reminders, typing where your cursor is, and explaining what&apos;s on your screen. Ella is not
        a companion or a relationship chatbot.
      </p>

      <h2>You may not use Ella to</h2>
      <ul>
        <li>create sexual, pornographic or sexually suggestive content, or any content involving minors;</li>
        <li>impersonate a real person, or make deepfakes, face swaps or voice imitations of anyone;</li>
        <li>harass, threaten, bully or deceive people, or promote violence or hatred;</li>
        <li>send spam, phishing or bulk unsolicited messages;</li>
        <li>break the law, or help anyone else break it;</li>
        <li>get into accounts, systems or data you aren&apos;t allowed to use;</li>
        <li>break someone else&apos;s copyright, trademark, privacy or other rights;</li>
        <li>get around Ella&apos;s limits or safety checks, resell her, or overload the services behind her;</li>
        <li>make medical, legal, financial or safety decisions without checking them yourself.</li>
      </ul>

      <h2>What we do</h2>
      <p>
        Ella sends an email only when you press Send, and only acts on your Mac when you ask her to. If an account breaks this
        policy, we may limit it, suspend it or close it, and we may report illegal activity to the authorities.
      </p>

      <h2>Independent product</h2>
      <p>
        Ella is made by Shubham Varshney and uses third-party AI and speech services to work. Ella isn&apos;t affiliated with,
        endorsed by or sponsored by Google, Apple or any AI model provider.
      </p>

      <h2>Report misuse</h2>
      <p>
        Write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  );
}
