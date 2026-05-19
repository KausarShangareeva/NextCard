import HeroSection from "@/components/hero-section/HeroSection";
import WhoWeWorkWith from "@/components/who-we-work-with/WhoWeWorkWith";
import WhoWeAre from "@/components/who-we-are/WhoWeAre";
import ContactUs from "@/components/contact-us/ContactUs";

export default function Home() {
  return (
    <>
      <HeroSection />
      <WhoWeAre />
      <WhoWeWorkWith />
      <ContactUs />
    </>
  );
}
