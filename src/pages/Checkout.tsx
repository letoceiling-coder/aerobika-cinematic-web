import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, deliveryType, discount, clearCart, closeCart } = useCart();
  const deliveryCost = deliveryType === "paid" ? 500 : 0;
  const finalTotal = totalPrice + deliveryCost - discount;

  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const canSubmit = address.trim() && name.trim() && contact.trim() && items.length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);

    // Simulate order submission
    await new Promise((r) => setTimeout(r, 1200));

    clearCart();
    closeCart();
    setOrderConfirmed(true);
    setIsSubmitting(false);
  };

  if (items.length === 0 && !orderConfirmed) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <div className="pt-20 container mx-auto px-4 max-w-lg">
        <AnimatePresence mode="wait">
          {!orderConfirmed ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 py-6"
            >
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Назад</span>
              </button>

              <h1 className="text-2xl font-bold text-foreground">Оформление заказа</h1>

              {/* Order summary */}
              <div className="glass-card rounded-xl p-4 border border-border/30 space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-foreground">
                      {item.name} ({item.volume}) ×{item.quantity}
                    </span>
                    <span className="text-muted-foreground whitespace-nowrap">
                      {(item.price * item.quantity).toLocaleString()} ₽
                    </span>
                  </div>
                ))}
                <div className="border-t border-border/50 pt-2 flex justify-between font-bold">
                  <span className="text-foreground">Итого</span>
                  <span className="gold-text">{finalTotal.toLocaleString()} ₽</span>
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-3">
                <div className="glass-card rounded-xl p-4 border border-border/30">
                  <label className="text-sm text-muted-foreground mb-2 block">Адрес доставки</label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Улица, дом, квартира"
                    className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground border-none outline-none focus:ring-2 focus:ring-primary transition-shadow"
                  />
                </div>

                <div className="glass-card rounded-xl p-4 border border-border/30">
                  <label className="text-sm text-muted-foreground mb-2 block">Имя</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя"
                    className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground border-none outline-none focus:ring-2 focus:ring-primary transition-shadow"
                  />
                </div>

                <div className="glass-card rounded-xl p-4 border border-border/30">
                  <label className="text-sm text-muted-foreground mb-2 block">Телефон или Telegram</label>
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="+7... или @username"
                    className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground border-none outline-none focus:ring-2 focus:ring-primary transition-shadow"
                  />
                </div>
              </div>

              <Button
                variant="gold"
                size="xl"
                className="w-full shadow-lg shadow-primary/25"
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? "Отправка..." : "Подтвердить заказ"}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center py-20 space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
              >
                <CheckCircle className="w-20 h-20 text-accent" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground">Заказ принят!</h2>
              <p className="text-muted-foreground">Мы свяжемся с вами в Telegram.</p>
              <div className="flex flex-col gap-3 w-full max-w-xs">
                <a
                  href="https://t.me/n2o_support"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="gold" size="xl" className="w-full shadow-lg shadow-primary/25 flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Связаться в Telegram
                  </Button>
                </a>
                <Button
                  variant="goldOutline"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate("/")}
                >
                  На главную
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <MobileNav />
    </div>
  );
};

export default Checkout;
