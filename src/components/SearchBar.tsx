import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data: products = [] } = useProducts();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filteredProducts = query.length > 1 
    ? products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.short_description?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    setQuery("");
    navigate(`/product/${slug}`);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-foreground/10 rounded-full transition-colors"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Search Overlay */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => {
              setIsOpen(false);
              setQuery("");
            }}
          />
          <div className="fixed top-0 left-0 right-0 p-4 md:p-8 z-50">
            <div className="max-w-2xl mx-auto bg-background rounded-2xl border-2 border-foreground shadow-xl overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <Search className="w-5 h-5 text-foreground/50" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent outline-none text-lg font-sans"
                />
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="p-1 hover:bg-foreground/10 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Results */}
              {filteredProducts.length > 0 && (
                <div className="border-t border-foreground/10">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelect(product.slug)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-foreground/5 transition-colors text-left"
                    >
                      <img
                        src={product.image_url || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=100&h=100&fit=crop"}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold font-sans truncate">{product.name}</p>
                        <p className="text-sm text-foreground/60 truncate">{product.category?.name}</p>
                      </div>
                      <span className="font-bold font-sans">${product.price}</span>
                    </button>
                  ))}
                </div>
              )}

              {query.length > 1 && filteredProducts.length === 0 && (
                <div className="p-8 text-center border-t border-foreground/10">
                  <p className="text-foreground/60 font-serif">No products found for "{query}"</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchBar;
