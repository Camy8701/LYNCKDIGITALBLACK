import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  mainImage: string;
  galleryImages?: string[] | null;
  productName: string;
}

const ProductGallery = ({ mainImage, galleryImages, productName }: ProductGalleryProps) => {
  const allImages = [mainImage, ...(galleryImages || [])].filter(Boolean);
  const [selectedImage, setSelectedImage] = useState(0);

  const fallbackImage = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=800&fit=crop";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = fallbackImage;
  };

  if (allImages.length <= 1) {
    return (
      <div className="rounded-2xl overflow-hidden bg-foreground/5">
        <img
          src={allImages[0] || fallbackImage}
          alt={productName}
          className="w-full aspect-[4/3] object-cover"
          onError={handleImageError}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="rounded-2xl overflow-hidden bg-foreground/5">
        <img
          src={allImages[selectedImage] || fallbackImage}
          alt={`${productName} - Image ${selectedImage + 1}`}
          className="w-full aspect-[4/3] object-cover transition-opacity duration-300"
          onError={handleImageError}
        />
      </div>

      {/* Thumbnail Row */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {allImages.slice(0, 5).map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={cn(
              "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200",
              selectedImage === index
                ? "border-foreground opacity-100"
                : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            <img
              src={image || fallbackImage}
              alt={`${productName} thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
