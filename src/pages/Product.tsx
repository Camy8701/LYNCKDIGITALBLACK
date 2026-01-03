import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "@/components/AddToCartButton";
import { SEO } from "@/components/SEO";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { Check, X, FileText, Calendar, Download } from "lucide-react";
import { format } from "date-fns";

const Product = () => {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug || "");
  const { data: products = [] } = useProducts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="px-5 md:px-20 py-20 text-center">
          <p className="text-lg font-serif text-foreground/60">
            Loading product...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="px-5 md:px-20 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold uppercase mb-6 font-sans tracking-tighter">
            PRODUCT NOT FOUND
          </h1>
          <Link
            to="/"
            className="inline-block bg-foreground text-background px-8 py-4 rounded-full font-bold uppercase text-sm hover:bg-foreground/90 transition-colors"
          >
            Return to Shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const fallbackImage =
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=800&fit=crop";

  // Get related products from the same category
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category_id === product.category_id)
    .slice(0, 3);

  // Parse license terms from database or use defaults
  const licensTerms = product.license_terms || [
    { text: "Use for personal projects", allowed: true },
    { text: "Use for commercial projects", allowed: true },
    { text: "Modify and customize", allowed: true },
    { text: "Resell or redistribute", allowed: false },
  ];

  // Parse gallery images
  const galleryImages = product.gallery_images || [];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${product.name} - LYNCK DIGITAL`}
        description={
          product.short_description ||
          product.description ||
          `Buy ${product.name} - Premium digital product from LYNCK DIGITAL`
        }
        image={
          product.image_url ||
          "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop"
        }
        type="product"
        url={window.location.href}
      />
      <Header />

      <main className="px-5 md:px-20 py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column: Gallery and Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Product Gallery */}
              <ProductGallery
                mainImage={product.image_url || fallbackImage}
                productName={product.name}
                galleryImages={galleryImages}
              />

              {/* Stats Bar */}
              {(product.page_count ||
                product.word_count ||
                product.file_size ||
                product.file_type) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {product.page_count && (
                    <div className="bg-vibrant-mint rounded-2xl p-4 text-center">
                      <div className="text-3xl font-extrabold font-sans mb-1">
                        {product.page_count}
                      </div>
                      <div className="text-xs font-bold uppercase tracking-wider text-foreground/70">
                        Pages
                      </div>
                    </div>
                  )}
                  {product.word_count && (
                    <div className="bg-vibrant-yellow rounded-2xl p-4 text-center">
                      <div className="text-3xl font-extrabold font-sans mb-1">
                        {product.word_count.toLocaleString()}
                      </div>
                      <div className="text-xs font-bold uppercase tracking-wider text-foreground/70">
                        Words
                      </div>
                    </div>
                  )}
                  {product.file_size && (
                    <div className="bg-vibrant-lavender rounded-2xl p-4 text-center">
                      <div className="text-3xl font-extrabold font-sans mb-1">
                        {product.file_size}
                      </div>
                      <div className="text-xs font-bold uppercase tracking-wider text-foreground/70">
                        Size
                      </div>
                    </div>
                  )}
                  {product.file_type && (
                    <div className="bg-vibrant-coral rounded-2xl p-4 text-center">
                      <div className="text-3xl font-extrabold font-sans mb-1">
                        {product.file_type}
                      </div>
                      <div className="text-xs font-bold uppercase tracking-wider text-foreground/70">
                        Format
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* What's Inside Section */}
              {product.whats_inside && (
                <div className="bg-card border-2 border-foreground/10 rounded-3xl p-8">
                  <h2 className="text-2xl font-extrabold uppercase mb-4 font-sans tracking-tight">
                    What's Inside
                  </h2>
                  <div className="prose prose-lg max-w-none font-serif text-foreground/80">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: product.whats_inside.replace(/\n/g, "<br>"),
                      }}
                    />
                  </div>
                </div>
              )}

              {/* This Product Contains */}
              {product.description && (
                <div className="bg-card border-2 border-foreground/10 rounded-3xl p-8">
                  <h2 className="text-2xl font-extrabold uppercase mb-4 font-sans tracking-tight">
                    This Product Contains
                  </h2>
                  <p className="text-lg font-serif text-foreground/80 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Product Info Card */}
                <div className="bg-card border-2 border-foreground/10 rounded-3xl p-6">
                  {/* Category Badge */}
                  {product.category && (
                    <span className="inline-block bg-[#ff6b35] text-white text-xs font-bold uppercase px-3 py-1 rounded-full mb-3 tracking-wider">
                      {product.category.name}
                    </span>
                  )}

                  {/* Product Name */}
                  <h1 className="text-3xl font-extrabold uppercase mb-4 leading-tight tracking-tighter font-sans">
                    {product.name}
                  </h1>

                  {/* Short Description */}
                  {product.short_description && (
                    <p className="text-sm font-serif text-foreground/70 mb-6 leading-relaxed">
                      {product.short_description}
                    </p>
                  )}

                  {/* Price */}
                  <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-foreground/10">
                    <span className="text-4xl font-extrabold font-sans">
                      ${product.price}
                    </span>
                    {product.original_price && (
                      <span className="text-xl text-foreground/40 line-through font-sans">
                        ${product.original_price}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <AddToCartButton
                    product={product}
                    variant="filled"
                    className="w-full text-base py-4 mb-3"
                  />

                  {/* Save for Later Button */}
                  <button className="w-full bg-transparent border-2 border-foreground hover:bg-foreground hover:text-background text-foreground font-bold uppercase text-sm py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Save for Later
                  </button>
                </div>

                {/* License Terms */}
                <div className="bg-card border-2 border-foreground/10 rounded-3xl p-6">
                  <h3 className="text-lg font-extrabold uppercase mb-4 font-sans tracking-tight">
                    You Are Free To
                  </h3>
                  <div className="space-y-3">
                    {licensTerms.map((term: any, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        {term.allowed ? (
                          <div className="w-5 h-5 rounded-full bg-vibrant-mint flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-foreground" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-vibrant-coral flex items-center justify-center flex-shrink-0 mt-0.5">
                            <X className="w-3 h-3 text-foreground" />
                          </div>
                        )}
                        <span className="text-sm font-serif text-foreground/80 leading-relaxed">
                          {term.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details Panel */}
                <div className="bg-card border-2 border-foreground/10 rounded-3xl p-6">
                  <h3 className="text-lg font-extrabold uppercase mb-4 font-sans tracking-tight">
                    Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    {product.file_type && (
                      <div className="flex items-center justify-between">
                        <span className="text-foreground/60 font-serif flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          File Type
                        </span>
                        <span className="font-bold font-sans">
                          {product.file_type}
                        </span>
                      </div>
                    )}
                    {product.file_size && (
                      <div className="flex items-center justify-between">
                        <span className="text-foreground/60 font-serif flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          File Size
                        </span>
                        <span className="font-bold font-sans">
                          {product.file_size}
                        </span>
                      </div>
                    )}
                    {product.created_at && (
                      <div className="flex items-center justify-between">
                        <span className="text-foreground/60 font-serif flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date Added
                        </span>
                        <span className="font-bold font-sans">
                          {format(new Date(product.created_at), "MMM d, yyyy")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Shop Link */}
          <div className="mt-12 pt-8 border-t border-foreground/10">
            <Link
              to="/"
              className="text-lg font-sans font-bold uppercase tracking-tight inline-block hover:opacity-70 transition-opacity"
            >
              ← BACK TO SHOP
            </Link>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-foreground/10">
            <h2 className="text-3xl md:text-5xl font-extrabold uppercase mb-8 text-center font-sans tracking-tighter">
              YOU MIGHT ALSO LIKE
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Product;
