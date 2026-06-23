import { ENDPOINTS } from "@/app/api/endpoints";
import { notFound } from "next/navigation";
import DynamicSectionRenderer from "./DynamicSectionRenderer";

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export type CMSSection = {
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

  created_at?: string;
  updated_at?: string;
};

type CMSPage = {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  meta_title_en: string | null;
  meta_title_ar: string | null;
  meta_description_en: string | null;
  meta_description_ar: string | null;
  is_published: boolean;
  sections: CMSSection[];
};

async function getCMSPage(slug: string): Promise<CMSPage | null> {
  try {
    const response = await fetch(ENDPOINTS.PAGE(slug), {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Load CMS page error:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const page = await getCMSPage(slug);

  if (!page) {
    return {
      title: "Page not found",
    };
  }

  const isArabic = locale === "ar";

  return {
    title: isArabic
      ? page.meta_title_ar || page.title_ar
      : page.meta_title_en || page.title_en,
    description: isArabic
      ? page.meta_description_ar || ""
      : page.meta_description_en || "",
  };
}

export default async function DynamicCMSPage({ params }: Props) {
  const { locale, slug } = await params;

  const page = await getCMSPage(slug);

  if (!page || !page.is_published) {
    notFound();
  }

  const isArabic = locale === "ar";

  return (
    <main>
      {page.sections?.length > 0 ? (
        page.sections.map((section) => (
          <DynamicSectionRenderer
            key={section.id}
            section={section}
            isArabic={isArabic}
          />
        ))
      ) : (
        <section className="px-6 py-24">
          <div className="mx-auto max-w-5xl rounded-3xl border border-dashed border-gray-300 p-10 text-center">
            <h1 className="text-3xl font-semibold">
              {isArabic ? page.title_ar : page.title_en}
            </h1>
            <p className="mt-4 text-gray-500">
              {isArabic
                ? "لا يوجد سكشنات لهذه الصفحة بعد."
                : "No sections added to this page yet."}
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
