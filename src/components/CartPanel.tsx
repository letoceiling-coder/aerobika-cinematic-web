import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, Truck, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { apiService } from "@/lib/api";
import { toast } from "sonner";

const ease = [0.4, 0, 0.2, 1] as const;

const CartPanel = () => {
  const {
    items, isOpen, closeCart, clearCart,
    updateQuantity, removeItem,
    totalPrice, deliveryType, setDeliveryType,
    promoCode, setPromoCode, discount,
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);
  const [address, setAddress] = useState("");
  const [telegram, setTelegram] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryCost = deliveryType === "paid" ? 500 : 0;
  const finalTotal = totalPrice + deliveryCost - discount;

  const handleOrder = async () => {
    // Validation
    if (items.length === 0) {
      toast.error('Корзина пуста');
      return;
    }

    if (!address.trim()) {
      toast.error('Укажите адрес доставки');
      return;
    }

    if (!telegram.trim()) {
      toast.error('Укажите Telegram для связи');
      return;
    }

    // Check if Telegram WebApp is available
    const initData = typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initData;
    if (!initData) {
      toast.error('Telegram WebApp не доступен. Откройте приложение через Telegram.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order items
      const orderItems = items.map(item => ({
        name: item.name,
        volume: item.volume,
        type: item.type,
        price: item.price,
        quantity: item.quantity,
      }));

      // Create order via API (initData will be added by apiService)
      const result = await apiService.createOrder({
        items: orderItems,
        address: address.trim(),
        deliveryType,
      });

      if (result && result.success) {
        toast.success(`Заказ #${result.id} успешно создан!`);
        
        // Clear cart and close panel
        clearCart();
        setAddress('');
        setTelegram('');
        setShowCheckout(false);
        closeCart();
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error: any) {
      console.error('Order creation error:', error);
      toast.error(error.message || 'Ошибка при создании заказа. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed right-0 top-0 bottom-0 w-full md:max-w-md bg-card border-l border-border/50 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <h2 className="text-lg font-bold text-foreground">Корзина</h2>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={closeCart}
                className="p-2 rounded-xl hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">Корзина пуста</div>
              ) : (
                <>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ ease }}
                      className="glass-card rounded-xl p-4 flex gap-4 border border-border/30"
                    >
                      <img src={item.image} alt={item.name} className="w-14 h-18 object-contain" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm truncate">{item.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {item.type === "exchange" ? "Обмен" : "Покупка"}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </motion.button>
                            <span className="font-semibold text-sm w-6 text-center">{item.quantity}</span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </motion.button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold gold-text text-sm inline-flex items-center gap-1 whitespace-nowrap">
                              <span className="flex-shrink-0">{(item.price * item.quantity).toLocaleString()}</span>
                              <span className="flex-shrink-0">₽</span>
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 hover:bg-destructive/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <AnimatePresence mode="wait">
                    {!showCheckout ? (
                      <motion.div
                        key="options"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                      >
                        {/* Delivery */}
                        <div className="glass-card rounded-xl p-4 border border-border/30">
                          <div className="flex items-center gap-2 mb-3">
                            <Truck className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold text-foreground">Доставка</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { type: "free" as const, label: "По Ростову", sub: "Бесплатно", subClass: "text-accent" },
                              { type: "paid" as const, label: "За пределами Ростова", sub: "от 500 ₽", subClass: "text-muted-foreground" },
                            ].map((d) => (
                              <motion.button
                                key={d.type}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setDeliveryType(d.type)}
                                className={`p-3 rounded-xl border-2 text-center transition-all duration-200 text-sm ${
                                  deliveryType === d.type ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground"
                                }`}
                              >
                                <div className="font-semibold text-foreground">{d.label}</div>
                                <div className={`text-xs ${d.subClass}`}>{d.sub}</div>
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Promo */}
                        <div className="glass-card rounded-xl p-4 border border-border/30">
                          <div className="flex items-center gap-2 mb-3">
                            <Tag className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold text-foreground">Промокод</span>
                          </div>
                          <div className="flex gap-2">
                            <input
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                              placeholder="Введите промокод"
                              className="flex-[7] min-w-0 bg-secondary rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground border-none outline-none focus:ring-2 focus:ring-primary transition-shadow"
                            />
                            <Button variant="gold" size="sm" className="flex-[3] shrink-0 rounded-xl text-xs font-semibold">
                              Применить
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="checkout"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease }}
                        className="space-y-3"
                      >
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
                          <label className="text-sm text-muted-foreground mb-2 block">Telegram</label>
                          <input
                            value={telegram}
                            onChange={(e) => setTelegram(e.target.value)}
                            placeholder="@username"
                            className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground border-none outline-none focus:ring-2 focus:ring-primary transition-shadow"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border/50 p-4 space-y-3 bg-card">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Товары</span>
                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                      <span className="flex-shrink-0">{totalPrice.toLocaleString()}</span>
                      <span className="flex-shrink-0">₽</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Доставка</span>
                    <span className={`inline-flex items-center gap-1 whitespace-nowrap ${deliveryCost === 0 ? "text-accent font-medium" : ""}`}>
                      {deliveryCost === 0 ? (
                        <span>Бесплатно</span>
                      ) : (
                        <>
                          <span className="flex-shrink-0">{deliveryCost.toLocaleString()}</span>
                          <span className="flex-shrink-0">₽</span>
                        </>
                      )}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-accent">
                      <span>Скидка</span>
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <span>-</span>
                        <span className="flex-shrink-0">{discount.toLocaleString()}</span>
                        <span className="flex-shrink-0">₽</span>
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-border/50">
                    <span className="text-foreground">Итого</span>
                    <span className="gold-text text-xl inline-flex items-center gap-1 whitespace-nowrap">
                      <span className="flex-shrink-0">{finalTotal.toLocaleString()}</span>
                      <span className="flex-shrink-0">₽</span>
                    </span>
                  </div>
                </div>
                {!showCheckout ? (
                  <Button
                    variant="gold"
                    size="xl"
                    className="w-full shadow-lg shadow-primary/25"
                    onClick={() => setShowCheckout(true)}
                  >
                    Оформить заказ
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="gold"
                      size="xl"
                      className="w-full shadow-lg shadow-primary/25"
                      onClick={handleOrder}
                      disabled={!address || !telegram || isSubmitting || items.length === 0}
                    >
                      {isSubmitting ? 'Создание заказа...' : 'Подтвердить заказ'}
                    </Button>
                    <Button variant="ghost" size="default" className="w-full text-muted-foreground" onClick={() => setShowCheckout(false)}>
                      Назад
                    </Button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartPanel;
