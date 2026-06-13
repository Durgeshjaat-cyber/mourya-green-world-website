import { useEffect } from 'react';

interface SEOOptions {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

const SITE_NAME = 'Mourya Green World';
const DEFAULT_DESC = 'Premium plant nursery in Noida. Buy indoor plants, outdoor plants, air purifying plants and more. Fresh from our nursery, delivered to your doorstep.';
const DEFAULT_IMAGE = '/og-image.jpg';

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setOgMeta(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.href = url;
}

export function useSEO({ title, description, image, url }: SEOOptions) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
    const desc = description || DEFAULT_DESC;
    const img = image || DEFAULT_IMAGE;
    const canonicalUrl = url || window.location.href;

    document.title = fullTitle;
    setMeta('description', desc);
    setMeta('robots', 'index, follow');
    setMeta('author', SITE_NAME);
    setMeta('keywords', 'plant nursery Noida, buy plants online, indoor plants, outdoor plants, air purifying plants, lucky plants, succulents, Mourya Green World');

    setOgMeta('og:title', fullTitle);
    setOgMeta('og:description', desc);
    setOgMeta('og:image', img);
    setOgMeta('og:url', canonicalUrl);
    setOgMeta('og:type', 'website');
    setOgMeta('og:site_name', SITE_NAME);
    setOgMeta('og:locale', 'en_IN');

    setOgMeta('twitter:card', 'summary_large_image');
    setOgMeta('twitter:title', fullTitle);
    setOgMeta('twitter:description', desc);
    setOgMeta('twitter:image', img);

    setCanonical(canonicalUrl);
  }, [title, description, image, url]);
}
