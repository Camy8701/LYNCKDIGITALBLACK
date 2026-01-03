import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export const SEO = ({
  title = 'LYNCK DIGITAL - Digital Products Store',
  description = 'Premium digital products and resources for creators, developers, and entrepreneurs. High-quality templates, tools, and digital assets to power your projects.',
  image = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop',
  url,
  type = 'website',
  author = 'LYNCK DIGITAL',
  publishedTime,
  modifiedTime
}: SEOProps) => {
  useEffect(() => {
    document.title = title;

    const metaTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:type', content: type },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      { name: 'description', content: description },
      { name: 'author', content: author }
    ];

    if (url) {
      metaTags.push({ property: 'og:url', content: url });
      metaTags.push({ name: 'twitter:url', content: url });
    }

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
      document.title = 'LYNCK DIGITAL - Digital Products Store';
    };
  }, [title, description, image, url, type, author, publishedTime, modifiedTime]);

  return null;
};
