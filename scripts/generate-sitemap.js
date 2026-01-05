import { createClient } from '@supabase/supabase-js';
import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file manually
const envPath = join(__dirname, '..', '.env');
try {
  const envFile = readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
} catch (error) {
  console.warn('Warning: Could not load .env file:', error.message);
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const DOMAIN = 'https://lynckdigital.store';

function formatDate(date) {
  if (!date) return new Date().toISOString().split('T')[0];
  return new Date(date).toISOString().split('T')[0];
}

async function generateSitemap() {
  console.log('Generating sitemap for LYNCK Digital...\n');

  let urls = [];

  // Homepage
  urls.push({
    loc: DOMAIN,
    changefreq: 'daily',
    priority: '1.0',
    lastmod: formatDate(new Date())
  });

  // Blog index
  urls.push({
    loc: DOMAIN + '/blog',
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: formatDate(new Date())
  });

  // Contact page
  urls.push({
    loc: DOMAIN + '/contact',
    changefreq: 'monthly',
    priority: '0.6',
    lastmod: formatDate(new Date())
  });

  // Fetch products
  console.log('Fetching products...');
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('slug, updated_at, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (!productsError && products) {
    console.log('Found ' + products.length + ' products');
    products.forEach(product => {
      urls.push({
        loc: DOMAIN + '/product/' + product.slug,
        changefreq: 'weekly',
        priority: '0.9',
        lastmod: formatDate(product.updated_at || product.created_at)
      });
    });
  }

  // Fetch blog posts
  console.log('Fetching blog posts...');
  const { data: blogPosts, error: blogError } = await supabase
    .from('blog_posts')
    .select('slug, updated_at, created_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (!blogError && blogPosts) {
    console.log('Found ' + blogPosts.length + ' blog posts');
    blogPosts.forEach(post => {
      urls.push({
        loc: DOMAIN + '/blog/' + post.slug,
        changefreq: 'monthly',
        priority: '0.7',
        lastmod: formatDate(post.updated_at || post.created_at)
      });
    });
  }

  const urlsXml = urls.map(url => 
    '  <url>\n' +
    '    <loc>' + url.loc + '</loc>\n' +
    '    <lastmod>' + url.lastmod + '</lastmod>\n' +
    '    <changefreq>' + url.changefreq + '</changefreq>\n' +
    '    <priority>' + url.priority + '</priority>\n' +
    '  </url>'
  ).join('\n');

  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urlsXml + '\n' +
    '</urlset>';

  const publicPath = join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(publicPath, xml);

  console.log('\nSitemap generated successfully for LYNCK Digital!');
  console.log('Domain: ' + DOMAIN);
  console.log('Location: public/sitemap.xml');
  console.log('Total URLs: ' + urls.length);
}

generateSitemap().catch(error => {
  console.error('Error generating sitemap:', error);
  process.exit(1);
});
