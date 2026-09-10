import type { Metadata } from "next";
import { Fraunces, Prompt } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const prompt = Prompt({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
});

export const metadata: Metadata = {
  title: "GlobePass: Global Visa & Travel Intelligence",
  description: "Worldwide visa entry requirements, automated consular document checklists, and step-by-step application roadmaps.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={`${fraunces.variable} ${prompt.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans bg-[#FCF9EA] text-[#1A2229]"
      >
        {children}
      </body>
    </html>
  );
}
