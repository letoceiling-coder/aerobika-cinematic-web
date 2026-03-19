import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { apiService } from "@/lib/api";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, deliveryType, discount, clearCart, closeCart } = useCart();
  // Delivery cost will be calculated by backend
  // This is just for display
  const estimatedDeliveryCost = deliveryType === "paid" ? 500 : 0;
  const finalTotal = totalPrice + estimatedDeliveryCost - discount;

  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const canSubmit = address.trim() && name.trim() && contact.trim() && items.length > 0;

  const handleSubmit = async () => {
    console.log('🔘 handleSubmit called');
    console.log('📋 canSubmit:', canSubmit);
    console.log('📦 items:', items);
    console.log('📍 address:', address);
    console.log('👤 name:', name);
    console.log('📞 contact:', contact);
    
    if (!canSubmit) {
      console.warn('⚠️ Cannot submit: validation failed');
      return;
    }
    
    console.log('✅ Validation passed, starting submission...');
    setIsSubmitting(true);

    try {
      console.log('📤 Calling apiService.createOrder...');
      
      // Send order to backend
      const result = await apiService.createOrder({
        items: items.map(item => ({
          name: item.name,
          volume: item.volume,
          type: item.type,
          price: item.price,
          quantity: item.quantity,
        })),
        address,
        name,
        phone: contact,
        deliveryType,
      });

      console.log('📥 createOrder result:', result);

      if (result && result.success) {
        console.log('✅ Order created successfully, clearing cart...');
        
        const initData = typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initData;
        
        // Save address to localStorage if provided
        if (address && address.trim()) {
          if (initData) {
            // Mini App: save address with user telegramId
            const user = await apiService.getUser();
            if (user) {
              const savedAddresses = JSON.parse(localStorage.getItem(`addresses_${user.telegramId}`) || '[]');
              const newAddr = {
                id: Date.now().toString(),
                address: address.trim(),
              };
              // Check if address already exists
              if (!savedAddresses.find((a: any) => a.address === address.trim())) {
                savedAddresses.push(newAddr);
                localStorage.setItem(`addresses_${user.telegramId}`, JSON.stringify(savedAddresses));
                console.log('💾 Address saved to localStorage for Mini App');
              }
            }
          } else {
            // Web version: save address
            const savedAddresses = JSON.parse(localStorage.getItem('addresses_web') || '[]');
            const newAddr = {
              id: Date.now().toString(),
              address: address.trim(),
            };
            // Check if address already exists
            if (!savedAddresses.find((a: any) => a.address === address.trim())) {
              savedAddresses.push(newAddr);
              localStorage.setItem('addresses_web', JSON.stringify(savedAddresses));
              console.log('💾 Address saved to localStorage for web version');
            }
          }
        }
        
        // Save order to localStorage for web version
        if (!initData) {
          // Web version: save phone for future order loading
          if (contact) {
            localStorage.setItem('user_phone', contact);
            console.log('💾 Phone saved to localStorage:', contact);
          }
          
          // Web version: save order to localStorage
          const savedOrders = JSON.parse(localStorage.getItem('orders_web') || '[]');
          savedOrders.push({
            id: result.id,
            items: items.map(item => ({
              name: item.name,
              volume: item.volume,
              type: item.type,
              price: item.price,
              quantity: item.quantity,
            })),
            totalPrice: totalPrice,
            deliveryPrice: estimatedDeliveryCost,
            address,
            name,
            phone: contact,
            status: 'new',
            createdAt: new Date().toISOString(),
          });
          localStorage.setItem('orders_web', JSON.stringify(savedOrders));
          console.log('💾 Order saved to localStorage for web version');
        }
        
        clearCart();
        closeCart();
        setOrderConfirmed(true);
      } else {
        console.error('❌ Order creation returned invalid result:', result);
        alert('Ошибка при создании заказа. Попробуйте еще раз.');
      }
    } catch (error: any) {
      console.error('❌ Order creation failed:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      alert(error.message || 'Ошибка при создании заказа. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
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
                onClick={(e) => {
                  e.preventDefault();
                  console.log('🖱️ Button clicked!');
                  handleSubmit();
                }}
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
