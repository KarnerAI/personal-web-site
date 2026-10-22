import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Bridge } from "@/components/sections/Bridge";
import { CareerTimeline } from "@/components/sections/CareerTimeline";
import { Entrepreneurship } from "@/components/sections/Entrepreneurship";
import { BeyondWork } from "@/components/sections/BeyondWork";
import { Education } from "@/components/sections/Education";

// Single scrollable page — order matches PRD §6.
export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Theme B intro: hero + Einstein bridge share the faint grid. */}
        <div className="intro-band">
          <Hero />
          <Bridge />
        </div>
        <CareerTimeline />
        <Entrepreneurship />
        <BeyondWork />
        <Education />
      </main>
      <Footer />
    </>
  );
}
