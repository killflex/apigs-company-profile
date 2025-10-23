import HeroSection from "@/components/hero-section";
import LogoCloud from "@/components/logo-cloud";
import Features from "@/components/features-12";
import StatsSection from "@/components/stats";
import TeamSection from "@/components/team";
import Testimonials from "@/components/testimonials";
import CallToAction from "@/components/call-to-action";
import FooterSection from "@/components/footer";
import HeroHeader from "@/components/hero5-header";

export default function Home() {
  return (
    <>
      <HeroHeader />
      <HeroSection />
      <LogoCloud />
      <Features />
      <StatsSection />
      <TeamSection />
      <Testimonials />
      <CallToAction />
      <FooterSection />
    </>
  );
}
