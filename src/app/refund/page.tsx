import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Refund Policy · Ella",
  description: "How refunds work for Ella Pro.",
  alternates: { canonical: "/refund" },
};

const CONTACT_EMAIL = "shubh.varshneycode@gmail.com";

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund Policy"
      updated="31 October 2026"
      intro={
        <p>
          Ella has 50 free messages so you can try her before you pay. If Ella Pro still isn&apos;t right for you, here&apos;s
          how refunds work. Our{" "}
          <Link href="/terms" className="font-semibold text-lav underline underline-offset-4">Terms</Link> cover everything else.
        </p>
      }
    >
      <h2>First payment</h2>
      <p>You can ask for a full refund within 7 days of your first payment.</p>

      <h2>Renewals</h2>
      <p>
        After that, payments aren&apos;t refunded, and we don&apos;t refund part of a month. You can cancel anytime, and your plan
        stays active until the end of the period you paid for.
      </p>

      <h2>How to ask</h2>
      <p>
        Paddle.com handles our orders, so you can ask through the link in your receipt, or write to{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> from the address on your account. Refunds go back to the way you
        paid.
      </p>

      <h2>Your legal rights</h2>
      <p>Nothing here limits any refund or cancellation right the law gives you where you live.</p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> · Shubham Varshney, India.
      </p>
    </LegalPage>
  );
}
