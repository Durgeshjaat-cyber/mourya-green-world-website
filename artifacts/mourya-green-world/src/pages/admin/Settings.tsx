import { useGetSiteSettings, useUpdateSiteSettings, getGetSiteSettingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";
import { useEffect } from "react";
import { Save, Loader2 } from "lucide-react";

const schema = z.object({
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroBannerUrl: z.string().optional(),
  aboutText: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  service1Title: z.string().optional(),
  service1Desc: z.string().optional(),
  service2Title: z.string().optional(),
  service2Desc: z.string().optional(),
  service3Title: z.string().optional(),
  service3Desc: z.string().optional(),
  service4Title: z.string().optional(),
  service4Desc: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <h2 className="text-lg font-serif font-semibold border-b pb-3">{title}</h2>
      {children}
    </div>
  );
}

export default function AdminSettings() {
  const { data: settings, isLoading } = useGetSiteSettings();
  const updateMutation = useUpdateSiteSettings();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        heroTitle: settings.heroTitle || "",
        heroSubtitle: settings.heroSubtitle || "",
        heroBannerUrl: settings.heroBannerUrl || "",
        aboutText: settings.aboutText || "",
        phone: settings.phone || "",
        whatsapp: settings.whatsapp || "",
        email: settings.email || "",
        address: settings.address || "",
        service1Title: settings.service1Title || "",
        service1Desc: settings.service1Desc || "",
        service2Title: settings.service2Title || "",
        service2Desc: settings.service2Desc || "",
        service3Title: settings.service3Title || "",
        service3Desc: settings.service3Desc || "",
        service4Title: settings.service4Title || "",
        service4Desc: settings.service4Desc || "",
      });
    }
  }, [settings, form]);

  const onSubmit = (values: FormValues) => {
    updateMutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSiteSettingsQueryKey() });
          toast({ title: "Settings saved successfully" });
        },
        onError: () => toast({ title: "Failed to save", variant: "destructive" }),
      }
    );
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-serif font-bold">Site Settings</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Section title="Homepage Hero">
              <FormField control={form.control} name="heroTitle" render={({ field }) => (
                <FormItem><FormLabel>Hero Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="heroSubtitle" render={({ field }) => (
                <FormItem><FormLabel>Hero Subtitle</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="heroBannerUrl" render={({ field }) => (
                <FormItem><FormLabel>Hero Banner Image URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </Section>

            <Section title="About Us">
              <FormField control={form.control} name="aboutText" render={({ field }) => (
                <FormItem>
                  <FormLabel>About Text</FormLabel>
                  <FormControl>
                    <textarea {...field} rows={5} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </Section>

            <Section title="Contact Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+91 98765 43210" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="whatsapp" render={({ field }) => (
                  <FormItem><FormLabel>WhatsApp Number</FormLabel><FormControl><Input placeholder="+91 98765 43210" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </Section>

            <Section title="Services">
              {([1, 2, 3, 4] as const).map((num) => (
                <div key={num} className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <FormField control={form.control} name={`service${num}Title` as any} render={({ field }) => (
                    <FormItem><FormLabel>Service {num} Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name={`service${num}Desc` as any} render={({ field }) => (
                    <FormItem><FormLabel>Service {num} Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              ))}
            </Section>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={updateMutation.isPending} data-testid="button-save-settings" className="gap-2">
                <Save className="w-4 h-4" />
                {updateMutation.isPending ? "Saving..." : "Save All Settings"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
