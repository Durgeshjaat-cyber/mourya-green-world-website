import { useState } from "react";
import { useListGallery, useAddGalleryImage, useDeleteGalleryImage, getListGalleryQueryKey } from "@workspace/api-client-react";
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
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";

const schema = z.object({
  imageUrl: z.string().min(1, "Image URL is required"),
  caption: z.string().optional(),
});

export default function AdminGallery() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: images = [], isLoading } = useListGallery();
  const addMutation = useAddGalleryImage();
  const deleteMutation = useDeleteGalleryImage();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { imageUrl: "", caption: "" },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    addMutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() });
          toast({ title: "Image added" });
          setOpen(false);
          form.reset();
        },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this image?")) return;
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() });
          toast({ title: "Image deleted" });
        },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      }
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-serif font-bold">Gallery</h1>
          <Button onClick={() => { form.reset(); setOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Add Image
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-square bg-muted animate-pulse rounded-xl" />)}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-16 border rounded-xl">
            <ImageIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No gallery images yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden border border-border" data-testid={`img-admin-gallery-${img.id}`}>
                <img src={img.imageUrl} alt={img.caption || ""} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(img.id)}
                    className="w-9 h-9 rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 line-clamp-1">
                    {img.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Gallery Image</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="caption" render={({ field }) => (
                <FormItem><FormLabel>Caption (optional)</FormLabel><FormControl><Input placeholder="Beautiful garden view..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              {form.watch("imageUrl") && (
                <div className="aspect-video rounded-lg overflow-hidden bg-muted border">
                  <img src={form.watch("imageUrl")} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={addMutation.isPending}>Add Image</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
