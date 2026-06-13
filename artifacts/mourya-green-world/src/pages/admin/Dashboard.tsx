import { useGetDashboardStats, useGetRecentActivity } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Leaf, FolderTree, Image as ImageIcon, MessageSquare, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: activity, isLoading: activityLoading } = useGetRecentActivity();

  if (statsLoading || activityLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted rounded"></div>)}
          </div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { title: "Total Plants", value: stats?.totalPlants || 0, icon: Leaf, color: "text-green-600" },
    { title: "Categories", value: stats?.totalCategories || 0, icon: FolderTree, color: "text-amber-600" },
    { title: "Gallery Images", value: stats?.totalGalleryImages || 0, icon: ImageIcon, color: "text-blue-600" },
    { title: "Unread Inquiries", value: stats?.unreadInquiries || 0, icon: MessageSquare, color: "text-red-600", alert: (stats?.unreadInquiries || 0) > 0 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    {stat.value}
                    {stat.alert && <AlertCircle className="w-4 h-4 text-destructive" />}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activity && activity.length > 0 ? (
              <div className="space-y-4">
                {activity.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 p-3 hover:bg-muted/50 rounded-lg transition-colors border">
                    <div className="bg-primary/10 p-2 rounded-full mt-1">
                      {item.type === 'inquiry' ? <MessageSquare className="w-4 h-4 text-primary" /> : <Leaf className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.message}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(item.createdAt), 'PPp')}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent activity.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
