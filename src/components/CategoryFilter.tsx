import { cn } from "@/lib/utils";
import { Category } from "@/types/product";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={() => onSelectCategory(null)}
        className={cn(
          "px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-200 border-2",
          selectedCategory === null
            ? "bg-[#e64a19] text-white border-[#e64a19]"
            : "bg-transparent text-white border-[#262626] hover:border-[#ccff00] hover:text-[#ccff00]"
        )}
      >
        All Products
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.slug)}
          className={cn(
            "px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-200 border-2",
            selectedCategory === category.slug
              ? "bg-[#e64a19] text-white border-[#e64a19]"
              : "bg-transparent text-white border-[#262626] hover:border-[#ccff00] hover:text-[#ccff00]"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
