import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

export function SEOHead({ title, description, canonicalUrl, ogImage = '/public/guide-images/game_assets/game_icon.png' }) {
  const { lang = 'vi' } = useParams();
  const location = useLocation();

  const siteName = 'PSS Library';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const metaDesc = description || 'Fast, bilingual, searchable guide and reference library for Pixel Starships game data, artwork, strategy, and tools.';
  const currentCanonical = canonicalUrl || `https://pixelstarships.guide${location.pathname}`;

  useEffect(() => {
    // Dynamic document title
    document.title = fullTitle;

    // Update meta description
    let metaDescTag = document.querySelector('meta[name="description"]');
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta');
      metaDescTag.name = 'description';
      document.head.appendChild(metaDescTag);
    }
    metaDescTag.content = metaDesc;

    // Canonical link tag
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.rel = 'canonical';
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.href = currentCanonical;

    // Open Graph Title
    let ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (!ogTitleTag) {
      ogTitleTag = document.createElement('meta');
      ogTitleTag.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitleTag);
    }
    ogTitleTag.content = fullTitle;

    // Open Graph Description
    let ogDescTag = document.querySelector('meta[property="og:description"]');
    if (!ogDescTag) {
      ogDescTag = document.createElement('meta');
      ogDescTag.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescTag);
    }
    ogDescTag.content = metaDesc;

    // Hreflang alternate links (en and vi)
    const enPath = location.pathname.replace(/^\/(en|vi)/, '/en');
    const viPath = location.pathname.replace(/^\/(en|vi)/, '/vi');

    let hrefEn = document.querySelector('link[hreflang="en"]');
    if (!hrefEn) {
      hrefEn = document.createElement('link');
      hrefEn.rel = 'alternate';
      hrefEn.hreflang = 'en';
      document.head.appendChild(hrefEn);
    }
    hrefEn.href = `https://pixelstarships.guide${enPath}`;

    let hrefVi = document.querySelector('link[hreflang="vi"]');
    if (!hrefVi) {
      hrefVi = document.createElement('link');
      hrefVi.rel = 'alternate';
      hrefVi.hreflang = 'vi';
      document.head.appendChild(hrefVi);
    }
    hrefVi.href = `https://pixelstarships.guide${viPath}`;

  }, [fullTitle, metaDesc, currentCanonical, location.pathname]);

  return null;
}
