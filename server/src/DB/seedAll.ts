import dotenv from 'dotenv';
dotenv.config();
import { pool } from '../config/db';

const PH = (w: number, h: number, bg: string, fg: string, text: string) =>
  `https://placehold.co/${w}x${h}/${bg.replace('#', '')}/${fg.replace('#', '')}?text=${encodeURIComponent(text)}`;

async function seed() {
  console.log('🌱  Seeding AIM database…\n');

  // ─────────────────────────────────────────
  //  SERVICE CATEGORIES
  // ─────────────────────────────────────────
  const { rows: cats } = await pool.query(`
    INSERT INTO service_categories (name_en, name_ar, sort_order) VALUES
      ('Books & Publications',  'الكتب والمطبوعات',   1),
      ('Thesis & Academic',     'الرسائل الأكاديمية', 2),
      ('Corporate & Business',  'الأعمال التجارية',   3),
      ('Art & Photography',     'الفن والتصوير',       4)
    RETURNING id, name_en
  `);
  const catMap: Record<string, number> = {};
  cats.forEach(c => { catMap[c.name_en] = c.id; });
  console.log('✓  service_categories:', cats.length);

  // ─────────────────────────────────────────
  //  PRODUCTS  (6 products, bilingual)
  // ─────────────────────────────────────────
  type Product = {
    category_id: number; slug: string;
    title_en: string; title_ar: string;
    subtitle_en: string; subtitle_ar: string;
    description_en: string; description_ar: string;
    best_use_en: string; best_use_ar: string;
    eco_friendly_en: string; eco_friendly_ar: string;
    model_3d: string | null;
    image_url: string; swatch_color: string; sort_order: number;
    format_min_en: string; format_min_ar: string;
    format_max_en: string; format_max_ar: string;
    thickness_min_en: string; thickness_min_ar: string;
    thickness_max_en: string; thickness_max_ar: string;
    materials_en: string; materials_ar: string;
    extras_en: string; extras_ar: string;
    enhancements_en: string; enhancements_ar: string;
    find_out_more_images: string[]; example_images: string[];
  };

  const products: Product[] = [
    {
      category_id: catMap['Books & Publications'],
      slug: 'hardcover-thread-sewn',
      title_en: 'Hardcover Thread-Sewn',
      title_ar: 'غلاف صلب مخيط',
      subtitle_en: 'The gold standard in book binding',
      subtitle_ar: 'المعيار الذهبي في تجليد الكتب',
      description_en: 'Our premium thread-sewn hardcover is crafted for books that are meant to last a lifetime. Signatures are individually sewn together before being cased into a rigid cover, giving the book a flat-open spine and unmatched durability.',
      description_ar: 'غلافنا الصلب المخيط مصمم للكتب التي تعمر طويلاً. تُخاط الكراسات بشكل فردي قبل تثبيتها في الغلاف الصلب، مما يمنح الكتاب فتحة مسطحة وصلابة لا مثيل لها.',
      best_use_en: 'Novels, coffee-table books, academic publications, premium gift books, and any volume you want to preserve for decades.',
      best_use_ar: 'الروايات والكتب الفاخرة والمنشورات الأكاديمية وكتب الهدايا المميزة وأي مطبوع تريد حفظه لعقود.',
      eco_friendly_en: 'FSC-certified papers available. Water-based adhesives and vegetable-based inks on request.',
      eco_friendly_ar: 'تتوفر أوراق بشهادة FSC. غراء مائي وأحبار نباتية عند الطلب.',
      model_3d: null,
      image_url: PH(480, 580, '#7C1C2E', 'FFFFFF', 'Hardcover\nThread-Sewn'),
      swatch_color: '#7C1C2E',
      sort_order: 1,
      format_min_en: '105 × 148 mm (A6)',
      format_min_ar: '105 × 148 ملم (A6)',
      format_max_en: '297 × 420 mm (A3)',
      format_max_ar: '297 × 420 ملم (A3)',
      thickness_min_en: '96 pages',
      thickness_min_ar: '96 صفحة',
      thickness_max_en: '1200 pages',
      thickness_max_ar: '1200 صفحة',
      materials_en: 'Wibalin, Brillianta, Iris cloth, Leather, Buckram, Japanese linen',
      materials_ar: 'ويبالين، بريليانتا، قماش إيريس، جلد، بكرام، كتان ياباني',
      extras_en: 'Ribbon bookmark, head & tail bands, embossed spine, slipcase, box set packaging',
      extras_ar: 'مرجع ريبون، رأس وذيل، ظهر مضغوط، غلاف واقٍ، تغليف صندوق',
      enhancements_en: 'Foil stamping (gold, silver, custom), debossing, spot UV, full-color printed cover wrap',
      enhancements_ar: 'طباعة بالرقاقة (ذهبي، فضي، مخصص)، حفر، UV بقعي، غلاف ملفوف ملون',
      find_out_more_images: [
        PH(600, 400, 'F8E586', '231F20', 'Thread Sewn\nDetail'),
        PH(600, 400, 'EE8461', 'FFFFFF', 'Flat Open\nSpine'),
        PH(600, 400, '1A3A6E', 'FFFFFF', 'Materials\nSwatch'),
        PH(600, 400, '3D5A3E', 'FFFFFF', 'Foil\nStamping'),
      ],
      example_images: [
        PH(400, 500, '7C1C2E', 'FFFFFF', 'Novel\nExample'),
        PH(400, 500, '1A3A6E', 'FFFFFF', 'Academic\nExample'),
        PH(400, 500, '0A0A0A', 'FFFFFF', 'Coffee\nTable'),
      ],
    },
    {
      category_id: catMap['Books & Publications'],
      slug: 'hardcover-perfect-bound',
      title_en: 'Hardcover Perfect Bound',
      title_ar: 'غلاف صلب لاصق',
      subtitle_en: 'Rigid cover, clean adhesive binding',
      subtitle_ar: 'غلاف صلب مع تجليد لاصق أنيق',
      description_en: 'A hardcover with a PUR or EVA adhesive spine. More economical than thread-sewn while still delivering a professional rigid cover. Ideal for mid-to-high volume runs where budget meets quality.',
      description_ar: 'غلاف صلب بظهر لاصق PUR أو EVA. أكثر اقتصادية من الخياطة مع الحفاظ على مظهر احترافي. مثالي للإصدارات متوسطة وعالية الكميات.',
      best_use_en: 'Corporate reports, branded yearbooks, product catalogues, mid-range gift publications.',
      best_use_ar: 'التقارير المؤسسية والسجلات السنوية وكتالوجات المنتجات والمطبوعات الترويجية.',
      eco_friendly_en: 'PUR binding uses recyclable glue with minimal VOC emissions.',
      eco_friendly_ar: 'يستخدم التجليد PUR غراءً قابلاً لإعادة التدوير مع انبعاثات VOC منخفضة.',
      model_3d: null,
      image_url: PH(480, 580, '#1A3A6E', 'FFFFFF', 'Hardcover\nPerfect Bound'),
      swatch_color: '#1A3A6E',
      sort_order: 2,
      format_min_en: '105 × 148 mm (A6)',
      format_min_ar: '105 × 148 ملم (A6)',
      format_max_en: '297 × 420 mm (A3)',
      format_max_ar: '297 × 420 ملم (A3)',
      thickness_min_en: '64 pages',
      thickness_min_ar: '64 صفحة',
      thickness_max_en: '800 pages',
      thickness_max_ar: '800 صفحة',
      materials_en: 'Wibalin, Brillianta, Printed laminated cover wrap, Buckram',
      materials_ar: 'ويبالين، بريليانتا، غلاف ملفوف مطبوع مرقق، بكرام',
      extras_en: 'Ribbon bookmark, foil cover, embossed logo, slipcase',
      extras_ar: 'مرجع ريبون، غلاف بالرقاقة، شعار مضغوط، غلاف واقٍ',
      enhancements_en: 'Gloss or matte lamination, foil stamping, spot UV varnish',
      enhancements_ar: 'تغليف لامع أو مطفي، طباعة بالرقاقة، ورنيش UV بقعي',
      find_out_more_images: [
        PH(600, 400, '1A3A6E', 'FFFFFF', 'PUR Spine\nDetail'),
        PH(600, 400, 'F8E586', '231F20', 'Cover\nOptions'),
      ],
      example_images: [
        PH(400, 500, '1A3A6E', 'FFFFFF', 'Corporate\nReport'),
        PH(400, 500, '285FE7', 'FFFFFF', 'Catalogue\nExample'),
      ],
    },
    {
      category_id: catMap['Books & Publications'],
      slug: 'softcover-paperback',
      title_en: 'Softcover Paperback',
      title_ar: 'غلاف ورقي',
      subtitle_en: 'Light, flexible, and cost-effective',
      subtitle_ar: 'خفيف ومرن وفعّال من حيث التكلفة',
      description_en: 'Perfect-bound or saddle-stitched softcover books on a wide range of paper stocks. The go-to choice for novels, workbooks, and quick-turnaround publications.',
      description_ar: 'كتب بغلاف ورقي لاصق أو مخيط بالتدبيس على طيف واسع من أنواع الورق. الخيار الأمثل للروايات والكتب التعليمية والمطبوعات السريعة.',
      best_use_en: 'Novels, textbooks, workbooks, poetry collections, event programmes.',
      best_use_ar: 'الروايات والكتب المدرسية والكتب التدريبية ودواوين الشعر وبرامج الفعاليات.',
      eco_friendly_en: 'Recycled paper stocks available. FSC-certified options on all sizes.',
      eco_friendly_ar: 'أوراق معاد تدويرها متاحة. خيارات معتمدة FSC لجميع الأحجام.',
      model_3d: null,
      image_url: PH(480, 580, '#3D5A3E', 'FFFFFF', 'Softcover\nPaperback'),
      swatch_color: '#3D5A3E',
      sort_order: 3,
      format_min_en: '105 × 148 mm (A6)',
      format_min_ar: '105 × 148 ملم (A6)',
      format_max_en: '210 × 297 mm (A4)',
      format_max_ar: '210 × 297 ملم (A4)',
      thickness_min_en: '32 pages',
      thickness_min_ar: '32 صفحة',
      thickness_max_en: '600 pages',
      thickness_max_ar: '600 صفحة',
      materials_en: 'Gloss art, Matte art, Natural uncoated, Recycled offset',
      materials_ar: 'ورق فني لامع، ورق فني مطفي، ورق طبيعي غير مطلي، أوفست معاد تدويره',
      extras_en: 'Full-color or monotone interior, flaps, French folds',
      extras_ar: 'داخل ملون أو أحادي اللون، أجنحة، طيات فرنسية',
      enhancements_en: 'Gloss lamination, matte lamination, soft-touch lamination, spot UV',
      enhancements_ar: 'تغليف لامع، تغليف مطفي، تغليف ناعم، UV بقعي',
      find_out_more_images: [
        PH(600, 400, '3D5A3E', 'FFFFFF', 'Paper\nStocks'),
        PH(600, 400, 'F8E586', '231F20', 'Saddle\nStitch'),
      ],
      example_images: [
        PH(400, 500, '3D5A3E', 'FFFFFF', 'Novel\nPaperback'),
        PH(400, 500, 'EE8461', 'FFFFFF', 'Workbook\nExample'),
      ],
    },
    {
      category_id: catMap['Art & Photography'],
      slug: 'coffee-table-book',
      title_en: 'Coffee Table Book',
      title_ar: 'كتاب طاولة القهوة',
      subtitle_en: 'Large-format luxury printing for visual stories',
      subtitle_ar: 'طباعة فاخرة كبيرة الحجم للقصص المرئية',
      description_en: 'Showcase your art, photography, or brand identity in a large-format luxury book. Printed on heavyweight fine-art paper with immaculate color reproduction, sewn and cased in premium materials.',
      description_ar: 'اعرض فنك أو تصويرك أو هويتك البصرية في كتاب فاخر كبير الحجم. طباعة على ورق فني ثقيل مع دقة ألوان لا تضاهى، مخيط ومجلد بمواد فاخرة.',
      best_use_en: 'Photography portfolios, architectural monographs, brand books, art collections, wedding albums.',
      best_use_ar: 'ملفات التصوير والمونوغرافات المعمارية وكتب الهوية التجارية والمجموعات الفنية وألبومات الأعراس.',
      eco_friendly_en: 'Premium uncoated and FSC art papers. Soy-based inks for brilliant, eco-conscious colour.',
      eco_friendly_ar: 'أوراق فنية فاخرة غير مطلية ومعتمدة FSC. أحبار قائمة على الصويا للألوان المشرقة والصديقة للبيئة.',
      model_3d: null,
      image_url: PH(480, 580, '#C1440E', 'FFFFFF', 'Coffee\nTable Book'),
      swatch_color: '#C1440E',
      sort_order: 4,
      format_min_en: '200 × 200 mm (Square)',
      format_min_ar: '200 × 200 ملم (مربع)',
      format_max_en: '350 × 350 mm (Large Square)',
      format_max_ar: '350 × 350 ملم (مربع كبير)',
      thickness_min_en: '48 pages',
      thickness_min_ar: '48 صفحة',
      thickness_max_en: '400 pages',
      thickness_max_ar: '400 صفحة',
      materials_en: 'Wibalin, Leather, Japanese linen, Printed photo-wrap, Clamshell box',
      materials_ar: 'ويبالين، جلد، كتان ياباني، غلاف فوتوغرافي مطبوع، صندوق مغلق',
      extras_en: 'Tip-in pages, gatefold spreads, belly band, ribbon bookmark, presentation box',
      extras_ar: 'صفحات إدراج، نشرات مزدوجة، حزام ورقي، مرجع ريبون، صندوق عرض',
      enhancements_en: 'Gold/silver foil, debossing, embossing, die-cut cover, Pantone matching',
      enhancements_ar: 'رقاقة ذهبية/فضية، حفر، نقش، قطع مخصص، مطابقة بانتون',
      find_out_more_images: [
        PH(600, 400, 'C1440E', 'FFFFFF', 'Luxury\nCover'),
        PH(600, 400, 'F8E586', '231F20', 'Fine Art\nPaper'),
        PH(600, 400, '0A0A0A', 'FFFFFF', 'Gatefold\nSpread'),
      ],
      example_images: [
        PH(400, 500, 'C1440E', 'FFFFFF', 'Photo\nPortfolio'),
        PH(400, 500, '231F20', 'FFFFFF', 'Brand\nBook'),
        PH(400, 500, 'EE8461', 'FFFFFF', 'Wedding\nAlbum'),
      ],
    },
    {
      category_id: catMap['Thesis & Academic'],
      slug: 'thesis-academic',
      title_en: 'Thesis & Academic',
      title_ar: 'رسائل أكاديمية',
      subtitle_en: 'Precision printing for scholarly work',
      subtitle_ar: 'طباعة دقيقة للأعمال العلمية',
      description_en: 'Printed to university standards with black-and-white or full-color interiors. Available in hardcover thread-sewn or softcover, with mandatory formatting options including title page, TOC, and binding strip.',
      description_ar: 'طباعة وفق معايير الجامعات بداخليات أبيض وأسود أو ملونة. متاح بغلاف صلب مخيط أو ورقي مع خيارات التنسيق الإلزامية تشمل صفحة العنوان والفهرس وشريط التجليد.',
      best_use_en: 'Master\'s theses, PhD dissertations, research papers, conference proceedings.',
      best_use_ar: 'رسائل الماجستير وأطروحات الدكتوراه والأوراق البحثية وأعمال المؤتمرات.',
      eco_friendly_en: 'Acid-free archival papers ensure your thesis survives generations without yellowing.',
      eco_friendly_ar: 'أوراق أرشيفية خالية من الحموضة تضمن بقاء رسالتك لأجيال دون اصفرار.',
      model_3d: null,
      image_url: PH(480, 580, '#5C5248', 'FFFFFF', 'Thesis &\nAcademic'),
      swatch_color: '#5C5248',
      sort_order: 5,
      format_min_en: 'A4 (210 × 297 mm)',
      format_min_ar: 'A4 (210 × 297 ملم)',
      format_max_en: 'A4 (210 × 297 mm)',
      format_max_ar: 'A4 (210 × 297 ملم)',
      thickness_min_en: '40 pages',
      thickness_min_ar: '40 صفحة',
      thickness_max_en: '600 pages',
      thickness_max_ar: '600 صفحة',
      materials_en: 'Wibalin (hardcover), Matte art cover (softcover), 80 gsm acid-free interior',
      materials_ar: 'ويبالين (غلاف صلب)، غلاف فني مطفي (ورقي)، داخلي 80 جم خالٍ من الحموضة',
      extras_en: 'Gold foil title stamp, embossed university seal, CD pocket',
      extras_ar: 'طباعة عنوان بالرقاقة الذهبية، ختم جامعة مضغوط، جيب CD',
      enhancements_en: 'Colour charts, fold-out maps, laminated pages, presentation box',
      enhancements_ar: 'مخططات ملونة، خرائط قابلة للطي، صفحات مرققة، صندوق عرض',
      find_out_more_images: [
        PH(600, 400, '5C5248', 'FFFFFF', 'Thesis\nBinding'),
        PH(600, 400, 'F8E586', '231F20', 'Gold Foil\nStamp'),
      ],
      example_images: [
        PH(400, 500, '5C5248', 'FFFFFF', 'PhD\nDissertation'),
        PH(400, 500, '1A3A6E', 'FFFFFF', 'Research\nPaper'),
      ],
    },
    {
      category_id: catMap['Books & Publications'],
      slug: 'childrens-book',
      title_en: "Children's Book",
      title_ar: 'كتاب أطفال',
      subtitle_en: 'Vivid colors, durable pages, magical stories',
      subtitle_ar: 'ألوان زاهية وصفحات متينة وقصص ساحرة',
      description_en: 'Specially engineered for tiny hands. Printed on thick board or coated paper with non-toxic inks, rounded corners, and robust binding that survives the youngest readers.',
      description_ar: 'مصمم خصيصاً للأيدي الصغيرة. طباعة على ورق مقوى أو مطلي بأحبار غير سامة، زوايا مدورة وتجليد قوي يتحمل أصغر القراء.',
      best_use_en: 'Picture books, early readers, board books, activity and colouring books.',
      best_use_ar: 'كتب الصور والقراءة المبكرة والكتب المقوى وكتب الأنشطة والتلوين.',
      eco_friendly_en: 'All inks are child-safe and EN71 certified. Paper from sustainably managed forests.',
      eco_friendly_ar: 'جميع الأحبار آمنة للأطفال ومعتمدة EN71. ورق من غابات مُدارة باستدامة.',
      model_3d: null,
      image_url: PH(480, 580, '#285FE7', 'FFFFFF', "Children's\nBook"),
      swatch_color: '#285FE7',
      sort_order: 6,
      format_min_en: '148 × 148 mm (Square)',
      format_min_ar: '148 × 148 ملم (مربع)',
      format_max_en: '280 × 280 mm (Large Square)',
      format_max_ar: '280 × 280 ملم (مربع كبير)',
      thickness_min_en: '16 pages (board)',
      thickness_min_ar: '16 صفحة (مقوى)',
      thickness_max_en: '128 pages',
      thickness_max_ar: '128 صفحة',
      materials_en: '3mm board, Gloss art 200 gsm, Matte soft-touch laminate',
      materials_ar: 'ورق مقوى 3 ملم، ورق فني لامع 200 جم، طلاء مطفي ناعم',
      extras_en: 'Rounded corners, belly band, sewn binding, foam padding',
      extras_ar: 'زوايا مدورة، حزام ورقي، تجليد مخيط، حشوة إسفنجية',
      enhancements_en: 'Glitter covers, die-cut shapes, pop-up elements, scratch-and-sniff',
      enhancements_ar: 'أغلفة بريقة، أشكال مقطوعة، عناصر منبثقة، حك وشم',
      find_out_more_images: [
        PH(600, 400, '285FE7', 'FFFFFF', 'Board Book\nDetail'),
        PH(600, 400, 'F8E586', '231F20', 'Rounded\nCorners'),
      ],
      example_images: [
        PH(400, 500, '285FE7', 'FFFFFF', 'Picture\nBook'),
        PH(400, 500, 'EE8461', 'FFFFFF', 'Activity\nBook'),
      ],
    },
  ];

  for (const p of products) {
    await pool.query(
      `INSERT INTO products (
        category_id, slug, title_en, title_ar, subtitle_en, subtitle_ar,
        image_url, swatch_color, sort_order, is_active,
        description_en, description_ar, best_use_en, best_use_ar,
        eco_friendly_en, eco_friendly_ar, model_3d,
        find_out_more_images, example_images,
        format_min_en, format_min_ar, format_max_en, format_max_ar,
        thickness_min_en, thickness_min_ar, thickness_max_en, thickness_max_ar,
        materials_en, materials_ar, extras_en, extras_ar,
        enhancements_en, enhancements_ar
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33)`,
      [
        p.category_id, p.slug, p.title_en, p.title_ar, p.subtitle_en, p.subtitle_ar,
        p.image_url, p.swatch_color, p.sort_order, true,
        p.description_en, p.description_ar, p.best_use_en, p.best_use_ar,
        p.eco_friendly_en, p.eco_friendly_ar, p.model_3d,
        JSON.stringify(p.find_out_more_images), JSON.stringify(p.example_images),
        p.format_min_en, p.format_min_ar, p.format_max_en, p.format_max_ar,
        p.thickness_min_en, p.thickness_min_ar, p.thickness_max_en, p.thickness_max_ar,
        p.materials_en, p.materials_ar, p.extras_en, p.extras_ar,
        p.enhancements_en, p.enhancements_ar,
      ],
    );
  }
  console.log('✓  products:', products.length);

  // ─────────────────────────────────────────
  //  REVIEWS  (8 reviews)
  // ─────────────────────────────────────────
  const reviews = [
    { author: 'Nour Al-Ahmad', title: 'Absolutely stunning quality', body: 'AIM printed our photography book and the results were jaw-dropping. The colors were accurate to our files and the thread-sewn binding opened completely flat. Every guest at the launch event complimented the quality. We will use AIM for every future project.', rating: 5, sort_order: 1 },
    { author: 'Omar Khaled', title: 'Best thesis printing in Amman', body: 'I was nervous submitting my PhD dissertation to a printer I had never used before, but AIM exceeded every expectation. The hardcover came back perfectly finished with the gold foil stamp exactly as I requested. Delivered on time and well-packaged.', rating: 5, sort_order: 2 },
    { author: 'Layla Mansour', title: 'Our children\'s book came to life', body: 'The illustrations in our children\'s book looked even better in print than on screen. The colours were vibrant, the board stock was thick and durable, and the rounded corners were a lovely touch. The team was communicative throughout the whole process.', rating: 5, sort_order: 3 },
    { author: 'Kareem Bishara', title: 'Professional from start to finish', body: 'Ordered 300 copies of our annual corporate report. The whole process was smooth — from the quote to delivery. The hardcover perfect-bound finish gave the report a premium feel that matched our brand. Highly recommend for corporate printing.', rating: 5, sort_order: 4 },
    { author: 'Sara Hamdan', title: 'Coffee table book perfection', body: 'We commissioned AIM for our architecture studio\'s monograph. The large-format printing captured every detail of our photography. The leather cover and gold debossing were executed flawlessly. This is now a centrepiece in our office.', rating: 5, sort_order: 5 },
    { author: 'Yousef Al-Rawi', title: 'Great value for money', body: 'Printed 500 softcover novels for our local publisher. The quality was consistent across every copy, the delivery was on schedule, and the pricing was very competitive. The matte lamination on the covers looked elegant. Will definitely return.', rating: 4, sort_order: 6 },
    { author: 'Rima Taweel', title: 'Impressive attention to detail', body: 'The AIM team caught a small formatting issue in our file before printing and contacted us immediately. That level of care is rare. The final books were beautiful — perfect binding, crisp text, and stunning cover art reproduction.', rating: 5, sort_order: 7 },
    { author: 'Faris Al-Nabulsi', title: 'Quick turnaround, great quality', body: 'Needed 100 hardcover copies of our event programme on short notice. AIM delivered in three days without compromising quality. The foil stamping on the cover was exactly what we envisioned. Thank you for making the impossible possible.', rating: 4, sort_order: 8 },
  ];

  for (const r of reviews) {
    await pool.query(
      `INSERT INTO reviews (title, body, author, rating, sort_order, is_active) VALUES ($1,$2,$3,$4,$5,$6)`,
      [r.title, r.body, r.author, r.rating, r.sort_order, true],
    );
  }
  console.log('✓  reviews:', reviews.length);

  // ─────────────────────────────────────────
  //  INSTAGRAM POSTS  (8 posts)
  // ─────────────────────────────────────────
  const igPosts = [
    { image_url: PH(600, 600, '7C1C2E', 'FFFFFF', 'Thread Sewn\nHardcover'), caption: 'The art of thread-sewn binding — every signature hand-sewn for a book that opens flat and lasts forever. ✦ DM us to start your project. #bookprinting #hardcover #bookbinding #amman', post_date: '2026-05-28', instagram_link: 'https://instagram.com/p/example1', sort_order: 1 },
    { image_url: PH(600, 600, 'F8E586', '231F20', 'Gold Foil\nStamping'), caption: 'Gold foil stamping transforms a great book into an unforgettable one. ✨ Ask us about custom foil options for your next publication. #foilstamping #luxuryprint #bookdesign', post_date: '2026-05-22', instagram_link: 'https://instagram.com/p/example2', sort_order: 2 },
    { image_url: PH(600, 600, 'C1440E', 'FFFFFF', 'Coffee Table\nBook'), caption: 'Just finished: a 280×280mm photography monograph for a local architect. 300 gsm art board, leather cover, gold debossed title. This is what passion looks like in print. 📖 #coffeétablebook #photographybook #luxuryprinting', post_date: '2026-05-15', instagram_link: 'https://instagram.com/p/example3', sort_order: 3 },
    { image_url: PH(600, 600, '285FE7', 'FFFFFF', "Children's\nBook"), caption: 'Colourful, safe, and built for curious hands. Our children\'s books use child-safe EN71 inks and 3mm board pages that survive the most enthusiastic young readers. 🌈 #childrensbooks #kidsbooks #picturebook', post_date: '2026-05-08', instagram_link: 'https://instagram.com/p/example4', sort_order: 4 },
    { image_url: PH(600, 600, '1A3A6E', 'FFFFFF', 'Thesis\nPrinting'), caption: 'Another PhD dissertation beautifully bound and ready for submission. Acid-free paper, gold foil title, hardcover precision. Congratulations to all our graduating scholars! 🎓 #thesis #phdlife #academicprinting', post_date: '2026-05-01', instagram_link: 'https://instagram.com/p/example5', sort_order: 5 },
    { image_url: PH(600, 600, '3D5A3E', 'FFFFFF', 'Eco Friendly\nPaper'), caption: 'We believe beautiful books and sustainable printing can co-exist. All our FSC-certified papers are here — from recycled uncoated to premium art stock. 🌿 #sustainableprinting #ecofriendly #FSCcertified', post_date: '2026-04-24', instagram_link: 'https://instagram.com/p/example6', sort_order: 6 },
    { image_url: PH(600, 600, 'EE8461', 'FFFFFF', 'Book Launch\nEvent'), caption: 'What a night! We were proud to print the catalogue for last week\'s gallery opening. Seeing our work in the hands of art lovers is the greatest reward. 🖼️ #booklaunch #artprint #jordanculture', post_date: '2026-04-18', instagram_link: 'https://instagram.com/p/example7', sort_order: 7 },
    { image_url: PH(600, 600, '0A0A0A', 'F8E586', 'AIM\nPrinting'), caption: 'Every book tells a story — even before you open it. From concept to final copy, we are with you every step of the way. 📚 Link in bio to get your free quote. #AIMprinting #bookprinting #selfpublishing #jordan', post_date: '2026-04-10', instagram_link: 'https://instagram.com/p/example8', sort_order: 8 },
  ];

  // Clear the existing test instagram post and re-seed
  await pool.query('DELETE FROM instagram_posts');
  for (const p of igPosts) {
    await pool.query(
      `INSERT INTO instagram_posts (image_url, caption, post_date, instagram_link, sort_order, is_active) VALUES ($1,$2,$3,$4,$5,$6)`,
      [p.image_url, p.caption, p.post_date, p.instagram_link, p.sort_order, true],
    );
  }
  console.log('✓  instagram_posts:', igPosts.length);

  // ─────────────────────────────────────────
  //  NEWSLETTER SUBSCRIBERS  (12)
  // ─────────────────────────────────────────
  const emails = [
    { email: 'nour.ahmad@gmail.com',      locale: 'ar', is_confirmed: true  },
    { email: 'omar.khaled@outlook.com',   locale: 'ar', is_confirmed: true  },
    { email: 'layla.mansour@hotmail.com', locale: 'ar', is_confirmed: true  },
    { email: 'kareem.b@yahoo.com',        locale: 'en', is_confirmed: true  },
    { email: 'sara.h@gmail.com',          locale: 'en', is_confirmed: true  },
    { email: 'yousef.rawi@outlook.com',   locale: 'ar', is_confirmed: false },
    { email: 'rima.t@gmail.com',          locale: 'en', is_confirmed: true  },
    { email: 'faris.n@hotmail.com',       locale: 'ar', is_confirmed: true  },
    { email: 'amal.zakaria@gmail.com',    locale: 'ar', is_confirmed: true  },
    { email: 'hisham.ali@gmail.com',      locale: 'ar', is_confirmed: false },
    { email: 'diana.nassar@outlook.com',  locale: 'en', is_confirmed: true  },
    { email: 'tarek.odeh@gmail.com',      locale: 'ar', is_confirmed: true  },
  ];

  for (const s of emails) {
    await pool.query(
      `INSERT INTO newsletter_subscribers (email, locale, is_confirmed) VALUES ($1,$2,$3) ON CONFLICT (email) DO NOTHING`,
      [s.email, s.locale, s.is_confirmed],
    );
  }
  console.log('✓  newsletter_subscribers:', emails.length);

  // ─────────────────────────────────────────
  //  EXTRA CONTACT INQUIRIES  (4 more)
  // ─────────────────────────────────────────
  const inquiries = [
    { name: 'Ahmad Barakat', email: 'ahmad.barakat@gmail.com', phone: '+962 79 111 2233', message: 'I am looking to print 1000 copies of a 320-page hardcover novel. Can you please provide a quote and estimated turnaround time?', inquiry_type: 'printing', status: 'read' },
    { name: 'Dina Sawalha', email: 'dina.s@outlook.com', phone: '+962 78 456 7788', message: 'I would like to self-publish my first children\'s book. Do you offer design and layout services alongside printing? I have the illustrations ready.', inquiry_type: 'self-publishing', status: 'replied' },
    { name: 'Basel Khoury', email: 'b.khoury@company.jo', phone: '+962 6 555 4321', message: 'We need 500 branded annual reports printed in full colour with hardcover binding and foil stamping. What file formats do you accept?', inquiry_type: 'corporate', status: 'new' },
    { name: 'Rana Mahmoud', email: 'rana.m@hotmail.com', phone: null, message: 'Hello, I have my Master\'s thesis ready to print. I need 5 copies in hardcover A4 format with gold foil title. Please advise on pricing.', inquiry_type: 'academic', status: 'new' },
  ];

  for (const c of inquiries) {
    await pool.query(
      `INSERT INTO contact_inquiries (name, email, phone, message, inquiry_type, status) VALUES ($1,$2,$3,$4,$5,$6)`,
      [c.name, c.email, c.phone ?? null, c.message, c.inquiry_type, c.status],
    );
  }
  console.log('✓  contact_inquiries:', inquiries.length, '(added to existing)');

  // ─────────────────────────────────────────
  //  FAQS  (8 FAQs)
  // ─────────────────────────────────────────
  const faqs = [
    { q_en: 'What is the minimum print run?', q_ar: 'ما هو الحد الأدنى لعدد النسخ المطبوعة؟', a_en: 'We accept orders from a single copy. However, unit prices decrease significantly at quantities of 50, 100, 250, and 500+.', a_ar: 'نقبل الطلبات من نسخة واحدة. غير أن سعر الوحدة ينخفض بشكل ملحوظ عند كميات 50 و100 و250 و500 نسخة فأكثر.', sort_order: 1 },
    { q_en: 'What file formats do you accept?', q_ar: 'ما تنسيقات الملفات التي تقبلونها؟', a_en: 'We prefer press-ready PDF/X-1a or PDF/X-4 files. We also accept InDesign, Illustrator, and Photoshop files. All images must be at least 300 dpi.', a_ar: 'نفضل ملفات PDF/X-1a أو PDF/X-4 الجاهزة للطباعة. كما نقبل ملفات InDesign وIllustrator وPhotoshop. يجب أن تكون جميع الصور بدقة 300 dpi على الأقل.', sort_order: 2 },
    { q_en: 'How long does printing take?', q_ar: 'كم يستغرق وقت الطباعة؟', a_en: 'Standard turnaround is 5–10 working days after file approval. Rush orders (2–3 days) are available for an additional fee. Delivery time depends on your location.', a_ar: 'وقت التسليم المعتاد هو 5-10 أيام عمل بعد الموافقة على الملف. تتوفر الطلبات العاجلة (2-3 أيام) بتكلفة إضافية. يعتمد وقت التوصيل على موقعك.', sort_order: 3 },
    { q_en: 'Do you offer colour proofing?', q_ar: 'هل تقدمون بروف ألوان؟', a_en: 'Yes. We offer digital soft-proofs (PDF) free of charge, and physical hard-copy proofs for a small fee before the full print run begins.', a_ar: 'نعم. نقدم بروف رقمي (PDF) مجاناً، وبروف ورقي فعلي بتكلفة رمزية قبل بدء الطباعة الكاملة.', sort_order: 4 },
    { q_en: 'Can I get a quote online?', q_ar: 'هل يمكنني الحصول على عرض سعر عبر الإنترنت؟', a_en: 'Absolutely. Use our contact form or email us your specifications (format, page count, quantity, binding type) and we will respond within one business day.', a_ar: 'بالتأكيد. استخدم نموذج الاتصال أو أرسل لنا مواصفاتك (الحجم، عدد الصفحات، الكمية، نوع التجليد) وسنرد في غضون يوم عمل واحد.', sort_order: 5 },
    { q_en: 'Do you deliver outside Jordan?', q_ar: 'هل توصلون خارج الأردن؟', a_en: 'Yes. We ship internationally via DHL and Aramex. Shipping costs and times vary by destination. Contact us for a shipping quote.', a_ar: 'نعم. نشحن دولياً عبر DHL وAramex. تختلف تكاليف الشحن والمواعيد حسب الوجهة. اتصل بنا للحصول على عرض سعر الشحن.', sort_order: 6 },
    { q_en: 'Do you offer design services?', q_ar: 'هل تقدمون خدمات التصميم؟', a_en: 'Yes, our in-house design team can handle layout, typesetting, cover design, and illustration. Ask about our self-publishing packages.', a_ar: 'نعم، يمكن لفريق التصميم الداخلي لدينا التعامل مع التخطيط والطباعة الحروفية وتصميم الغلاف والرسوم التوضيحية. اسأل عن حزم النشر الذاتي لدينا.', sort_order: 7 },
    { q_en: 'Are your materials eco-friendly?', q_ar: 'هل موادكم صديقة للبيئة؟', a_en: 'We offer FSC-certified papers, recycled stocks, and soy-based inks across all our product lines. Ask for the eco-friendly option when placing your order.', a_ar: 'نقدم أوراقاً معتمدة FSC ومخزوناً معاد تدويره وأحباراً قائمة على الصويا في جميع منتجاتنا. اطلب الخيار الصديق للبيئة عند تقديم طلبك.', sort_order: 8 },
  ];

  for (const f of faqs) {
    await pool.query(
      `INSERT INTO faqs (question_en, question_ar, answer_en, answer_ar, page, sort_order, is_active) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [f.q_en, f.q_ar, f.a_en, f.a_ar, 'self-publishing', f.sort_order, true],
    );
  }
  console.log('✓  faqs:', faqs.length);

  // ─────────────────────────────────────────
  //  BENEFITS  (4 benefits)
  // ─────────────────────────────────────────
  const benefits = [
    { title_en: 'Unmatched Print Quality', title_ar: 'جودة طباعة لا مثيل لها', text_en: 'We use the latest offset and digital presses calibrated daily to deliver accurate, consistent colour and razor-sharp text on every page.', text_ar: 'نستخدم أحدث مطابع الأوفست والرقمية المعايَرة يومياً لتقديم ألوان دقيقة ومتسقة ونص حاد في كل صفحة.', more_text_en: 'Our presses are ISO 12647-2 certified, ensuring your Pantone colours match perfectly from proof to final run.', more_text_ar: 'مطابعنا معتمدة ISO 12647-2، مما يضمن تطابق ألوان Pantone الخاصة بك تماماً من البروف حتى الطباعة النهائية.', bg_color: '#F8E586', sort_order: 1 },
    { title_en: 'Fast, Reliable Delivery', title_ar: 'توصيل سريع وموثوق', text_en: 'Standard orders ship within 5–10 days. Rush orders available in 48 hours. We partner with DHL and Aramex for domestic and international delivery.', text_ar: 'تُشحن الطلبات القياسية خلال 5-10 أيام. تتوفر الطلبات العاجلة خلال 48 ساعة. نتشارك مع DHL وAramex للتوصيل المحلي والدولي.', more_text_en: null, more_text_ar: null, bg_color: '#EE8461', sort_order: 2 },
    { title_en: 'Expert Guidance', title_ar: 'توجيه من الخبراء', text_en: 'From file preparation to binding selection, our team of publishing specialists guides you through every decision so your book turns out exactly as you imagined.', text_ar: 'من إعداد الملفات إلى اختيار التجليد، يوجهك فريقنا من متخصصي النشر في كل قرار لتخرج كتابك كما تخيلته تماماً.', more_text_en: null, more_text_ar: null, bg_color: '#285FE7', sort_order: 3 },
    { title_en: 'Sustainable Printing', title_ar: 'طباعة مستدامة', text_en: 'All our papers are available in FSC-certified and recycled options. We use water-based and soy-based inks to minimise our environmental footprint.', text_ar: 'جميع أوراقنا متوفرة بخيارات FSC المعتمدة والمعاد تدويرها. نستخدم أحباراً مائية وقائمة على الصويا لتقليل بصمتنا البيئية.', more_text_en: null, more_text_ar: null, bg_color: '#3D5A3E', sort_order: 4 },
  ];

  for (const b of benefits) {
    await pool.query(
      `INSERT INTO benefits (title_en, title_ar, text_en, text_ar, more_text_en, more_text_ar, bg_color, sort_order, is_active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [b.title_en, b.title_ar, b.text_en, b.text_ar, b.more_text_en, b.more_text_ar, b.bg_color, b.sort_order, true],
    );
  }
  console.log('✓  benefits:', benefits.length);

  // ─────────────────────────────────────────
  //  ORDER STEPS  (4 steps)
  // ─────────────────────────────────────────
  const steps = [
    { step_number: '01', title_en: 'Submit Your Files', title_ar: 'أرسل ملفاتك', description_en: 'Upload your press-ready PDF or send us your design files. Our preflight team reviews every file within 24 hours and flags any issues before printing begins.', description_ar: 'ارفع ملف PDF الجاهز للطباعة أو أرسل لنا ملفات التصميم. يراجع فريق الـ preflight لدينا كل ملف خلال 24 ساعة ويشير إلى أي مشكلات قبل بدء الطباعة.', image_url: PH(400, 300, 'F8E586', '231F20', 'Step 1\nUpload'), has_cta_button: false, sort_order: 1 },
    { step_number: '02', title_en: 'Approve Your Proof', title_ar: 'وافق على البروف', description_en: 'We send you a digital proof (and physical hard-copy if requested) for final approval. Nothing goes to press until you are 100% happy.', description_ar: 'نرسل لك بروف رقمي (وورقي عند الطلب) للموافقة النهائية. لا شيء يذهب إلى الطباعة حتى تكون راضياً 100%.', image_url: PH(400, 300, 'EE8461', 'FFFFFF', 'Step 2\nApprove'), has_cta_button: false, sort_order: 2 },
    { step_number: '03', title_en: 'We Print & Bind', title_ar: 'نطبع ونجلد', description_en: 'Your book is printed on our ISO-certified presses, bound by our master craftsmen, and quality-checked at every stage to ensure perfection.', description_ar: 'يُطبع كتابك على مطابعنا المعتمدة ISO، ويجلده حرفيونا المهرة، ويخضع للفحص الجودة في كل مرحلة لضمان الكمال.', image_url: PH(400, 300, '1A3A6E', 'FFFFFF', 'Step 3\nPrint'), has_cta_button: false, sort_order: 3 },
    { step_number: '04', title_en: 'Delivered to Your Door', title_ar: 'يُوصَّل إلى بابك', description_en: 'We carefully pack your books and dispatch them via DHL or Aramex. You receive a tracking number the moment your order ships.', description_ar: 'نعبئ كتبك بعناية ونشحنها عبر DHL أو Aramex. تتلقى رقم التتبع في اللحظة التي يُشحن فيها طلبك.', image_url: PH(400, 300, '3D5A3E', 'FFFFFF', 'Step 4\nDeliver'), has_cta_button: true, sort_order: 4 },
  ];

  for (const s of steps) {
    await pool.query(
      `INSERT INTO order_steps (step_number, title_en, title_ar, description_en, description_ar, image_url, has_cta_button, sort_order, is_active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [s.step_number, s.title_en, s.title_ar, s.description_en, s.description_ar, s.image_url, s.has_cta_button, s.sort_order, true],
    );
  }
  console.log('✓  order_steps:', steps.length);

  console.log('\n✅  All seed data inserted successfully.');
  await pool.end();
}

seed().catch(e => { console.error('❌ Seed failed:', e.message); process.exit(1); });
