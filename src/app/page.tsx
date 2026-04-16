import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { CareerTimeline } from "@/components/sections/CareerTimeline";
import { Entrepreneurship } from "@/components/sections/Entrepreneurship";
import { SideProjects } from "@/components/sections/SideProjects";
import { BeyondWork } from "@/components/sections/BeyondWork";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";

// Single scrollable page — order matches PRD §6.
export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <CareerTimeline />
        <Entrepreneurship />
        <SideProjects />
        <BeyondWork />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
