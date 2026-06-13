import { useState } from "react";
import { useListPlants, useDeletePlant, useCreatePlant, useUpdatePlant, useListCategories, getListPlantsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plus, Edit2, Trash2, Search, Star, Leaf } from "lucide-react";
import type { Plant, PlantInput } from "@workspace/api-client-react";

const plantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.string().optional(),
  imageUrl: z.string().optional(),
  categoryId: z.coerce.number().optional(),
  featured: z.boolean().default(false),
  careInstructions: z.string().optional(),
  sunlight: z.string().optional(),
  water: z.string().optional(),
});

export default function AdminPlants() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: plants = [], isLoading } = useListPlants({ query: { queryKey: getListPlantsQueryKey({ search }) } });
  const { data: categories = [] } = useListCategories();
  
  const createMutation = useCreatePlant();
  const updateMutation = useUpdatePlant();
  const deleteMutation = useDeletePlant();

  const form = useForm<z.infer<typeof plantSchema>>({
    resolver: zodResolver(plantSchema),
    defaultValues: {
      name: "", description: "", price: "", imageUrl: "", featured: false, careInstructions: "", sunlight: "", water: ""
    },
  });

  const openEdit = (plant: Plant) => {
    setEditingPlant(plant);
    form.reset({
      name: plant.name,
      description: plant.description || "",
      price: plant.price || "",
      imageUrl: plant.imageUrl || "",
      categoryId: plant.categoryId || undefined,
      featured: plant.featured,
      careInstructions: plant.careInstructions || "",
      sunlight: plant.sunlight || "",
      water: plant.water || "",
    });
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingPlant(null);
    form.reset({
      name: "", description: "", price: "", imageUrl: "", featured: false, careInstructions: "", sunlight: "", water: ""
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (values: z.infer<typeof plantSchema>) => {
    if (editingPlant) {
      updateMutation.mutate(
        { id: editingPlant.id, data: values },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListPlantsQueryKey({}) });
            toast({ title: "Plant updated" });
            setIsDialogOpen(false);
          }
        }
      );
    } else {
      createMutation.mutate(
        { data: values as PlantInput },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListPlantsQueryKey({}) });
            toast({ title: "Plant created" });
            setIsDialogOpen(false);
          }
        }
      );
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this plant?")) {
      deleteMutation.mutate(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListPlantsQueryKey({}) });
            toast({ title: "Plant deleted" });
          }
        }
      );
    }
  };

  const toggleFeatured = (plant: Plant) => {
    updateMutation.mutate(
      { id: plant.id, data: { featured: !plant.featured } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListPlantsQueryKey({}) });
        }
      }
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-serif font-bold text-foreground">Plants Inventory</h1>
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" /> Add Plant
          </Button>
        </div>

        <div className="flex items-center gap-2 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search plants..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        <div className="bg-card rounded-md border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-[100px] text-center">Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : plants.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No plants found.</TableCell></TableRow>
              ) : (
                plants.map((plant) => (
                  <TableRow key={plant.id}>
                    <TableCell>
                      <div className="w-10 h-10 rounded overflow-hidden bg-muted flex items-center justify-center">
                        {plant.imageUrl ? (
                          <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover" />
                        ) : (
                          <Leaf className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{plant.name}</TableCell>
                    <TableCell>{plant.categoryName || "-"}</TableCell>
                    <TableCell>{plant.price || "-"}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" onClick={() => toggleFeatured(plant)} className={plant.featured ? "text-amber-500" : "text-muted-foreground"}>
                        <Star className={`w-4 h-4 ${plant.featured ? "fill-current" : ""}`} />
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => openEdit(plant)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(plant.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPlant ? "Edit Plant" : "Add New Plant"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="categoryId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select value={field.value?.toString() || ""} onValueChange={(val) => field.onChange(val ? Number(val) : undefined)}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Price</FormLabel><FormControl><Input placeholder="e.g. ₹499" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="sunlight" render={({ field }) => (
                    <FormItem><FormLabel>Sunlight</FormLabel><FormControl><Input placeholder="e.g. Bright indirect light" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="water" render={({ field }) => (
                    <FormItem><FormLabel>Water</FormLabel><FormControl><Input placeholder="e.g. Once a week" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="careInstructions" render={({ field }) => (
                  <FormItem><FormLabel>Care Instructions (Detailed)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="featured" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured Plant</FormLabel>
                      <div className="text-sm text-muted-foreground">Show this plant on the homepage hero/featured section</div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )} />

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingPlant ? "Update Plant" : "Create Plant"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
