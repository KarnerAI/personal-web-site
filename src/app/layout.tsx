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
          <EditModeToggle />
          {children}
        </EditModeProvider>
      </body>
    </html>
  );
}
