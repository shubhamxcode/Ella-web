import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy · Ella",
  description: "What Ella, the voice assistant for Mac, keeps, what she sends to the services that power her, and how to delete it.",
  alternates: { canonical: "/privacy" },
};

const CONTACT_EMAIL = "shubh.varshneycode@gmail.com";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="31 October 2026"
      intro={
        <p>
          Ella is a voice assistant for your Mac. This page explains, in plain words, what she keeps, what she sends to the
          services that power her, and how you delete it. Ella is run by Shubham Varshney, an individual developer based in
          India (&ldquo;we&rdquo;, &ldquo;us&rdquo;).
        </p>
      }
    >
      <h2>The short version</h2>
      <ul>
        <li>Ella listens only while you hold her shortcut, and looks at your screen only while you hold Control + Option.</li>
        <li>Your account, profile, the things Ella remembers about you, your conversations and your goals are stored in your own account, so she remembers you on any Mac.</li>
        <li>Your mail, calendar and reminders are read on your Mac. Only what&apos;s needed to answer you is sent to the AI model.</li>
        <li>We don&apos;t sell your data, show ads, or use analytics or trackers.</li>
        <li>You can delete what Ella remembers in the app at any time, or ask us to delete your whole account.</li>
      </ul>

      <h2>What we collect and why</h2>

      <h3>Your account</h3>
      <p>
        When you sign in with Google or Apple, we receive your email address, your name and, with Google, your profile
        picture. We use them to create your account and show who is signed in. Ella asks Google only for this basic
        profile. She does not use Google&apos;s APIs to read your Gmail, Calendar or Drive.
      </p>

      <h3>Your profile</h3>
      <p>
        What you choose to tell Ella in setup: the name she calls you, your full name, your usual language, your time zone
        and a short note about yourself. Every field is optional.
      </p>

      <h3>What Ella remembers, your conversations and your goals</h3>
      <p>
        To be useful over time, Ella saves facts you ask her to remember or that she learns from what you tell her (for
        example &ldquo;studies computer science&rdquo; or &ldquo;prefers short answers&rdquo;), short notes she writes
        about you from those facts, your conversations with her and their summaries, things to follow up on (like asking
        how an exam went), and your daily, weekly, monthly and yearly goals with your progress. To find old conversations
        when you ask about them, she also stores a mathematical representation (an &ldquo;embedding&rdquo;) of each
        conversation. She never saves passwords, one-time codes, card or bank numbers, or government ID numbers, even if
        asked.
      </p>

      <h3>Your voice</h3>
      <p>
        While you hold the shortcut, your voice is recorded and sent to be turned into text. The audio isn&apos;t stored by
        us after it&apos;s transcribed. If online transcription fails, your Mac&apos;s built-in speech recognition may be used
        instead.
      </p>

      <h3>Your screen</h3>
      <p>
        Only when you hold Control + Option, Ella takes a screenshot of your screens and sends it with your question to the
        AI model, so she can see what you mean and point at it. Screenshots aren&apos;t stored by us. If you draw on your
        screen in Ella&apos;s draw mode, your marks are part of that screenshot.
      </p>

      <h3>Mail</h3>
      <p>
        If you connect Gmail, Ella reads your recent inbox from the Apple Mail app on your Mac, which needs Full Disk Access
        that you grant. She sends short parts of your emails (sender, subject and a snippet) to the AI model to sort them and
        to answer your questions, and keeps the sorted list in a file on your Mac. She can draft a reply, but an email is
        sent only when you press Send on her mail card, through your own Mail app.
      </p>

      <h3>Calendar and reminders</h3>
      <p>
        If you connect them, Ella reads and adds events and reminders through your Mac&apos;s Calendar and Reminders, in the
        calendar and list you choose. Upcoming events and reminders are included with your questions so she can answer
        about your schedule. When an email looks like a meeting or interview invite, she offers to add it, and adds it only
        when you agree.
      </p>

      <h3>Web pages and web search</h3>
      <p>
        When you ask about the page you have open, Ella reads its text from your browser and sends it with your question to
        the AI model. To answer questions about things that change (news, prices, weather), the AI model may search the web.
      </p>

      <h3>On your Mac only</h3>
      <p>
        Some things never leave your Mac: Ella&apos;s settings, the log of actions she took on your Mac (like opening an app),
        the sorted mail list and found meeting invites, and the text she types for you at your cursor (she pastes it and
        then puts your clipboard back).
      </p>

      <h3>The website</h3>
      <p>
        This website doesn&apos;t use cookies, analytics or trackers. If you join the waitlist, we store your email address to
        tell you when Ella is ready, and nothing else.
      </p>

      <h3>Your plan and usage</h3>
      <p>
        We store your plan and how much of it you&apos;ve used, as counts: credits, tokens and the kind of each request. Never
        the words. This is how limits and billing work.
      </p>

      <h2>Who processes your data</h2>
      <p>Ella runs on a few services, each used only to do its part:</p>
      <ul>
        <li><strong>Supabase</strong> stores your account, profile, memories, conversations and goals. Every row is locked to your account with row-level security.</li>
        <li><strong>Cloudflare</strong> runs our server, which checks that you&apos;re signed in and passes requests to the AI services. It doesn&apos;t store their content.</li>
        <li><strong>Google (Gemini)</strong> is the AI model that writes Ella&apos;s replies, and does web searches, from your question, screenshot or page text when you share them, and the context described above.</li>
        <li><strong>Sarvam AI</strong> turns your voice into text and Ella&apos;s replies into her voice.</li>
        <li><strong>Google and Apple</strong> handle signing in.</li>
        <li><strong>Paddle</strong> is the Merchant of Record for Ella Pro. When you subscribe, it handles your payment details, tax and receipts under its own privacy notice. We never see your full card number.</li>
        <li><strong>Vercel</strong> hosts this website.</li>
      </ul>
      <p>
        These providers may process data in countries other than yours, including the United States and India, under their
        own privacy and security terms.
      </p>

      <h2>Google user data</h2>
      <p>
        Ella&apos;s use of information received from Google APIs adheres to the{" "}
        <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer">
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements. We use your Google profile only to sign you in, and we don&apos;t transfer
        it, use it for ads, or let anyone read it.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Your account data stays while you have an account, until you delete it. Voice audio and screenshots aren&apos;t kept
        by us after your request is answered. The services above may keep request logs for a short time for security and
        abuse prevention, under their own policies.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>Delete any memory or conversation in Ella&apos;s window, under Memories and Conversations.</li>
        <li>Edit or clear your profile at any time.</li>
        <li>Disconnect Gmail or Calendar on the Connectors page; disconnecting Gmail deletes the sorted mail list on your Mac.</li>
        <li>Turn off Mac permissions (microphone, screen recording, accessibility) in System Settings whenever you like.</li>
        <li>
          To get a copy of your data, or to delete your account and everything stored with it, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> from the address you sign in with. We&apos;ll do it
          within 30 days.
        </li>
      </ul>

      <h2>Security</h2>
      <p>
        Data travels over encrypted connections. Our server accepts requests only from signed-in users, and our AI service
        keys never leave the server. Your data in Supabase can be read only with your own signed-in account. No system is
        perfectly secure, but we work to keep yours safe and will tell you if something goes wrong that affects you.
      </p>

      <h2>Children</h2>
      <p>Ella isn&apos;t meant for children under 13, and we don&apos;t knowingly collect their data.</p>

      <h2>Changes</h2>
      <p>
        If this policy changes, we&apos;ll update this page and the date at the top. For important changes, we&apos;ll tell you in
        the app or by email.
      </p>

      <h2>Contact</h2>
      <p>
        Questions or requests: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Ella is run by Shubham Varshney,
        India.
      </p>
    </LegalPage>
  );
}
