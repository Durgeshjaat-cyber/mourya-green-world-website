import { useParams, Link } from "wouter";
import { useGetPlant, getGetPlantQueryKey } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, Sun, Droplets, ArrowLeft, BookOpen } from "lucide-react";

export default function PlantDetail() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data: plant, isLoading, isError } = useGetPlant(id, { query: { enabled: !!id, queryKey: getGetPlantQueryKey(id) } });

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-square bg-muted rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-2/3" />
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (isError || !plant) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-24 text-center">
          <Leaf className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-serif font-bold mb-4">Plant not found</h2>
          <p className="text-muted-foreground mb-6">This plant may have been removed from our catalogue.</p>
          <Link href="/plants"><Button>Browse All Plants</Button></Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        <Link href="/plants">
          <Button variant="ghost" className="mb-8 gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to Plants
          </Button>
        </Link>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-emerald-50 border border-border shadow-sm">
            {plant.imageUrl ? (
              <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Leaf className="w-24 h-24 text-emerald-200" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              {plant.categoryName && (
                <Badge className="mb-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {plant.categoryName}
                </Badge>
              )}
              {plant.featured && (
                <Badge variant="secondary" className="mb-3 ml-2">Featured</Badge>
              )}
              <h1 className="text-4xl font-serif font-bold text-foreground">{plant.name}</h1>
              {plant.price && (
                <p className="text-3xl font-bold text-emerald-600 mt-3">{plant.price}</p>
              )}
            </div>

            {plant.description && (
              <p className="text-muted-foreground leading-relaxed text-base">{plant.description}</p>
            )}

            {/* Quick care stats */}
            {(plant.sunlight || plant.water) && (
              <div className="grid grid-cols-2 gap-4">
                {plant.sunlight && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40">
                    <Sun className="w-5 h-5 text-amber-500" />
                    <div>
                      <div className="text-xs text-muted-foreground">Sunlight</div>
                      <div className="text-sm font-medium">{plant.sunlight}</div>
                    </div>
                  </div>
                )}
                {plant.water && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="text-xs text-muted-foreground">Watering</div>
                      <div className="text-sm font-medium">{plant.water}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {plant.careInstructions && (
              <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">Care Instructions</h3>
                </div>
                <p className="text-emerald-700 dark:text-emerald-300 text-sm leading-relaxed">{plant.careInstructions}</p>
              </div>
            )}

            <div className="flex gap-4 pt-2">
              <Link href="/contact">
                <Button className="rounded-full px-8 bg-emerald-600 hover:bg-emerald-500">
                  Enquire Now
                </Button>
              </Link>
              <Link href="/plants">
                <Button variant="outline" className="rounded-full px-8">
                  Browse More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
