import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";

const Product = () => {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug || '');
  const { data: products = [] } = useProducts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="px-5 md:px-20 py-20 text-center">
          <p className="text-lg font-serif text-foreground/60">Loading product...</p>
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
          <h1 className="heading-lg mb-6 font-sans">PRODUCT NOT FOUND</h1>
          <Link to="/">
            <Button variant="transparent" showArrow={false}>
              Return to Shop
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const colorClass = product.category?.color_class || "bg-vibrant-purple";
  const discount = product.original_price 
    ? Math.round((1 - product.price / product.original_price) * 100) 
    : 0;

  // Get related products from the same category
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category_id === product.category_id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Product Hero */}
        <section className={cn("px-5 md:px-20 py-8 md:py-16", colorClass)}>
          <div className="max-w-[1300px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Product Image */}
              <div className="relative">
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-accent-red text-foreground text-sm font-bold px-4 py-2 rounded-full z-10">
                    {discount}% OFF
                  </span>
                )}
                <div className="rounded-3xl overflow-hidden">
                  <img
                    src={product.image_url || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=800&fit=crop"}
                    alt={product.name}
                    className="w-full aspect-square object-cover"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-center">
                {product.category && (
                  <span className="text-sm font-bold uppercase text-foreground/70 mb-3 font-sans tracking-wider">
                    {product.category.name}
                  </span>
                )}
                
                <h1 className="text-4xl md:text-6xl font-extrabold uppercase mb-6 leading-[0.9] tracking-tighter font-sans">
                  {product.name}
                </h1>
                
                <p className="text-lg md:text-xl leading-relaxed text-foreground/80 mb-6 font-serif">
                  {product.short_description}
                </p>

                {/* Price */}
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl font-extrabold font-sans">${product.price}</span>
                  {product.original_price && (
                    <span className="text-2xl text-foreground/50 line-through font-sans">
                      ${product.original_price}
                    </span>
                  )}
                </div>

                {/* Buy Button */}
                <AddToCartButton
                  product={product}
                  variant="filled"
                  className="text-base py-4 px-8 self-start"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Product Description */}
        <section className="px-5 md:px-20 py-12 md:py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold uppercase mb-6 font-sans tracking-tight">
              About This Product
            </h2>
            <div className="prose prose-lg max-w-none font-serif text-foreground/80">
              <p className="text-lg md:text-xl leading-relaxed">
                {product.description || product.short_description}
              </p>
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
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-foreground/10">
            <div className="px-5 md:px-20 pt-12 md:pt-16 pb-8 md:pb-12">
              <h2 className="heading-md mb-8 text-center font-sans">
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
  );
};

export default Product;
