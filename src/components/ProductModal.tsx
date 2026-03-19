import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { apiService, type Product } from "@/lib/api";
import cylinder5l from "@/assets/cylinder-5l.png";
import cylinder10l from "@/assets/cylinder-10l.png";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Volume = "5л" | "10л";
type PurchaseType = "purchase" | "exchange";

const ease = [0.4, 0, 0.2, 1] as const;

const ProductModal = ({ isOpen, onClose }: ProductModalProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVolume, setSelectedVolume] = useState<Volume>("5л");
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("purchase");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    if (isOpen) {
      loadProduct();
    }
  }, [isOpen]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const products = await apiService.getProducts();
      if (products.length > 0) {
        const activeProduct = products.find(p => p.isActive) || products[0];
        setProduct(activeProduct);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPrice = (): number => {
    if (!product) return 0;
    
    if (purchaseType === "exchange") {
      if (selectedVolume === "5л") {
        return product.exchangePrice5l || product.price5l;
      } else {
        return product.exchangePrice10l || product.price10l;
      }
    } else {
      return selectedVolume === "5л" ? product.price5l : product.price10l;
    }
  };

  const currentPrice = getCurrentPrice();
  const currentImage = product?.imageUrl || (selectedVolume === "5л" ? cylinder5l : cylinder10l);

  const handleBuy = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${selectedVolume}-${purchaseType}-${Date.now()}-${i}`,
        name: product.name,
        volume: selectedVolume,
        type: purchaseType,
        price: currentPrice,
        image: currentImage,
      });
    }
    onClose();
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
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: "100%", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: "100%", scale: 0.95 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-50"
          >
            <div className="bg-card rounded-t-2xl md:rounded-2xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto border border-border/50">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h2 className="text-lg font-bold text-foreground">N₂O Баллон</h2>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>

              {loading ? (
                <div className="p-8 text-center text-muted-foreground">Загрузка...</div>
              ) : !product ? (
                <div className="p-8 text-center text-muted-foreground">Товар не найден</div>
              ) : (
                <>
                  {/* Image */}
                  <div className="flex justify-center p-8 bg-gradient-to-b from-secondary/30 to-transparent">
                    <motion.img
                      key={selectedVolume}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease }}
                      src={currentImage}
                      alt={product.name}
                      className="w-44 h-60 object-contain drop-shadow-lg"
                    />
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Volume Selector */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-3 block">Объём</label>
                      <div className="grid grid-cols-2 gap-3">
                        {(["5л", "10л"] as Volume[]).map((vol) => {
                          const volPrice = vol === "5л" 
                            ? (purchaseType === "exchange" ? (product.exchangePrice5l || product.price5l) : product.price5l)
                            : (purchaseType === "exchange" ? (product.exchangePrice10l || product.price10l) : product.price10l);
                          return (
                            <motion.button
                              key={vol}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setSelectedVolume(vol)}
                              className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                                selectedVolume === vol
                                  ? "border-primary gold-glow bg-primary/10"
                                  : "border-border hover:border-muted-foreground"
                              }`}
                            >
                              <div className="font-bold text-foreground">{vol}</div>
                              <div className="text-sm text-muted-foreground">{volPrice.toLocaleString()} ₽</div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Purchase Type */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-3 block">Тип</label>
                      <div className="grid grid-cols-2 gap-3">
                        {([
                          { id: "purchase" as const, label: "Покупка" },
                          { id: "exchange" as const, label: "Обмен" }
                        ]).map((t) => (
                          <motion.button
                            key={t.id}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setPurchaseType(t.id)}
                            className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                              purchaseType === t.id
                                ? "border-primary gold-glow bg-primary/10"
                                : "border-border hover:border-muted-foreground"
                            }`}
                          >
                            <div className="font-semibold text-foreground text-sm">{t.label}</div>
                            {t.id === "exchange" && product.exchangePrice5l && (
                              <div className="text-xs text-accent mt-1">
                                {selectedVolume === "5л" 
                                  ? `-${(product.price5l - product.exchangePrice5l).toLocaleString()} ₽`
                                  : product.exchangePrice10l 
                                    ? `-${(product.price10l - product.exchangePrice10l).toLocaleString()} ₽`
                                    : ""
                                }
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                {/* Quantity */}
                <div>
                  <label className="text-sm text-muted-foreground mb-3 block">Количество</label>
                  <div className="flex items-center justify-center gap-6">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 rounded-xl border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Minus className="w-5 h-5 text-foreground" />
                    </motion.button>
                    <span className="text-2xl font-bold text-foreground w-12 text-center">{quantity}</span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 rounded-xl border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Plus className="w-5 h-5 text-foreground" />
                    </motion.button>
                  </div>
                </div>
              </div>

                    {/* Sticky CTA */}
                    <div className="sticky bottom-0 p-4 border-t border-border/50 bg-card">
                      <Button variant="gold" size="xl" className="w-full shadow-lg shadow-primary/25" onClick={handleBuy}>
                        Купить сейчас · {(currentPrice * quantity).toLocaleString()} ₽
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
