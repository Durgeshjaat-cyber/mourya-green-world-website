import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AdminProvider, useAdmin } from "@/contexts/AdminContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { AdminLayout } from "@/components/admin/AdminLayout";

// Public pages
import Home from "@/pages/home";
import Shop from "@/pages/shop";
import ProductDetail from "@/pages/product-detail";
import About from "@/pages/about";
import Gallery from "@/pages/gallery";
import Blog from "@/pages/blog";
import BlogDetail from "@/pages/blog-detail";
import Contact from "@/pages/contact";
import Cart from "@/pages/cart";
import Wishlist from "@/pages/wishlist";
import Inquiry from "@/pages/inquiry";
import NotFound from "@/pages/not-found";

// Admin pages
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import ProductForm from "@/pages/admin/ProductForm";
import AdminCategories from "@/pages/admin/Categories";
import AdminSettings from "@/pages/admin/Settings";
import AdminReviews from "@/pages/admin/Reviews";

const queryClient = new QueryClient();

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdmin();
  if (!isAuthenticated) return <Redirect to="/admin/login" />;
  return <AdminLayout>{children}</AdminLayout>;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <Switch>
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/products/new">
          <ProtectedAdminRoute><ProductForm /></ProtectedAdminRoute>
        </Route>
        <Route path="/admin/products/:id/edit">
          <ProtectedAdminRoute><ProductForm /></ProtectedAdminRoute>
        </Route>
        <Route path="/admin/products">
          <ProtectedAdminRoute><AdminProducts /></ProtectedAdminRoute>
        </Route>
        <Route path="/admin/categories">
          <ProtectedAdminRoute><AdminCategories /></ProtectedAdminRoute>
        </Route>
        <Route path="/admin/reviews">
          <ProtectedAdminRoute><AdminReviews /></ProtectedAdminRoute>
        </Route>
        <Route path="/admin/settings">
          <ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>
        </Route>
        <Route path="/admin">
          <ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>
        </Route>
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <PublicLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/shop" component={Shop} />
        <Route path="/product/:id" component={ProductDetail} />
        <Route path="/about" component={About} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogDetail} />
        <Route path="/contact" component={Contact} />
        <Route path="/cart" component={Cart} />
        <Route path="/wishlist" component={Wishlist} />
        <Route path="/inquiry" component={Inquiry} />
        <Route component={NotFound} />
      </Switch>
    </PublicLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
        <CartProvider>
          <WishlistProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </WishlistProvider>
        </CartProvider>
      </AdminProvider>
    </QueryClientProvider>
  );
}

export default App;
