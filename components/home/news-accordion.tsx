import Link from "next/link";

interface ArticleItem {
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  coverImage?: string | null;
}

interface NewsAccordionProps {
  articles?: ArticleItem[];
}

export function NewsAccordion({ articles }: NewsAccordionProps) {
  const defaultItems = [
    {
      href: "/news",
      img: "/assets/images/m12/dv-news-logistics.jpg",
      pill: "سرمایه‌گذاری",
      date: "۱۲ شهریور ۱۴۰۵",
      title: "چرا دیجی‌ونچرز در استارتاپ‌های لجستیک هوشمند و زنجیره تأمین تجارت دیجیتال سرمایه‌گذاری کرد؟",
    },
    {
      href: "/news",
      img: "/assets/images/m12/dv-news-fintech.jpg",
      pill: "اخبار پورتفولیو",
      date: "۲ شهریور ۱۴۰۵",
      title: "همراهی راهبردی دیجی‌پی و دیجی‌ونچرز در توانمندسازی و رشد مقیاس استارتاپ‌های حوزه فین‌تک",
    },
    {
      href: "/news",
      img: "/assets/images/m12/dv-news-ai.jpg",
      pill: "دیدگاه و تحلیل",
      date: "۳۰ تیر ۱۴۰۵",
      title: "تحلیل اختصاصی: همگرایی هوش مصنوعی و مدل‌های زبانی بزرگ در تحول تجربه تجارت الکترونیک",
    },
  ];

  const items =
    articles && articles.length >= 3
      ? articles.slice(0, 3).map((art, idx) => ({
          href: `/news/${art.slug}`,
          img: art.coverImage || defaultItems[idx].img,
          pill: art.category || defaultItems[idx].pill,
          date: art.publishedAt || defaultItems[idx].date,
          title: art.title,
        }))
      : defaultItems;

  return (
    <div className="m12-news-grid">
      {items.map((item, idx) => (
        <Link key={idx} href={item.href} className="m12-news-tile group">
          <img src={item.img} alt={item.title} className="m12-news-bg" />
          <div className="m12-news-overlay" />
          <span className="m12-news-pill">{item.pill}</span>
          <div className="m12-news-content">
            <p className="m12-news-date">{item.date}</p>
            <h3 className="m12-news-title">{item.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
