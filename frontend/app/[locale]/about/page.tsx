import AttentionToDetailSection from "./AttentionToDetailSection";
import InnovativeTechnologiesSection from "./InnovativeTechnologiesSection";
import StandardsList from "./StandardsList";
import StandardsSection from "./StandardsSection";

export default function AboutPage() {
  return (
    <>
      <StandardsSection />
      <StandardsList />
      <AttentionToDetailSection />
      <InnovativeTechnologiesSection />
    </>
  );
}
