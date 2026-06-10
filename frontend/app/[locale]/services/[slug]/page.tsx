import ContactSection from "./ContactSection";
import ExamplesSection from "./ExamplesSection";
import FAQSection from "./FAQSection";
import FindOutMoreSection from "./FindOutMoreSection";
import OptionsSection from "./OptionsSection";
import ProductDetails from "./ProductDetails";
import PublishingBanner from "./PublishingBanner";
import RelatedProductsSection from "./RelatedProductsSection";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await params;
  const { slug } = await params;

  const res = await fetch(`http://localhost:3000/api/products/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Product not found");
  }

  const data = await res.json();
  const product = {
    title: {
      en: data.title_en,
      ar: data.title_ar,
    },

    cardImage: data.image_url,

    subtitle: {
      en: data.subtitle_en || "",
      ar: data.subtitle_ar || "",
    },

    description: {
      en: data.description_en,
      ar: data.description_ar,
    },

    bestUse: {
      en: data.best_use_en,
      ar: data.best_use_ar,
    },

    model3d: data.model_3d,

    findOutMoreImages: data.find_out_more_images || [],

    ecofriendly: {
      en: data.eco_friendly_en,
      ar: data.eco_friendly_ar,
    },

    options: {
      format: {
        min: {
          en: data.format_min_en,
          ar: data.format_min_ar,
        },
        max: {
          en: data.format_max_en,
          ar: data.format_max_ar,
        },
      },

      thickness: {
        min: {
          en: data.thickness_min_en,
          ar: data.thickness_min_ar,
        },
        max: {
          en: data.thickness_max_en,
          ar: data.thickness_max_ar,
        },
      },

      materials: {
        en: data.materials_en,
        ar: data.materials_ar,
      },

      extras: {
        en: data.extras_en,
        ar: data.extras_ar,
      },

      enhancements: {
        en: data.enhancements_en,
        ar: data.enhancements_ar,
      },
    },

    exampleImages: data.example_images || [],
  };
  return (
    <>
      <ProductDetails {...product} />
      <div className="md:max-w-7xl mx-auto px-6">
        <FindOutMoreSection
          images={product.findOutMoreImages}
          description={product.ecofriendly}
        />
        <OptionsSection options={product.options} />
      </div>
      <ExamplesSection images={product.exampleImages} />
      <PublishingBanner />
      <FAQSection />
      <RelatedProductsSection />
      <ContactSection />
    </>
  );
}
