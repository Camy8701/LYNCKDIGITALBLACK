import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, FileText, Type, HardDrive, Download, Check, X, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackgroundLayers from "@/components/BackgroundLayers";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";
import WishlistButton from "@/components/WishlistButton";
import ProductGallery from "@/components/ProductGallery";
import { SEO } from "@/components/SEO";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const Product = () => {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug || '');
  const { data: products = [] } = useProducts();

  const fallbackImage = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=800&fit=crop";

  // Add Product Schema.org structured data - must be before early returns
  useEffect(() => {
    if (!product) return;
    
    // Remove any existing product schema first
    const existingScript = document.getElementById('product-schema');
    if (existingScript) {
      existingScript.remove();
    }

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.short_description || product.description || "",
      "image": product.image_url || fallbackImage,
      "brand": {
        "@type": "Brand",
        "name": "LYNCK Digital"
      },
      "offers": {
        "@type": "Offer",
        "price": product.price.toString(),
        "priceCurrency": "USD",
        "availability": product.is_active ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "url": typeof window !== 'undefined' ? window.location.href : ""
      },
      "category": product.category?.name || "Digital Products"
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(productSchema);
    script.id = 'product-schema';
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('product-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [product, fallbackImage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] relative">
        <BackgroundLayers />
        <div className="relative z-[200]">
        <Header />
        <main className="px-5 md:px-20 py-20 text-center">
          <p className="text-lg font-serif text-muted-foreground">Loading product...</p>
        </main>
        <Footer />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] relative">
        <BackgroundLayers />
        <div className="relative z-[200]">
        <Header />
        <main className="px-5 md:px-20 py-20 text-center">
          <h1 className="heading-lg mb-6 font-sans text-white">PRODUCT NOT FOUND</h1>
          <Link to="/" className="btn-transparent">
            Return to Shop
          </Link>
        </main>
        <Footer />
        </div>
      </div>
    );
  }

  const colorClass = product.card_color || product.category?.color_class || "bg-vibrant-purple";
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  // Get related products from the same category
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category_id === product.category_id)
    .slice(0, 3);

  // Default values for enhanced fields
  const pageCount = product.page_count || 25;
  const wordCount = product.word_count || 5000;
  const fileSize = product.file_size || "3.0 MB";
  const fileType = product.file_type || "PDF";

  // Parse whats_inside (string array)
  const whatsInside = product.whats_inside?.length 
    ? product.whats_inside
    : [
        "Complete digital product files",
        "Detailed documentation",
        "Bonus resources"
      ];

  // Parse license_terms (string array - format: "text|allowed" or just "text")
  const defaultLicenseTerms = [
    { text: "Use for personal projects", allowed: true },
    { text: "Use for commercial projects", allowed: true },
    { text: "Modify and customize", allowed: true },
    { text: "Resell or redistribute", allowed: false }
  ];
  
  const licenseTerms = product.license_terms?.length 
    ? product.license_terms.map(term => {
        if (term.includes('|')) {
          const [text, allowed] = term.split('|');
          return { text, allowed: allowed === 'true' };
        }
        return { text: term, allowed: true };
      })
    : defaultLicenseTerms;

  // Gallery images (string array of URLs)
  const galleryImages = product.gallery_images?.length ? product.gallery_images : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      <BackgroundLayers />
      <div className="relative z-[200]">
      <SEO
        title={`${product.name} - LYNCK DIGITAL`}
        description={product.short_description || product.description || `Buy ${product.name} - Premium digital product from LYNCK DIGITAL`}
        image={product.image_url || fallbackImage}
        type="product"
        url={window.location.href}
      />
      <Header />

      <main>
        {/* Back Link & Header */}
        <section className="px-5 md:px-20 pt-8 pb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-white transition-colors font-sans"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </Link>
        </section>

        {/* Product Hero */}
        <section className="px-5 md:px-20 pb-8">
          <div className="max-w-[1400px] mx-auto">
            {/* Title & Category */}
            <div className="mb-6">
              {product.category && (
                <span className="section-label">
                  {product.category.name}
                </span>
              )}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.9] tracking-tighter font-sans mb-4 text-white">
                {product.name}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-serif">
                {product.short_description}
              </p>
            </div>

            {/* Stats Bar - Dark Tech Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="stat-card-lime text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-[#ccff00]" />
                </div>
                <div className="text-3xl font-extrabold font-sans mb-1 text-white">
                  {pageCount}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Pages
                </div>
              </div>
              <div className="stat-card text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Type className="w-5 h-5 text-[#e64a19]" />
                </div>
                <div className="text-3xl font-extrabold font-sans mb-1 text-white">
                  {wordCount.toLocaleString()}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Words
                </div>
              </div>
              <div className="stat-card-lime text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <HardDrive className="w-5 h-5 text-[#ccff00]" />
                </div>
                <div className="text-3xl font-extrabold font-sans mb-1 text-white">
                  {fileSize}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Size
                </div>
              </div>
              <div className="stat-card text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Download className="w-5 h-5 text-[#e64a19]" />
                </div>
                <div className="text-3xl font-extrabold font-sans mb-1 text-white">
                  {fileType}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Format
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Left Column - Images & Description */}
              <div className="lg:col-span-2 space-y-8">
                {/* Product Gallery */}
                <ProductGallery
                  mainImage={product.image_url || fallbackImage}
                  galleryImages={galleryImages}
                  productName={product.name}
                />

                {/* Description */}
                <div>
                  <h2 className="text-xl font-bold uppercase mb-4 font-sans tracking-tight text-white">
                    Description
                  </h2>
                  <div className="prose prose-lg max-w-none font-serif text-muted-foreground">
                    <p className="text-lg leading-relaxed whitespace-pre-line">
                      {product.description || product.short_description}
                    </p>
                  </div>
                </div>

                {/* What's Inside */}
                <div className="stat-card">
                  <h3 className="text-lg font-bold uppercase mb-4 font-sans tracking-tight text-white">
                    What's Inside
                  </h3>
                  <ul className="space-y-3">
                    {whatsInside.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#ccff00] flex-shrink-0 mt-0.5" />
                        <span className="font-serif text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column - Sticky Sidebar */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-8 space-y-6">
                  {/* Product Preview Card */}
                  <div className="stat-card border-[#e64a19]">
                    <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-[#222]">
                      <img
                        src={product.image_url || fallbackImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl font-black font-sans text-white">${product.price}</span>
                      {product.original_price && (
                        <>
                          <span className="text-xl text-muted-foreground line-through font-sans">
                            ${product.original_price}
                          </span>
                          <span className="bg-[#e64a19] text-white text-xs font-bold px-2 py-1 rounded-full">
                            {discount}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <WishlistButton
                        productId={product.id}
                        className="w-full h-12 rounded-full border-[#333] text-white hover:bg-[#222]"
                      />
                      <AddToCartButton
                        product={product}
                        variant="filled"
                        className="w-full justify-center bg-[#e64a19] hover:bg-[#ff6d3a] text-white border-[#e64a19]"
                      />
                    </div>
                  </div>

                  {/* License Terms */}
                  <div className="stat-card">
                    <h3 className="text-sm font-bold uppercase mb-4 font-sans tracking-wider text-muted-foreground">
                      License Terms
                    </h3>
                    <ul className="space-y-3">
                      {licenseTerms.map((term, index) => (
                        <li key={index} className="flex items-start gap-3">
                          {term.allowed ? (
                            <div className="w-5 h-5 rounded-full bg-[#ccff00]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-[#ccff00]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <X className="w-3 h-3 text-red-500" />
                            </div>
                          )}
                          <span className="text-sm font-serif text-muted-foreground leading-relaxed">
                            {term.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Details */}
                  <div className="stat-card">
                    <h3 className="text-sm font-bold uppercase mb-4 font-sans tracking-wider text-muted-foreground">
                      Details
                    </h3>
                    <dl className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground font-serif flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          File Type
                        </dt>
                        <dd className="font-bold font-sans text-white">{fileType}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground font-serif flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          File Size
                        </dt>
                        <dd className="font-bold font-sans text-white">{fileSize}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground font-serif flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date Added
                        </dt>
                        <dd className="font-bold font-sans text-white">
                          {format(new Date(product.created_at), "MMM d, yyyy")}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-[#222] mt-12">
            <div className="px-5 md:px-20 pt-12 md:pt-16 pb-8 md:pb-12">
              <h2 className="heading-md mb-8 text-center font-sans text-white">
                YOU MIGHT ALSO LIKE
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-5 gap-x-5 gap-y-8 md:pt-0 md:px-20 md:pb-8 md:gap-x-16 md:gap-y-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      </div>
    </div>
  );
};

export default Product;
