"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { FaInstagram, FaLocationDot, FaPhone } from "react-icons/fa6";

type Language = "ar" | "ku" | "en";

const INSTAGRAM_URL = "https://www.instagram.com/aso_home_textile/";
const MAP_URL = "https://maps.app.goo.gl/1vM1ctcVCXHQw4tF8?g_st=iw";

const copy = {
  ar: {
    language: "العربية",
    direction: "rtl" as const,
    nav: { collection: "المجموعة", story: "حكايتنا", films: "من المتجر", visit: "زورونا" },
    hero: {
      eyebrow: "أربيل · منذ ١٩٩٥",
      title: "مفروشات تُكمل إحساس البيت.",
      body: "لتجارة مستلزمات النوم والفنادق بالمفرد والجملة، بأفضل الأسعار، مع توفر خدمة التوصيل.",
      primary: "اكتشف المجموعة",
      secondary: "الاتجاهات",
      imageAlt: "مفرش سرير أسود فاخر في غرفة عصرية",
      note: "مختارات للبيت كله",
    },
    categories: ["مفارش السرير", "بطانيات", "سجاد", "وسائد وتفاصيل"],
    collection: {
      kicker: "مختاراتنا",
      title: "راحة يومية، بحضورٍ جميل.",
      body: "من القطع الهادئة إلى النقوش الغنية، اخترنا تشكيلة واسعة تناسب البيوت والأذواق المختلفة.",
      cards: [
        { title: "مفارش السرير", caption: "طبقات ناعمة لكل موسم", alt: "مفرش سرير دافئ بنقوش بنية" },
        { title: "بطانيات", caption: "دفء ملموس وتصاميم متنوعة", alt: "بطانية سوداء وبيضاء على سرير" },
        { title: "سجاد", caption: "نقوش تمنح الغرفة شخصية", alt: "سجادة رمادية مزخرفة" },
        { title: "للبيت كله", caption: "خيارات كثيرة تحت سقف واحد", alt: "مجموعة مفروشات معروضة في المتجر" },
      ],
    },
    story: {
      kicker: "حكايتنا",
      title: "من قلب أربيل، إلى تفاصيل بيوتكم.",
      body: "عالم المفروشات مشروع عائلي محلي بدأ عام ١٩٩٥. نعرف أن اختيار المفروشات تجربة شخصية، لذلك نحب أن تشاهدوا الخامة واللون عن قرب وتجدوا القطعة التي تشبه بيتكم.",
      line: "شركة عالم المفروشات للتجارة العامة / المحدودة الخاصة",
      cta: "تابعنا على إنستغرام",
    },
    films: {
      kicker: "نظرة أقرب",
      title: "جولة قصيرة داخل عالم المفروشات.",
      body: "شاهدوا بعض التفاصيل والتشكيلات المتوفرة، ثم زورونا لتجربة الخامات والألوان عن قرب.",
      labels: ["داخل المتجر", "تفاصيل المجموعة", "تشكيلات جديدة"],
      play: "تشغيل الفيديو",
      fullscreen: "شاهد بملء الشاشة",
    },
    visit: {
      kicker: "زورونا",
      title: "ننتظركم في أربيل.",
      body: "زورونا في خانقاه، أربيل، وشاهدوا التشكيلة بأنفسكم. يمكنكم فتح الموقع الدقيق مباشرةً في خرائط Google.",
      directions: "افتح الموقع",
      call: "اتصل بنا",
      address: "خانقاه، أربيل، العراق",
      hours: "للتوفر والأسعار، تواصلوا معنا مباشرة.",
      imageAlt: "واجهة متجر عالم المفروشات في أربيل",
    },
    footer: "راحة أجمل لكل بيت.",
  },
  ku: {
    language: "کوردی",
    direction: "rtl" as const,
    nav: { collection: "کۆمەڵە", story: "چیرۆکمان", films: "لە فرۆشگا", visit: "سەردانمان بکە" },
    hero: {
      eyebrow: "هەولێر · لە ساڵی ١٩٩٥ەوە",
      title: "ڕاخەرانی ماڵ کە هەستی تەواوی دەبەخشێت.",
      body: "بۆ بازرگانی کەل و پەلی نوستن و هۆتێل بە تاک و کۆ بە گونجاوترین نرخ گەیاندن هەیە",
      primary: "کۆمەڵەکە ببینە",
      secondary: "ڕێنمایی شوێن",
      imageAlt: "ڕاخەرانی ڕەشی جێخەو لە ژوورێکی مۆدێرن",
      note: "هەڵبژاردە بۆ هەموو ماڵ",
    },
    categories: ["جلی جێخەو", "پەتوو", "فەرش", "سەرین و وردەکاری"],
    collection: {
      kicker: "هەڵبژاردەکانمان",
      title: "ئاسوودەیی ڕۆژانە، بە دیمەنێکی جوان.",
      body: "لە ڕەنگی ئارامەوە تا نەخشەی دەوڵەمەند، کۆمەڵەیەکی فراوانمان هەیە بۆ ماڵ و سەلیقە جیاوازەکان.",
      cards: [
        { title: "جلی جێخەو", caption: "چینە نەرمه‌کان بۆ هەموو وەرزێک", alt: "ڕاخەرانی گەرم بە نەخشی قاوەیی" },
        { title: "پەتوو", caption: "گەرمی و نەخشەی جۆراوجۆر", alt: "پەتووی ڕەش و سپی لەسەر جێخەو" },
        { title: "فەرش", caption: "نەخشەیەک کە کەسایەتی دەدات بە ژوورەکە", alt: "فەرشی ڕەنگ خۆڵەمێشی نەخشێنراو" },
        { title: "بۆ هەموو ماڵ", caption: "هەڵبژاردەی زۆر لە ژێر یەک سەقفدا", alt: "کۆمەڵەی ڕاخەرانی ماڵ لە فرۆشگا" },
      ],
    },
    story: {
      kicker: "چیرۆکمان",
      title: "لە دڵی هەولێرەوە، بۆ وردەکاریی ماڵەکانتان.",
      body: "عالم المفروشات پرۆژەیەکی خێزانی و ناوخۆییە کە لە ساڵی ١٩٩٥ دەستی پێکردووە. دەزانین هەڵبژاردنی ڕاخەرانی ماڵ شتێکی کەسییە، بۆیە حەز دەکەین لە نزیکەوە خامە و ڕەنگەکان ببینن.",
      line: "کۆمپانیای عالم المفروشات بۆ بازرگانی گشتی / سنوورداری تایبەت",
      cta: "لە ئینستاگرام شوێنمان بکەوە",
    },
    films: {
      kicker: "لە نزیکەوە",
      title: "گەشتێکی کورت لە ناو عالم المفروشات.",
      body: "هەندێک لە وردەکاری و کۆمەڵەکان ببینە، پاشان سەردانمان بکە بۆ ئەوەی خامە و ڕەنگەکان لە نزیکەوە هەڵبژێریت.",
      labels: ["ناو فرۆشگا", "وردەکاریی کۆمەڵە", "هەڵبژاردەی نوێ"],
      play: "ڤیدیۆکە لێبدە",
      fullscreen: "بە پڕی شاشە ببینە",
    },
    visit: {
      kicker: "سەردانمان بکە",
      title: "لە هەولێر چاوەڕێتانین.",
      body: "سەردانمان بکەن لە خانەقا، هەولێر، و کۆمەڵەکان لە نزیکەوە ببینن. شوێنە وردەکەمان لە نەخشەی Google بەردەستە.",
      directions: "شوێنەکە بکەرەوە",
      call: "پەیوەندیمان پێوە بکە",
      address: "خانەقا، هەولێر، عێراق",
      hours: "بۆ بەردەستبوون و نرخ، ڕاستەوخۆ پەیوەندیمان پێوە بکەن.",
      imageAlt: "ڕووی دەرەوەی فرۆشگای عالم المفروشات لە هەولێر",
    },
    footer: "ئاسوودەیی زیاتر بۆ هەر ماڵێک.",
  },
  en: {
    language: "English",
    direction: "ltr" as const,
    nav: { collection: "Collection", story: "Our story", films: "In store", visit: "Visit" },
    hero: {
      eyebrow: "Erbil · Since 1995",
      title: "Textiles that make home feel complete.",
      body: "Sleep and hotel supplies for retail and wholesale at competitive prices, with delivery available.",
      primary: "Explore the collection",
      secondary: "Get directions",
      imageAlt: "A luxurious black bedspread in a modern bedroom",
      note: "A collection for every room",
    },
    categories: ["Bedding", "Blankets", "Carpets", "Cushions & details"],
    collection: {
      kicker: "Our collection",
      title: "Everyday comfort, beautifully considered.",
      body: "From quiet neutrals to expressive patterns, our wide collection is made for different homes, rooms and tastes.",
      cards: [
        { title: "Bedding", caption: "Soft layers for every season", alt: "Warm brown patterned bedding" },
        { title: "Blankets", caption: "Tactile warmth in many designs", alt: "Black and white blanket on a bed" },
        { title: "Carpets", caption: "Patterns that give a room character", alt: "Ornate grey carpet" },
        { title: "For the whole home", caption: "More choice, all in one place", alt: "Home textile collection displayed in store" },
      ],
    },
    story: {
      kicker: "Our story",
      title: "From the heart of Erbil, to the details of your home.",
      body: "Alam Al Mafrooshat is a local family business established in 1995. We know home textiles are personal, so we invite you to see the fabric and colour up close and find the piece that feels right for your home.",
      line: "Alam Al Mafrooshat General Trading Company / Private Limited",
      cta: "Follow us on Instagram",
    },
    films: {
      kicker: "A closer look",
      title: "A short visit inside Alam Al Mafrooshat.",
      body: "See a little of what is in store, then visit us to experience the textures, colours and selection in person.",
      labels: ["Inside the store", "Collection details", "New selections"],
      play: "Play video",
      fullscreen: "Watch full screen",
    },
    visit: {
      kicker: "Visit us",
      title: "We are waiting for you in Erbil.",
      body: "Visit us in Khanaqa, Erbil, and see the collection for yourself. The exact location is ready in Google Maps.",
      directions: "Open in Maps",
      call: "Call us",
      address: "Khanaqa, Erbil, Iraq",
      hours: "For availability and prices, contact us directly.",
      imageAlt: "The Alam Al Mafrooshat storefront in Erbil",
    },
    footer: "A more comfortable home, beautifully made.",
  },
} as const;

