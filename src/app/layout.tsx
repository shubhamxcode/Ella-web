import type { Metadata, Viewport } from "next";
import { Anton, Barlow_Condensed, Figtree, JetBrains_Mono, Kalam } from "next/font/google";
import "./globals.css";

const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin"] });
const barlow = Barlow_Condensed({ variable: "--font-barlow", weight: ["600", "700"], subsets: ["latin"] });
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", weight: ["500", "700"], subsets: ["latin"] });
// Handwritten asides, and the only face here that also writes Devanagari.
const kalam = Kalam({ variable: "--font-kalam", weight: ["400", "700"], subsets: ["latin", "devanagari"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://heymaya.tech"),
  title: "Maya: talk to your Mac. It talks back.",
  description:
    "Maya is a voice assistant for your Mac. Hold two keys and talk: she sees your screen, reads your Gmail, opens apps and runs the browser, and answers out loud in English or Hindi. Join the waitlist.",
  openGraph: {
    title: "Maya: talk to your Mac. It talks back.",
    description: "A voice assistant that lives in your Mac's menu bar. Coming soon to Mac.",
    url: "https://heymaya.tech",
    siteName: "Maya",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#100f24",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${barlow.variable} ${figtree.variable} ${jetbrains.variable} ${kalam.variable} antialiased`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
