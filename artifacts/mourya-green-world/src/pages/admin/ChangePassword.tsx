import { useChangeAdminPassword } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";
import { KeyRound, Shield } from "lucide-react";

const schema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function AdminChangePassword() {
  const { toast } = useToast();
  const changeMutation = useChangeAdminPassword();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    changeMutation.mutate(
      { data: { currentPassword: values.currentPassword, newPassword: values.newPassword } },
      {
        onSuccess: () => {
          toast({ title: "Password changed successfully", description: "Your admin password has been updated." });
          form.reset();
        },
        onError: () => {
          toast({ title: "Failed to change password", description: "Current password may be incorrect.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-lg space-y-6">
        <h1 className="text-3xl font-serif font-bold">Change Password</h1>

        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-5 flex gap-3">
          <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 dark:text-amber-200">
            <p className="font-medium mb-1">Security Reminder</p>
            <p className="text-amber-700 dark:text-amber-300">Use a strong password with uppercase letters, numbers, and special characters.</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Update Admin Password</h2>
              <p className="text-sm text-muted-foreground">Enter your current password to set a new one</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="currentPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl><Input type="password" data-testid="input-current-password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="newPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl><Input type="password" data-testid="input-new-password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl><Input type="password" data-testid="input-confirm-password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full mt-2" disabled={changeMutation.isPending} data-testid="button-change-password">
                {changeMutation.isPending ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
}
