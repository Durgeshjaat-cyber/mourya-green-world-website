import { useState } from "react";
import { Link } from "wouter";
import { useListPlants, useListCategories, getListPlantsQueryKey } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Leaf, Search, SlidersHorizontal, Sun, Droplets } from "lucide-react";

export default function Plants() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const { data: plants = [], isLoading } = useListPlants(
    { search: search || undefined, categoryId: selectedCategory },
    { query: { queryKey: getListPlantsQueryKey({ search: search || undefined, categoryId: selectedCategory }) } }
  );
  const { data: categories = [] } = useListCategories();

  return (
    <PublicLayout>
      {/* Header */}
      <section className="py-16 bg-gradient-to-b from-emerald-50 dark:from-emerald-950/30 to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            Our Collection
          </Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Our Plants</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">Explore our wide collection of premium plants for every space and occasion</p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search plants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-testid="input-search-plants"
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Category:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === undefined ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(undefined)}
                className="rounded-full"
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id === selectedCategory ? undefined : cat.id)}
                  className="rounded-full"
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Plant Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl overflow-hidden border border-border">
                  <div className="aspect-square bg-muted" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : plants.length === 0 ? (
            <div className="text-center py-20">
              <Leaf className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No plants found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">{plants.length} plant{plants.length !== 1 ? "s" : ""} found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {plants.map((plant) => (
                  <Link key={plant.id} href={`/plants/${plant.id}`}>
                    <Card className="group overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-border/50 h-full" data-testid={`card-plant-${plant.id}`}>
                      <div className="aspect-square overflow-hidden bg-emerald-50">
                        {plant.imageUrl ? (
                          <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Leaf className="w-16 h-16 text-emerald-200" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{plant.name}</h3>
                          {plant.price && <span className="text-emerald-600 font-bold">{plant.price}</span>}
                        </div>
                        {plant.categoryName && (
                          <Badge variant="secondary" className="text-xs">{plant.categoryName}</Badge>
                        )}
                        {(plant.sunlight || plant.water) && (
                          <div className="flex gap-3 mt-2">
                            {plant.sunlight && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Sun className="w-3 h-3" /> {plant.sunlight}
                              </span>
                            )}
                            {plant.water && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Droplets className="w-3 h-3" /> {plant.water}
                              </span>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
