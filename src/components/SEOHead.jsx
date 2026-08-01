import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { LANGUAGES, replaceLanguageInPath } from '../i18n/languages';

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

    LANGUAGES.forEach(({ code, hreflang }) => {
      let alternate = document.querySelector(`link[hreflang="${hreflang}"]`);
      if (!alternate) {
        alternate = document.createElement('link');
        alternate.rel = 'alternate';
        alternate.hreflang = hreflang;
        document.head.appendChild(alternate);
      }
      alternate.href = `https://pixelstarships.guide${replaceLanguageInPath(location.pathname, code)}`;
    });

  }, [fullTitle, metaDesc, currentCanonical, location.pathname]);

  return null;
}
