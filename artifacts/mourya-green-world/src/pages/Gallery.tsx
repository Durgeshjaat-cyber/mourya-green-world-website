import { useListGallery } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon } from "lucide-react";

export default function Gallery() {
  const { data: images = [], isLoading } = useListGallery();

  return (
    <PublicLayout>
      <section className="py-16 bg-gradient-to-b from-emerald-50 dark:from-emerald-950/30 to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            Gallery
          </Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Nursery Gallery</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">A glimpse into the lush world of Mourya Green World</p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`animate-pulse bg-muted rounded-xl break-inside-avoid ${i % 3 === 0 ? "aspect-square" : "aspect-[3/4]"}`} />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Gallery coming soon</h3>
              <p className="text-muted-foreground">We're adding photos of our beautiful nursery.</p>
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {images.map((img) => (
                <div key={img.id} className="break-inside-avoid group relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow" data-testid={`img-gallery-${img.id}`}>
                  <img
                    src={img.imageUrl}
                    alt={img.caption || "Gallery image"}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm font-medium">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
