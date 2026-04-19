import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
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
        <Hero />
        <CareerTimeline />
        <Entrepreneurship />
        <BeyondWork />
        <Education />
      </main>
      <Footer />
    </>
  );
}
