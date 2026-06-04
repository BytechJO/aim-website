import BenefitsSection from "./BenefitsSection";
import ContactSection from "./ContactSection";
import FAQSection from "./FAQSection";
import HeroSelfPublishing from "./HeroSelfPublishing";
import StepsSection from "./StepsSection";

export default function SelfPublishingPage() {
  return (
    <>
      <HeroSelfPublishing />
      <BenefitsSection />
      <StepsSection />
      <FAQSection />
      <ContactSection/>
    </>
  );
}
