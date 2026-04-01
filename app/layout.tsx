import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adaptyv Bio — API for AI Agents & Automated Protein Engineering",
  description:
    "Let your AI agents run real protein experiments. Submit sequences via API, screen binders with BLI/SPR, and get kinetic data back — fully programmatic, no manual steps.",
  openGraph: {
    title: "Adaptyv Bio — API for AI Agents & Automated Protein Engineering",
    description:
      "Let your AI agents run real protein experiments. Submit sequences via API, screen binders with BLI/SPR, and get kinetic data back — fully programmatic, no manual steps.",
    siteName: "Adaptyv Bio",
    url: "https://agents.adaptyvbio.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adaptyv Bio — API for AI Agents & Automated Protein Engineering",
    description:
      "Let your AI agents run real protein experiments. Submit sequences, get binding data back. Fully programmatic.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
