import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryFilter from "@/components/CategoryFilter";
import Button from "@/components/Button";
import { useProducts, useCategories } from "@/hooks/useProducts";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibleProducts, setVisibleProducts] = useState(6);
  
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [] } = useCategories();

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category?.slug === selectedCategory);
    }
    return filtered;
  }, [products, selectedCategory]);

  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 6, filteredProducts.length));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="px-5 md:px-20 pt-12 md:pt-20 pb-8 md:pb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-[120px] font-extrabold uppercase text-center mb-10 max-[700px]:mb-[30px] leading-[0.72] tracking-[-2px] max-[700px]:tracking-[-1px]">
              LYNCK DIGITAL
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-foreground/80 max-w-3xl mx-auto mb-8 font-serif">
              Premium digital products to help you build, grow, and scale your online business. 
              From courses and templates to eBooks and marketing kits — everything you need to succeed.
            </p>
          </div>
        </section>

        {/* Hero Carousel */}
        <section className="px-5 md:px-20 pb-8 md:pb-12">
          <HeroCarousel />
        </section>

        {/* Category Filter */}
        <section className="px-5 md:px-20 py-8 md:py-12">
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </section>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="text-center py-20">
            <p className="text-lg font-serif text-foreground/60">Loading products...</p>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-5 gap-x-5 gap-y-8 md:pt-0 md:px-20 md:pb-8 md:gap-x-16 md:gap-y-8">
              {filteredProducts.slice(0, visibleProducts).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </section>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg font-serif text-foreground/60">No products found in this category.</p>
              </div>
            )}

            {/* Load More */}
            {visibleProducts < filteredProducts.length && (
              <div className="text-center py-12">
                <Button onClick={loadMore} variant="transparent">
                  LOAD MORE
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
