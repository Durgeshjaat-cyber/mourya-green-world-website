import { useState } from "react";
import { useListCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, getListCategoriesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Edit2, Trash2, FolderTree } from "lucide-react";
import type { Category } from "@workspace/api-client-react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export default function AdminCategories() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: categories = [], isLoading } = useListCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", imageUrl: "" },
  });

  const openCreate = () => {
    setEditing(null);
    form.reset({ name: "", description: "", imageUrl: "" });
    setOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    form.reset({ name: cat.name, description: cat.description || "", imageUrl: cat.imageUrl || "" });
    setOpen(true);
  };

  const onSubmit = (values: z.infer<typeof schema>) => {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: values },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
            toast({ title: "Category updated" });
            setOpen(false);
          },
          onError: () => toast({ title: "Error", variant: "destructive" }),
        }
      );
    } else {
      createMutation.mutate(
        { data: values },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
            toast({ title: "Category created" });
            setOpen(false);
          },
          onError: () => toast({ title: "Error", variant: "destructive" }),
        }
      );
    }
  };

  const handleDelete = (cat: Category) => {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    deleteMutation.mutate(
      { id: cat.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
          toast({ title: "Category deleted" });
        },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      }
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-serif font-bold">Categories</h1>
          <Button onClick={openCreate} data-testid="button-add-category">
            <Plus className="w-4 h-4 mr-2" /> Add Category
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 border rounded-xl">
            <FolderTree className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No categories yet. Add your first one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-card border border-border rounded-xl p-5 flex items-center justify-between hover:border-primary/30 transition-colors" data-testid={`card-category-${cat.id}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FolderTree className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{cat.name}</h3>
                    {cat.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{cat.description}</p>}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEdit(cat)}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={() => handleDelete(cat)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem><FormLabel>Image URL (optional)</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editing ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
