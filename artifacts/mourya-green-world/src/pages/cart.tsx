import { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = `Cart (${cartCount}) — Mourya Green World`;
  }, [cartCount]);

  const waMsg = encodeURIComponent(
    `Hi! I would like to order the following plants:\n${items.map(i => `• ${i.name} x${i.quantity} — ₹${i.price * i.quantity}`).join('\n')}\n\nTotal: ₹${cartTotal}\n\nPlease confirm availability and delivery.`
  );

  return (
    <main className="min-h-screen bg-background pb-16">
      <div className="container mx-auto px-4 max-w-4xl pt-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setLocation('/shop')} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </button>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8">
          Your Cart {cartCount > 0 && <span className="text-primary">({cartCount})</span>}
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Add some beautiful plants to get started!</p>
            <Button onClick={() => setLocation('/shop')} className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">
              Shop Plants <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Items */}
            <div className="md:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    className="bg-card border border-card-border rounded-2xl p-4 flex gap-4 items-center"
                    data-testid={`row-cart-${item.id}`}
                  >
                    <div className="w-20 h-20 rounded-xl bg-emerald-50 flex items-center justify-center text-4xl shrink-0">
                      🌿
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.id}`}>
                        <p className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">{item.name}</p>
                      </Link>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                      <p className="font-bold text-primary mt-1">₹{item.price} each</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        data-testid={`button-dec-${item.id}`}
                        onClick={() => item.quantity === 1 ? removeFromCart(item.id) : updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                      <button
                        data-testid={`button-inc-${item.id}`}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="font-bold text-foreground">₹{item.price * item.quantity}</p>
                      <button
                        data-testid={`button-remove-${item.id}`}
                        onClick={() => removeFromCart(item.id)}
                        className="text-destructive hover:text-destructive/70 transition-colors mt-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                data-testid="button-clear-cart"
                onClick={clearCart}
                className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear cart
              </button>
            </div>

            {/* Summary */}
            <div>
              <div className="bg-card border border-card-border rounded-2xl p-6 sticky top-24">
                <h2 className="font-semibold text-foreground text-lg mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal ({cartCount} items)</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Delivery</span>
                    <span className="text-primary font-medium">Free in Noida</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-bold text-foreground">
                    <span>Total</span>
                    <span className="text-primary text-xl">₹{cartTotal}</span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/919876543210?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="button-checkout-whatsapp"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1da851] text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg mb-3"
                >
                  <FaWhatsapp className="h-5 w-5" />
                  Order via WhatsApp
                </a>

                <p className="text-xs text-muted-foreground text-center">
                  Your order details will be sent to our WhatsApp. We will confirm within 2 hours.
                </p>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    Free delivery in Noida · Secure ordering · 48hr replacement guarantee
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
