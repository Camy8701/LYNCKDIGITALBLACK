import { useState } from "react";
import { cn } from "@/lib/utils";

interface GalleryImage {
  url: string;
  alt: string;
  order: number;
}

interface ProductGalleryProps {
  mainImage: string;
  productName: string;
  galleryImages?: GalleryImage[];
}

const ProductGallery = ({
  mainImage,
  productName,
  galleryImages = [],
}: ProductGalleryProps) => {
  // Combine main image with gallery images
  const allImages = [
    { url: mainImage, alt: productName, order: 0 },
    ...galleryImages,
  ].sort((a, b) => a.order - b.order);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = allImages[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative bg-card rounded-3xl overflow-hidden border-2 border-foreground/10 aspect-[4/3] group">
        <img
          src={selectedImage.url}
          alt={selectedImage.alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Image Counter Badge */}
        {allImages.length > 1 && (
          <div className="absolute top-4 right-4 bg-foreground/80 backdrop-blur-sm text-background px-3 py-1 rounded-full text-xs font-bold font-sans">
            {selectedIndex + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative rounded-xl overflow-hidden border-2 transition-all duration-300 aspect-[4/3] group",
                selectedIndex === index
                  ? "border-[#ff6b35] ring-2 ring-[#ff6b35]/30"
                  : "border-foreground/10 hover:border-foreground/30"
              )}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              {/* Overlay when not selected */}
              {selectedIndex !== index && (
                <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/10 transition-colors duration-300" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Navigation Arrows for Mobile */}
      {allImages.length > 1 && (
        <div className="flex justify-center gap-2 md:hidden">
          <button
            onClick={() =>
              setSelectedIndex((prev) =>
                prev > 0 ? prev - 1 : allImages.length - 1
              )
            }
            className="bg-foreground text-background px-4 py-2 rounded-full font-bold text-sm font-sans uppercase hover:bg-foreground/90 transition-colors"
          >
            ← Prev
          </button>
          <button
            onClick={() =>
              setSelectedIndex((prev) =>
                prev < allImages.length - 1 ? prev + 1 : 0
              )
            }
            className="bg-foreground text-background px-4 py-2 rounded-full font-bold text-sm font-sans uppercase hover:bg-foreground/90 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
