import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service · Ella",
  description: "The terms for using Ella, the voice assistant for Mac.",
  alternates: { canonical: "/terms" },
};

const CONTACT_EMAIL = "shubh.varshneycode@gmail.com";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="30 October 2026"
      intro={
        <p>
          These terms are the agreement between you and Shubham Varshney (&ldquo;we&rdquo;, &ldquo;us&rdquo;), the individual
          developer in India who makes Ella. By using Ella or this website, you agree to them. Please also read our{" "}
          <Link href="/privacy" className="font-semibold text-lav underline underline-offset-4">Privacy Policy</Link>.
        </p>
      }
    >
      <h2>What Ella is</h2>
      <p>
        Ella is a voice assistant for macOS. She answers questions out loud, can look at your screen when you ask, read your
        mail through Apple Mail, manage calendar events, reminders and goals, open and control apps and the browser, and draw
        on your screen or her whiteboard to explain things. Ella is new and still changing. Features may be added, changed or
        removed.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>You need a Google or Apple account to sign in, and you must be at least 13 years old.</li>
        <li>Keep your Mac and accounts secure. You&apos;re responsible for what happens through your account.</li>
        <li>Tell us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> if you think someone else is using it.</li>
      </ul>

      <h2>Using Ella fairly</h2>
      <p>Don&apos;t use Ella to:</p>
      <ul>
        <li>break the law, or harm, harass or deceive anyone;</li>
        <li>get into accounts, systems or data you aren&apos;t allowed to;</li>
        <li>overload, reverse engineer, resell or get around the limits of Ella or the services behind her;</li>
        <li>create content that infringes someone else&apos;s rights.</li>
      </ul>
      <p>We may limit how much you can use Ella to keep her working for everyone, and may suspend accounts that break these terms.</p>

      <h2>You stay in control</h2>
      <p>
        Ella acts on your Mac only when you ask: she opens apps, types where your cursor is, adds events and reminders, and
        drafts replies. She sends an email only when you press Send on her mail card. Please
        check what she&apos;s about to do. You&apos;re responsible for the actions you ask her to take and the messages you send.
      </p>

      <h2>AI can be wrong</h2>
      <p>
        Ella&apos;s answers, summaries, drawings, reminders and drafts are made by AI and can be incomplete, out of date or
        wrong. Don&apos;t rely on her for medical, legal, financial or safety decisions; check important things yourself.
      </p>

      <h2>Your content</h2>
      <p>
        What you say and show to Ella stays yours. You allow us and the services we use to process it only to run Ella for
        you, as our Privacy Policy describes.
      </p>

      <h2>Third-party services</h2>
      <p>
        Ella works with apps and services that aren&apos;t ours, such as Apple Mail, Calendar, Reminders, your browser and
        Google or Apple sign-in. Their own terms apply to them, and we aren&apos;t responsible for them.
      </p>

      <h2>Plans and payment</h2>
      <p>
        Ella will offer paid plans. Before you subscribe, you&apos;ll see what each plan includes and what it costs, and
        nothing is charged without your agreement.
      </p>

      <h2>No warranty</h2>
      <p>
        Ella is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties of any kind, to the extent the
        law allows. We don&apos;t promise she&apos;ll always be available, free of errors, or right.
      </p>

      <h2>Limit of liability</h2>
      <p>
        To the extent the law allows, we aren&apos;t liable for indirect or consequential losses, or for lost data, profits or
        opportunities, from using Ella. Our total liability for any claim is limited to the amount you paid us for Ella in
        the 12 months before it, or ₹1,000 if you paid nothing.
      </p>

      <h2>Ending</h2>
      <p>
        You can stop using Ella at any time and ask us to delete your account (see the Privacy Policy). We may stop
        offering Ella, or end your access if you break these terms, with notice where we reasonably can.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms. We&apos;ll change the date at the top, and tell you in the app or by email about important
        changes. Using Ella after that means you accept the new terms.
      </p>

      <h2>Law</h2>
      <p>These terms are governed by the laws of India. Courts in India have jurisdiction over any dispute.</p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> · Shubham Varshney, India.
      </p>
    </LegalPage>
  );
}
