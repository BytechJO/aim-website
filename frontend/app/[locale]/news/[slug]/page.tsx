import { ENDPOINTS } from "@/app/api/endpoints";
import NewsHero from "./NewsHero";
import NewsSections from "./NewsSections";
import NotFound from "./not-found";
import Image from "next/image";
import Link from "next/link";

type NewsItem = {
  id: string;
  slug: string;
  hero_image: string;
  title_ar: string;
  title_en: string;
  thumbnail_image?: string;
};

export default async function NewsPage({
  params,
}: {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}) {
  const { locale, slug } = await params;

  const isArabic = locale === "ar";

  const res = await fetch(ENDPOINTS.NEWS_ITEM(slug), {
    cache: "no-store",
  });

  if (!res.ok) {
    return <NotFound />;
  }

  const article = await res.json();

  if (!article || article.error) {
    return <NotFound />;
  }

  const relatedRes = await fetch(ENDPOINTS.NEWS, {
    cache: "no-store",
  });

  const allNews = relatedRes.ok
    ? ((await relatedRes.json()) as NewsItem[])
    : [];
  console.log("relatedRes", allNews);

  const relatedNews = allNews
    .filter((item: NewsItem) => item.slug !== slug)
    .slice(0, 3);

  return (
    <div className="max-w-362.5 mx-auto flex relative">
      <div
        className={`absolute top-0 bottom-0 w-screen bg-[#F3F3F3] ${
          isArabic ? "left-full" : "right-full"
        }`}
      />

      <aside className="hidden lg:block w-100 shrink-0 bg-[#F3F3F3] relative z-10">
        <div className="sticky top-18 p-8">
          <h3 className="text-2xl mb-8">
            {isArabic ? "اقرأ أيضاً" : "Read more"}
          </h3>

          <div className="space-y-8">
            {relatedNews.map((item: NewsItem) => (
              <Link
                key={item.id}
                href={`/${locale}/news/${item.slug}`}
                className="flex gap-4 group"
              >
                <Image
                  src={item.thumbnail_image || item.hero_image}
                  alt={isArabic ? item.title_ar : item.title_en}
                  width={80}
                  height={80}
                  className="w-30 h-15 object-cover rounded-lg shrink-0"
                />

                <div>
                  <div className="text-xs border border-[#F68E56] rounded-full px-3 py-1 inline-block mb-2">
                    News
                  </div>

                  <h4 className="leading-6 group-hover:text-[#285FE7] transition">
                    {isArabic ? item.title_ar : item.title_en}
                  </h4>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16">
            <h3 className="text-2xl mb-5">
              {isArabic ? "شارك الخبر" : "Share the article"}
            </h3>

            <div className="flex items-center gap-6 mt-4">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  `https://your-domain.com/${locale}/news/${slug}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-black hover:text-[#285FE7] transition"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  `https://your-domain.com/${locale}/news/${slug}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-black hover:text-[#285FE7] transition"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </aside>
      {/* Content */}
      <main className="flex-1">
        <NewsHero
          title_en={article.title_en}
          title_ar={article.title_ar}
          description_en={article.description_en}
          description_ar={article.description_ar}
          hero_image={article.hero_image}
          title_color={article.title_color}
        />

        <NewsSections sections={article.sections || []} />
      </main>
    </div>
  );
}
