import { useState } from "react";
import { useListInquiries, useUpdateInquiry, useDeleteInquiry, getListInquiriesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trash2, MailOpen, Mail, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import type { Inquiry } from "@workspace/api-client-react";

export default function AdminInquiries() {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const params = filter === "unread" ? { read: false } : filter === "read" ? { read: true } : {};
  const { data: inquiries = [], isLoading } = useListInquiries(params, {
    query: { queryKey: getListInquiriesQueryKey(params) },
  });

  const updateMutation = useUpdateInquiry();
  const deleteMutation = useDeleteInquiry();

  const toggleRead = (inq: Inquiry) => {
    updateMutation.mutate(
      { id: inq.id, data: { read: !inq.read } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListInquiriesQueryKey({}) });
          queryClient.invalidateQueries({ queryKey: getListInquiriesQueryKey({ read: false }) });
          queryClient.invalidateQueries({ queryKey: getListInquiriesQueryKey({ read: true }) });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this inquiry?")) return;
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListInquiriesQueryKey({}) });
          queryClient.invalidateQueries({ queryKey: getListInquiriesQueryKey({ read: false }) });
          toast({ title: "Inquiry deleted" });
        },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      }
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-serif font-bold">Customer Inquiries</h1>
          <div className="flex gap-2">
            {(["all", "unread", "read"] as const).map((f) => (
              <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">
                {f}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-28 bg-muted animate-pulse rounded-xl" />)}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-16 border rounded-xl">
            <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No {filter !== "all" ? filter : ""} inquiries.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className={`bg-card border rounded-xl p-5 transition-colors ${!inq.read ? "border-primary/30 bg-primary/5" : "border-border"}`}
                data-testid={`card-inquiry-${inq.id}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="font-semibold text-foreground">{inq.name}</h3>
                      {!inq.read && <Badge className="text-xs bg-primary/20 text-primary border-primary/30">New</Badge>}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 flex-wrap">
                      <span>{inq.email}</span>
                      {inq.phone && <span>{inq.phone}</span>}
                      <span>{format(new Date(inq.createdAt), "PPp")}</span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{inq.message}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => toggleRead(inq)}
                      title={inq.read ? "Mark as unread" : "Mark as read"}
                    >
                      {inq.read ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5 text-primary" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(inq.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
