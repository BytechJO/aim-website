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

  const product = {
    title: {
      en: "Hardcover",
      ar: "غلاف مقوى",
    },
    cardImage: "/products/hardcover-card.webp",
    subtitle: {
      en: "thread sewn",
      ar: "مخيط بالخيط",
    },

    description: {
      en: `Extremely durable, robust and the most processed form of binding, guaranteed to last for many years of use. The pages (folded sheets) are bound with threads and the book block is protected by a hard board case covered with hard-wearing material. Optionally, foam can be used in the case to make the cover soft to touch.

It is perfect for high-class, sophisticated publications, especially art and photo albums, premium planners, and any books inspired by old prints and manuscripts, such as reprints and facsimiles.`,

      ar: `يُعد هذا النوع من التجليد من أكثر أنواع التجليد متانةً وقوةً وتطورًا، وهو مصمم ليدوم لسنوات طويلة من الاستخدام. تُخاط الصفحات (الملازم المطوية) بالخيط، بينما تُحمى كتلة الكتاب بغلاف صلب مصنوع من ألواح مقواة ومغطى بمواد عالية التحمل. ويمكن إضافة طبقة إسفنجية داخل الغلاف لمنحه ملمسًا ناعمًا وفاخرًا.

يُعد خيارًا مثاليًا للمنشورات الراقية والفاخرة، وخاصة الكتب الفنية وألبومات الصور والمخططات المميزة، بالإضافة إلى الكتب المستوحاة من المطبوعات والمخطوطات القديمة مثل النسخ المطابقة للأصل وإعادة الطباعة.`,
    },

    bestUse: {
      en: "fiction, poetry, albums, textbooks, calendars and planners, scientific and professional publications, collector’s publications",

      ar: "الروايات، الشعر، الألبومات، الكتب الدراسية، التقويمات والمخططات، المنشورات العلمية والمهنية، والإصدارات المخصصة لهواة الاقتناء",
    },
    model3d: "/models/Book (Blue).glb",
    findOutMoreImages: [
      "/services/1.svg",
      "/services/2.svg",
      "/services/1.svg",
      "/services/2.svg",
      "/services/1.svg",
      "/services/2.svg",
    ],
    ecofriendly: {
      ar: "إن استخدام المواد المناسبة مثل الورق المعاد تدويره ومواد الأغلفة غير المطلية، بالإضافة إلى المكونات الطبيعية مثل خيوط القطن أو القنب، يجعل الكتاب قابلاً للتحلل الحيوي بالكامل.",
      en: "The use of appropriate materials (e.g. wastepaper, non-coated cover materials) and natural components (e.g. cotton or hemp threads) makes the book completely biodegradable.",
    },
    options: {
      format: {
        min: {
          ar: "100 × 100 مم",
          en: "100 × 100 mm",
        },
        max: {
          ar: "270 × 380 مم (عمودي) / 275 × 210 مم (أفقي)",
          en: "270 × 380 mm (portrait) / 275 × 210 mm (album)",
        },
      },

      thickness: {
        min: {
          ar: "4 مم",
          en: "4 mm",
        },
        max: {
          ar: "65 مم",
          en: "65 mm",
        },
      },

      materials: {
        ar: "تتوفر أنواع مختلفة من الورق بما في ذلك الورق المحبب والقماش والفلين والجلد الصناعي.",
        en: "Various types of paper are available, including textured paper, cloth, cork and eco-leather.",
      },

      extras: {
        ar: "يمكننا استخدام ألوان خيوط مختلفة للأوراق، وأوراق داخلية مطبوعة أو مصبوغة بالكامل، وعمود فقري مستقيم أو منحني (بسماكة تصل إلى 13 مم). وبحسب الاستخدام المقصود لمنشورك، يمكننا إضافة، على سبيل المثال، شريط إغلاق أو حامل أقلام (مثالي للمخططات والمنظمات والدفاتر)، وفواصل كتب ملونة، وواقيات زوايا. أما بالنسبة للألبومات والكتب الأدبية، فنوصي بأغلفة واقية من الغبار وأشرطة تثبيت.",
        en: "We can use different thread colours for the sheets, printed or mass-dyed end papers, and straight or rounded spine (up to 13 mm thickness). Depending on the intended use of your publication, we can add, for example, a band closure or a pen holder (ideal for planners, organizers and notebooks), bound bookmarks in various colours, and corner protectors. For albums and belles lettres, we recommend dust wrappers and wraparound bands. ",
      },

      enhancements: {
        ar: "يمكن تحسين مظهر الكتاب ذي الغلاف المقوى من خلال تحسينات الغلاف. في حالة الكتب ذات الأغلفة المقواة، نوصي تحديدًا بالختم الساخن باستخدام رقائق معدنية، والنقش البارز، والتلميع الموضعي. بالإضافة إلى ذلك، لحماية الغلاف وإطالة عمره، نوصي بالتغليف.",
        en: "The appeal of a book in a hard case can be improved by cover enhancements. In the case of hardcovers, we particularly recommend hot stamping with metallized foil, debossing and spot varnishing. Additionally, to protect the cover and extend its durability, we recommend lamination. ",
      },
    },
    exampleImages: [
      "/services/examples/1.webp",
      "/services/examples/2.webp",
      "/services/examples/3.webp",
      "/services/examples/1.webp",
      "/services/examples/2.webp",
      "/services/examples/3.webp",
      "/services/examples/1.webp",
      "/services/examples/2.webp",
      "/services/examples/3.webp",
    ],
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
