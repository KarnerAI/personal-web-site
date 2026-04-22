import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { EditModeProvider } from "@/components/edit-mode/EditModeContext";
import { EditModeToggle } from "@/components/edit-mode/EditModeToggle";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hussain Alam — Product Strategist & Builder",
  description:
    "12+ years across Fortune 100 growth and early-stage startups. Based in NYC.",
};

// Edit mode is gated behind an env check so the pencil toggle never ships to the
// public site. It renders in `next dev` automatically, and in any preview
// deployment where NEXT_PUBLIC_EDIT_MODE=1 is set. In production builds without
// that flag, EditModeToggle is tree-shaken out of the client bundle entirely —
// the import is still there for type safety, but the branch is dead code.
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
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
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