const languages: Language[] = ["ar", "ku", "en"];

function isLanguage(value: string | null): value is Language {
  return languages.includes(value as Language);
}

const LANGUAGE_CHANGE_EVENT = "alam-language-change";

function getLanguageFromUrl(): Language {
  const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
  return isLanguage(requestedLanguage) ? requestedLanguage : "ar";
}

function subscribeToLanguage(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(LANGUAGE_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, callback);
  };
}

function getServerLanguage(): Language {
  return "ar";
}

const collectionImages = [
  "/media/bed-warm.jpg",
  "/media/bed-monochrome.jpg",
  "/media/rug-grey.jpg",
  "/media/collection-wall.jpg",
] as const;

const films = [
  { src: "/media/store-film-01.mp4", poster: "/media/store-interior.jpg" },
  { src: "/media/store-film-02.mp4", poster: "/media/rug-red.jpg" },
  { src: "/media/store-film-03.mp4", poster: "/media/collection-wall.jpg" },
] as const;

export default function Home() {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageFromUrl,
    getServerLanguage,
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const text = copy[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = text.direction;
  }, [language, text.direction]);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 28);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  const openFilmFullscreen = (index: number) => {
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>(".film-card video"));
    const video = videos[index];
    if (!video) return;

    videos.forEach((item) => {
      if (item !== video) item.pause();
    });

    const safariVideo = video as HTMLVideoElement & {
      webkitEnterFullscreen?: () => void;
      webkitSupportsFullscreen?: boolean;
    };
    const play = () => void video.play().catch(() => undefined);

    if (safariVideo.webkitSupportsFullscreen && safariVideo.webkitEnterFullscreen) {
      try {
        safariVideo.webkitEnterFullscreen();
        play();
        return;
      } catch {
        // Fall through to the standard API or normal playback.
      }
    }

    if (video.requestFullscreen) {
      void video.requestFullscreen().then(play).catch(play);
      return;
    }

    play();
  };

  const changeLanguage = (nextLanguage: Language) => {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", nextLanguage);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
  };

  useEffect(() => {
    const root = document.documentElement;
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.classList.add("reveal-ready");
    if (reducedMotion) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return () => root.classList.remove("reveal-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return (
    <div className="site-shell" lang={language} dir={text.direction}>
      <header className={`site-header${isScrolled ? " is-scrolled" : ""}`}>
        <a className="brand" href="#top" aria-label="Alam Al Mafrooshat">
          <img src="/brand/logo.png" alt="ASO Home Textile" />
          <span className="brand-name">
            <strong>{language === "en" ? "Alam Al Mafrooshat" : "عالم المفروشات"}</strong>
            <small>ASO Home Textile</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#collection">{text.nav.collection}</a>
          <a href="#story">{text.nav.story}</a>
          <a href="#films">{text.nav.films}</a>
          <a href="#visit">{text.nav.visit}</a>
        </nav>

        <div className="language-switcher" aria-label="Language">
          {languages.map((item) => (
            <button
              className={language === item ? "is-active" : ""}
              key={item}
              type="button"
              aria-label={`Switch language to ${copy[item].language}`}
              aria-pressed={language === item}
              onClick={() => changeLanguage(item)}
            >
              <span
                className={`language-flag language-flag--${item}`}
                aria-hidden="true"
              />
              <span className="language-name" lang={item} dir={copy[item].direction}>
                {copy[item].language}
              </span>
            </button>
          ))}
        </div>
      </header>

      <main id="top">
        <section className="hero section-pad">
          <div className="hero-copy">
            <p className="eyebrow">{text.hero.eyebrow}</p>
            <h1>{text.hero.title}</h1>
            <p className="hero-body">{text.hero.body}</p>
            <div className="hero-actions">
              <a className="button button-dark" href="#collection">
                {text.hero.primary}<span aria-hidden="true">↗</span>
              </a>
              <a className="button button-light" href={MAP_URL} target="_blank" rel="noreferrer">
                <span className="button-label"><FaLocationDot aria-hidden="true" size={16} />{text.hero.secondary}</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-frame">
              <img src="/media/hero-bed.jpg" alt={text.hero.imageAlt} />
              <span className="image-index">01</span>
            </div>
            <p>{text.hero.note}</p>
          </div>

          <div className="category-ribbon" aria-label="Product categories">
            {text.categories.map((category, index) => (
              <span key={category}><b>0{index + 1}</b>{category}</span>
            ))}
          </div>
        </section>

        <section className="collection section-pad" id="collection">
          <div className="section-heading" data-reveal>
            <div>
              <p className="eyebrow">{text.collection.kicker}</p>
              <h2>{text.collection.title}</h2>
            </div>
            <p>{text.collection.body}</p>
          </div>

          <div className="collection-grid">
            {text.collection.cards.map((card, index) => (
              <article className={`collection-card card-${index + 1}`} key={collectionImages[index]} data-reveal>
                <img src={collectionImages[index]} alt={card.alt} loading="lazy" decoding="async" />
                <div className="card-overlay">
                  <span>0{index + 1}</span>
                  <div><h3>{card.title}</h3><p>{card.caption}</p></div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="story section-pad" id="story">
          <div className="story-image-wrap" data-reveal>
            <img src="/media/store-interior.jpg" alt="Alam Al Mafrooshat store interior" loading="lazy" decoding="async" />
            <span className="since-mark">1995<small>ERBIL</small></span>
          </div>
          <div className="story-copy" data-reveal>
            <p className="eyebrow">{text.story.kicker}</p>
            <h2>{text.story.title}</h2>
            <p>{text.story.body}</p>
            <p className="story-line">{text.story.line}</p>
            <a className="text-link" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
              <FaInstagram aria-hidden="true" size={17} />
              {text.story.cta}<span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className="films section-pad" id="films">
          <div className="section-heading films-heading" data-reveal>
            <div>
              <p className="eyebrow">{text.films.kicker}</p>
              <h2>{text.films.title}</h2>
            </div>
            <p>{text.films.body}</p>
          </div>

          <div className="film-grid">
            {films.map((film, index) => (
              <article className="film-card" key={film.src} data-reveal>
                <div className="film-media">
                  <video controls preload="metadata" poster={film.poster} aria-label={`${text.films.play}: ${text.films.labels[index]}`}>
                    <source src={film.src} type="video/mp4" />
                  </video>
                  <button
                    className="film-fullscreen-trigger"
                    type="button"
                    aria-label={`${text.films.fullscreen}: ${text.films.labels[index]}`}
                    onClick={() => openFilmFullscreen(index)}
                  >
                    <span className="film-fullscreen-label" aria-hidden="true">
                      <b>▶</b>{text.films.fullscreen}
                    </span>
                  </button>
                </div>
                <p><span>0{index + 1}</span>{text.films.labels[index]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="visit section-pad" id="visit">
          <div className="visit-panel" data-reveal>
            <div className="visit-copy">
              <p className="eyebrow">{text.visit.kicker}</p>
              <h2>{text.visit.title}</h2>
              <p>{text.visit.body}</p>
              <div className="visit-actions">
                <a className="button button-gold" href={MAP_URL} target="_blank" rel="noreferrer">
                  <span className="button-label"><FaLocationDot aria-hidden="true" size={16} />{text.visit.directions}</span>
                  <span aria-hidden="true">↗</span>
                </a>
                <a className="button button-outline" href="tel:+9647504640058">
                  <span className="button-label"><FaPhone aria-hidden="true" size={16} />{text.visit.call}</span>
                  <span dir="ltr">0750 464 0058</span>
                </a>
              </div>
              <div className="visit-meta">
                <p><strong>{text.visit.address}</strong><span>36.191246, 44.012489</span></p>
                <p>{text.visit.hours}</p>
              </div>
            </div>
            <img src="/media/store-front.jpg" alt={text.visit.imageAlt} loading="lazy" decoding="async" />
          </div>
        </section>
      </main>

      <footer className="site-footer section-pad">
        <div className="footer-brand">
          <img src="/brand/logo.png" alt="" aria-hidden="true" />
          <div><strong>عالم المفروشات</strong><span>Alam Al Mafrooshat</span></div>
        </div>
        <p>{text.footer}</p>
        <div className="footer-links">
          <a className="footer-phone" href="tel:+9647504640058"><FaPhone aria-hidden="true" size={15} />0750 464 0058</a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer"><FaInstagram aria-hidden="true" size={15} />Instagram ↗</a>
          <a href={MAP_URL} target="_blank" rel="noreferrer"><FaLocationDot aria-hidden="true" size={15} />Google Maps ↗</a>
        </div>
      </footer>
    </div>
  );
}
