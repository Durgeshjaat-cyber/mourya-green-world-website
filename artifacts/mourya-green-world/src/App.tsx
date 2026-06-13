import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Plants from "@/pages/Plants";
import PlantDetail from "@/pages/PlantDetail";
import Gallery from "@/pages/Gallery";
import Contact from "@/pages/Contact";
import About from "@/pages/About";

import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminPlants from "@/pages/admin/Plants";
import AdminCategories from "@/pages/admin/Categories";
import AdminGallery from "@/pages/admin/Gallery";
import AdminInquiries from "@/pages/admin/Inquiries";
import AdminSettings from "@/pages/admin/Settings";
import AdminChangePassword from "@/pages/admin/ChangePassword";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/plants" component={Plants} />
      <Route path="/plants/:id" component={PlantDetail} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/contact" component={Contact} />
      <Route path="/about" component={About} />

      {/* Admin Routes — completely hidden from public */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/plants" component={AdminPlants} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/gallery" component={AdminGallery} />
      <Route path="/admin/inquiries" component={AdminInquiries} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/change-password" component={AdminChangePassword} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
