import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string | null;
  modifiedTime?: string;
  keywords?: string;
}

const BASE_URL = 'https://lynckdigital.com';
const DEFAULT_KEYWORDS = 'lynck, lynckdigital, lynck digital, digital products, templates, courses, eBooks, business tools';

export const SEO = ({
  title = 'LYNCK Digital | Premium Digital Products & Templates for Creators',
  description = 'LYNCK Digital offers premium digital products, templates, courses, and resources for creators and entrepreneurs. Shop lynckdigital for high-quality business tools.',
  image = `${BASE_URL}/assets/logo.png`,
  url,
  type = 'website',
  author = 'LYNCK Digital',
  publishedTime,
  modifiedTime,
  keywords = DEFAULT_KEYWORDS
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url || BASE_URL);

    const metaTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:type', content: type },
      { property: 'og:url', content: url || BASE_URL },
      { property: 'og:site_name', content: 'LYNCK Digital' },
      { property: 'og:locale', content: 'en_US' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      { name: 'twitter:url', content: url || BASE_URL },
      { name: 'description', content: description },
      { name: 'author', content: author },
      { name: 'keywords', content: keywords },
      { name: 'robots', content: 'index, follow' }
    ];

    if (publishedTime) {
      metaTags.push({ property: 'article:published_time', content: publishedTime });
    }

    if (modifiedTime) {
      metaTags.push({ property: 'article:modified_time', content: modifiedTime });
    }

    metaTags.forEach(({ property, name, content }) => {
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector);
      
      if (!element) {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', property);
        } else if (name) {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    });

    return () => {
      document.title = 'LYNCK Digital | Premium Digital Products & Templates for Creators';
    };
  }, [title, description, image, url, type, author, publishedTime, modifiedTime, keywords]);

  return null;
};
