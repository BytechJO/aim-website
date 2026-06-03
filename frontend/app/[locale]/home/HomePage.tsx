import ContactSection from "./ContactSection";
import Hero from "./hero";
import InstagramSection from "./InstagramSection";
import NewsSection from "./NewsSection";
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
      <NewsSection />
      <InstagramSection />
      <ContactSection />
    </>
  );
}
