import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCart } from "@/contexts/CartContext";
import cylinder5l from "@/assets/cylinder-5l.png";
import cylinder10l from "@/assets/cylinder-10l.png";

type Volume = "5л" | "10л";
type PurchaseType = "purchase" | "exchange";

const PRICES: Record<Volume, number> = {
  "5л": 3500,
  "10л": 5500,
};

const ProductSection = () => {
  const { addItem, openCart } = useCart();
  const [selectedVolume, setSelectedVolume] = useState<Volume>("5л");
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("purchase");
  const [quantity, setQuantity] = useState(1);

  const currentPrice = PRICES[selectedVolume];
  const currentImage = selectedVolume === "5л" ? cylinder5l : cylinder10l;

  const handleBuyNow = () => {
    addItem({
      id: `${selectedVolume}-${purchaseType}-${Date.now()}`,
      name: "Пищевая закись азота",
      volume: selectedVolume,
      type: purchaseType,
      price: currentPrice,
      image: currentImage,
    });
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${selectedVolume}-${purchaseType}-${Date.now()}-${i}`,
        name: "Пищевая закись азота",
        volume: selectedVolume,
        type: purchaseType,
        price: currentPrice,
        image: currentImage,
      });
    }
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
    <section id="products" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gold-text">Наши продукты</span>
          </h2>
          <p className="text-muted-foreground text-lg">Выберите подходящий объём</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card rounded-2xl overflow-hidden border border-border/50">
            <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
              {/* Product Image */}
              <div className="relative flex items-center justify-center bg-gradient-to-b from-secondary/60 to-transparent rounded-xl p-6 md:p-8 overflow-hidden">
                <motion.img
                  key={selectedVolume}
                  src={currentImage}
                  alt="Пищевая закись азота"
                  className="w-full max-w-[180px] md:max-w-[200px] h-auto object-contain drop-shadow-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                />
                <div className="absolute top-4 right-4 flex items-center gap-1.5 glass-card rounded-full px-3 py-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs text-accent font-medium">Товар сертифицирован</span>
                </div>
              </div>

              {/* Product Details */}
              <div className="flex flex-col gap-6">
                {/* Title and Description */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Пищевая закись азота
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Высококачественный продукт для профессионального использования
                  </p>
                </div>

                {/* Volume Selector */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Объём</label>
                  <div className="flex gap-3 flex-wrap">
                    {(["5л", "10л"] as Volume[]).map((volume) => (
                      <motion.button
                        key={volume}
                        onClick={() => setSelectedVolume(volume)}
                        whileTap={{ scale: 0.97 }}
                        className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                          selectedVolume === volume
                            ? "gold-gradient text-primary-foreground gold-glow border-2 border-primary"
                            : "bg-secondary/80 text-muted-foreground border-2 border-transparent hover:bg-secondary"
                        }`}
                      >
                        {volume}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Purchase Type Selector */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Тип покупки</label>
                  <div className="glass-card p-1 rounded-lg inline-flex gap-1">
                    <ToggleGroup
                      type="single"
                      value={purchaseType}
                      onValueChange={(value) => value && setPurchaseType(value as PurchaseType)}
                      className="flex gap-1"
                    >
                      <ToggleGroupItem
                        value="purchase"
                        aria-label="Покупка"
                        className={`px-6 py-2.5 rounded-md font-medium text-sm transition-all duration-300 data-[state=on]:gold-gradient data-[state=on]:text-primary-foreground data-[state=off]:bg-transparent data-[state=off]:text-muted-foreground hover:data-[state=off]:text-foreground`}
                      >
                        Покупка
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="exchange"
                        aria-label="Обмен"
                        className={`px-6 py-2.5 rounded-md font-medium text-sm transition-all duration-300 data-[state=on]:gold-gradient data-[state=on]:text-primary-foreground data-[state=off]:bg-transparent data-[state=off]:text-muted-foreground hover:data-[state=off]:text-foreground`}
                      >
                        Обмен
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Количество</label>
                  <div className="flex items-center gap-4">
                    <motion.button
                      onClick={decrementQuantity}
                      whileTap={{ scale: quantity > 1 ? 0.97 : 1 }}
                      className={`w-10 h-10 rounded-lg glass-card flex items-center justify-center text-foreground transition-colors ${
                        quantity > 1 ? "hover:bg-secondary cursor-pointer" : "opacity-50 cursor-not-allowed"
                      }`}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                    <span className="text-xl font-bold text-foreground min-w-[3ch] text-center">
                      {quantity}
                    </span>
                    <motion.button
                      onClick={incrementQuantity}
                      whileTap={{ scale: 0.97 }}
                      className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Price */}
                <div className="pt-2 border-t border-border/50">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPrice}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-baseline gap-2"
                    >
                      <span className="text-3xl md:text-4xl font-bold gold-text">
                        {currentPrice.toLocaleString()} ₽
                      </span>
                      {quantity > 1 && (
                        <span className="text-muted-foreground text-sm">
                          ({(currentPrice * quantity).toLocaleString()} ₽ за {quantity} шт.)
                        </span>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    variant="gold"
                    size="lg"
                    onClick={handleBuyNow}
                    className="flex-1 shadow-lg shadow-primary/20"
                  >
                    Купить сейчас
                  </Button>
                  <Button
                    variant="goldOutline"
                    size="lg"
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    В корзину
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductSection;
