import { Link, useLocation } from "wouter";
import { useGetAdminMe, useAdminLogout } from "@workspace/api-client-react";
import { LayoutDashboard, Leaf, FolderTree, Image as ImageIcon, MessageSquare, Settings, KeyRound, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: admin, isLoading, isError } = useGetAdminMe({ query: { retry: false } });
  const logout = useAdminLogout();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !admin) {
    setLocation("/admin/login");
    return null;
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/plants", label: "Plants", icon: Leaf },
    { href: "/admin/categories", label: "Categories", icon: FolderTree },
    { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
    { href: "/admin/settings", label: "Settings", icon: Settings },
    { href: "/admin/change-password", label: "Security", icon: KeyRound },
  ];

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-64 bg-card border-r flex flex-col md:min-h-screen shrink-0 sticky top-0">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="font-serif font-semibold text-lg tracking-tight">Admin Panel</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location === item.href || (item.href !== "/admin" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                  <Icon className="w-4 h-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <div className="mb-4 px-2 text-xs text-muted-foreground truncate">{admin.email}</div>
          <Button 
            variant="outline" 
            className="w-full justify-start text-muted-foreground" 
            onClick={() => {
              logout.mutate(undefined, {
                onSuccess: () => setLocation("/admin/login")
              });
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
