import Hero from "./hero";
import ProductsSection from "./ProductsSection";
import ReviewsSection from "./ReviewsSection";
import SpecialSection from "./SpecialSection";
import StorySection from "./StorySection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductsSection />
      <StorySection />
      <ReviewsSection />
      <SpecialSection />
    </>
  );
}
