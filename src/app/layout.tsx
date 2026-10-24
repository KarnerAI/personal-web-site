import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { EditModeProvider } from "@/components/edit-mode/EditModeContext";
import { EditModeToggle } from "@/components/edit-mode/EditModeToggle";

// Theme B type (DESIGN.md): Geist for everything, Geist Mono for labels,
// stats and data. Both are variable fonts, so no weight list is needed.
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hussain Alam | Operator turned PM",
  description:
    "13+ years across Fortune 500 growth and early-stage startups. Based in NYC.",
};

// Edit mode is gated behind an env check so the pencil toggle never renders on
// the public site. It appears in `next dev` automatically, and in any preview
// deployment where NEXT_PUBLIC_EDIT_MODE=1 is set. Note: the import stays
// unconditional, so EditModeToggle's code still ships in the client bundle in
// production — only the render is gated. If we ever want to strip it from the
// bundle entirely, switch to `next/dynamic` with `ssr: false` behind the flag.
const EDIT_MODE_ENABLED =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_EDIT_MODE === "1";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <EditModeProvider>
          {EDIT_MODE_ENABLED && <EditModeToggle />}
          {children}
        </EditModeProvider>
      </body>
    </html>
  );
}
