import Link from "next/link";
import Image from "next/image";

type CMSSection = {
  id: number;
  page_id: number;
  section_type: string;

  title_en: string | null;
  title_ar: string | null;

  subtitle_en: string | null;
  subtitle_ar: string | null;

  description_en: string | null;
  description_ar: string | null;

  image_url: string | null;

  cta_label_en: string | null;
  cta_label_ar: string | null;
  cta_url: string | null;

  content: Record<string, any>;
  styles: Record<string, any>;

  sort_order: number;
  is_active: boolean;
};

type Props = {
  section: CMSSection;
  isArabic: boolean;
};

function getText(en: string | null, ar: string | null, isArabic: boolean) {
  return isArabic ? ar || en || "" : en || ar || "";
}

export default function DynamicSectionRenderer({ section, isArabic }: Props) {
  if (!section.is_active) return null;

  switch (section.section_type) {
    case "hero":
      return <HeroSection section={section} isArabic={isArabic} />;

    case "text_image":
      return <TextImageSection section={section} isArabic={isArabic} />;

    case "cards":
      return <CardsSection section={section} isArabic={isArabic} />;

    case "cta":
      return <CTASection section={section} isArabic={isArabic} />;

    default:
      return (
        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl rounded-2xl border border-dashed border-gray-300 p-8 text-sm text-gray-500">
            Unknown section type: {section.section_type}
          </div>
        </section>
      );
  }
}

function HeroSection({ section, isArabic }: Props) {
  const styles = section.styles || {};

  const title = getText(section.title_en, section.title_ar, isArabic);
  const subtitle = getText(section.subtitle_en, section.subtitle_ar, isArabic);
  const description = getText(
    section.description_en,
    section.description_ar,
    isArabic,
  );
  const ctaLabel = getText(
    section.cta_label_en,
    section.cta_label_ar,
    isArabic,
  );

  const layout = styles.layout || "image_right";
  const imageFirst = layout === "image_left";

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      style={{
        backgroundColor: styles.background_color || "#ffffff",
        color: styles.text_color || "#111111",
        paddingTop: styles.padding_top || "100px",
        paddingBottom: styles.padding_bottom || "100px",
      }}
      className="px-6"
    >
      <div
        className={`mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 ${
          imageFirst ? "" : "md:[&>*:first-child]:order-1"
        }`}
      >
        {section.image_url && (
          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] bg-gray-100">
            <Image
              src={section.image_url}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div>
          {subtitle && (
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] opacity-70">
              {subtitle}
            </p>
          )}

          {title && (
            <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
              {title}
            </h1>
          )}

          {description && (
            <p className="mt-6 max-w-xl text-base leading-8 opacity-75">
              {description}
            </p>
          )}

          {ctaLabel && section.cta_url && (
            <Link
              href={section.cta_url}
              className="mt-8 inline-flex rounded-full bg-black px-7 py-3 text-sm font-medium text-white"
            >
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function TextImageSection({ section, isArabic }: Props) {
  const styles = section.styles || {};

  const title = getText(section.title_en, section.title_ar, isArabic);
  const description = getText(
    section.description_en,
    section.description_ar,
    isArabic,
  );

  const layout = styles.layout || "image_left";
  const imageFirst = layout === "image_left";

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      style={{
        backgroundColor: styles.background_color || "#ffffff",
        color: styles.text_color || "#111111",
        paddingTop: styles.padding_top || "80px",
        paddingBottom: styles.padding_bottom || "80px",
      }}
      className="px-6"
    >
      <div
        className={`mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 ${
          imageFirst ? "" : "md:[&>*:first-child]:order-1"
        }`}
      >
        {section.image_url && (
          <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] bg-gray-100">
            <Image
              src={section.image_url}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div>
          {title && (
            <h2 className="text-3xl font-semibold leading-tight md:text-5xl">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-6 text-base leading-8 opacity-75">{description}</p>
          )}
        </div>
      </div>
    </section>
  );
}

function CardsSection({ section, isArabic }: Props) {
  const styles = section.styles || {};
  const cards = Array.isArray(section.content?.cards)
    ? section.content.cards
    : [];

  const title = getText(section.title_en, section.title_ar, isArabic);

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      style={{
        backgroundColor: styles.background_color || "#fafafa",
        color: styles.text_color || "#111111",
        paddingTop: styles.padding_top || "80px",
        paddingBottom: styles.padding_bottom || "80px",
      }}
      className="px-6"
    >
      <div className="mx-auto max-w-7xl">
        {title && (
          <h2 className="mb-10 text-3xl font-semibold md:text-5xl">{title}</h2>
        )}

        <div className="grid gap-5 md:grid-cols-3">
          {cards.map((card: any, index: number) => (
            <div
              key={index}
              className="rounded-[2rem] border border-gray-200 bg-white p-7"
            >
              <h3 className="text-xl font-semibold">
                {getText(card.title_en, card.title_ar, isArabic)}
              </h3>

              <p className="mt-4 leading-7 text-gray-500">
                {getText(card.description_en, card.description_ar, isArabic)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ section, isArabic }: Props) {
  const styles = section.styles || {};

  const title = getText(section.title_en, section.title_ar, isArabic);
  const description = getText(
    section.description_en,
    section.description_ar,
    isArabic,
  );
  const ctaLabel = getText(
    section.cta_label_en,
    section.cta_label_ar,
    isArabic,
  );

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      style={{
        backgroundColor: styles.background_color || "#111111",
        color: styles.text_color || "#ffffff",
        paddingTop: styles.padding_top || "80px",
        paddingBottom: styles.padding_bottom || "80px",
      }}
      className="px-6"
    >
      <div className="mx-auto max-w-5xl text-center">
        {title && (
          <h2 className="text-3xl font-semibold md:text-5xl">{title}</h2>
        )}

        {description && (
          <p className="mx-auto mt-5 max-w-2xl leading-8 opacity-75">
            {description}
          </p>
        )}

        {ctaLabel && section.cta_url && (
          <Link
            href={section.cta_url}
            className="mt-8 inline-flex rounded-full bg-white px-7 py-3 text-sm font-medium text-black"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
