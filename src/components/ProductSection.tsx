import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCart } from "@/contexts/CartContext";
import { apiService, type Product } from "@/lib/api";
import { useContent } from "@/hooks/useContent";
import cylinder5l from "@/assets/cylinder-5l.png";
import cylinder10l from "@/assets/cylinder-10l.png";

type Volume = "5л" | "10л";
type PurchaseType = "purchase" | "exchange";
type ProductTab = "n2o" | "accessories";

const ProductSection = () => {
  const { addItem } = useCart();
  const { get } = useContent();
  const [activeTab, setActiveTab] = useState<ProductTab>("n2o");
  const [selectedVolume, setSelectedVolume] = useState<Volume>("5л");
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("purchase");
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedN2OProductId, setSelectedN2OProductId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const products = await apiService.getProducts();

      setProducts(products);

      // Prefer active N2O/cylinder product for the main tab, fallback to first product
      const n2oCandidates = products.filter((p) => (p.category || "").toLowerCase() === "n2o" || (p.productType || "cylinder") === "cylinder");
      const firstN2O = n2oCandidates.find((p) => p.isActive) || n2oCandidates[0] || products[0];
      if (firstN2O) {
        setSelectedN2OProductId(firstN2O.id);
      }
    } catch (error) {
      console.error('❌ Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryOf = (product: Product): ProductTab => {
    const category = (product.category || "").toLowerCase();
    if (category === "accessories" || product.productType === "accessory") {
      return "accessories";
    }
    return "n2o";
  };

  const n2oProducts = products.filter((p) => categoryOf(p) === "n2o");
  const accessoryProducts = products.filter((p) => categoryOf(p) === "accessories");
  const selectedN2OProduct = n2oProducts.find((p) => p.id === selectedN2OProductId) || n2oProducts[0] || null;
  const getCurrentPrice = (): number => {
    if (!selectedN2OProduct) {
      return 0;
    }
    
    const productType = selectedN2OProduct.productType || 'cylinder';
    
    // For non-cylinders, use universal price
    if (productType !== 'cylinder') {
      if (selectedN2OProduct.priceType === 'request') {
        return 0; // Will show "по запросу"
      }
      return selectedN2OProduct.price || 0;
    }
    
    // For cylinders, use volume-based pricing
    if (purchaseType === "exchange") {
      return selectedVolume === "5л"
        ? (selectedN2OProduct.exchangePrice5l ?? selectedN2OProduct.price5l ?? 0)
        : (selectedN2OProduct.exchangePrice10l ?? selectedN2OProduct.price10l ?? 0);
    }
    
    return selectedVolume === "5л"
      ? (selectedN2OProduct.price5l ?? 0)
      : (selectedN2OProduct.price10l ?? 0);
  };

  const currentPrice = getCurrentPrice();
  
  // Use imageUrl from API, fallback to imported images if not available
  const currentImage = selectedN2OProduct?.imageUrl || (selectedVolume === "5л" ? cylinder5l : cylinder10l) || '/placeholder.png';

  const handleBuyNow = () => {
    if (!selectedN2OProduct) return;
    const productType = selectedN2OProduct.productType || 'cylinder';
    const safeName = selectedN2OProduct.name || 'Товар';
    const safeImage = selectedN2OProduct.imageUrl || currentImage || '/placeholder.png';
    
    addItem({
      id: `${productType}-${selectedN2OProduct.id}-${Date.now()}`,
      name: safeName,
      volume: productType === 'cylinder' ? selectedVolume : undefined,
      type: purchaseType,
      price: currentPrice,
      image: safeImage,
      productType: productType as 'cylinder' | 'accessory' | 'other',
    });
  };

  const handleAddToCart = () => {
    if (!selectedN2OProduct) return;
    const productType = selectedN2OProduct.productType || 'cylinder';
    const safeName = selectedN2OProduct.name || 'Товар';
    const safeImage = selectedN2OProduct.imageUrl || currentImage || '/placeholder.png';
    
    // Add single item with quantity
    addItem({
      id: `${productType}-${selectedN2OProduct.id}-${Date.now()}`,
      name: safeName,
      volume: productType === 'cylinder' ? selectedVolume : undefined,
      type: purchaseType,
      price: currentPrice,
      image: safeImage,
      productType: productType as 'cylinder' | 'accessory' | 'other',
    });
    // Update quantity after adding
    for (let i = 1; i < quantity; i++) {
      addItem({
        id: `${productType}-${selectedN2OProduct.id}-${Date.now()}-${i}`,
        name: safeName,
        volume: productType === 'cylinder' ? selectedVolume : undefined,
        type: purchaseType,
        price: currentPrice,
        image: safeImage,
        productType: productType as 'cylinder' | 'accessory' | 'other',
      });
    }
  };

  if (loading) {
    return (
      <section id="products" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">Загрузка товаров...</div>
        </div>
      </section>
    );
  }

  if (activeTab === "n2o" && !selectedN2OProduct) {
    return (
      <section id="products" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">Товары не найдены</div>
        </div>
      </section>
    );
  }

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
                <span className="gold-text">{get('products_title', 'Наши продукты')}</span>
              </h2>
          <p className="text-muted-foreground text-lg">Выберите подходящий товар</p>
          <div className="mt-6 inline-flex rounded-lg border border-border/60 overflow-hidden">
            <button
              onClick={() => setActiveTab("n2o")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "n2o" ? "gold-gradient text-primary-foreground" : "bg-secondary/50 text-foreground"}`}
            >
              Закись азота
            </button>
            <button
              onClick={() => setActiveTab("accessories")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "accessories" ? "gold-gradient text-primary-foreground" : "bg-secondary/50 text-foreground"}`}
            >
              Аксессуары
            </button>
          </div>
        </motion.div>

        {activeTab === "n2o" && selectedN2OProduct && (
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
              <div className="relative flex items-center justify-center bg-gradient-to-b from-primary/10 via-secondary/60 to-transparent rounded-xl p-6 md:p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 rounded-xl" />
                <motion.img
                  key={selectedN2OProduct?.imageUrl || selectedVolume}
                  src={currentImage}
                  alt={selectedN2OProduct?.name || "Закись азота"}
                  className="relative z-10 w-full max-w-[180px] md:max-w-[200px] h-auto object-contain drop-shadow-[0_8px_24px_rgba(212,175,55,0.2)]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== '/placeholder.png') {
                      target.src = '/placeholder.png';
                    }
                  }}
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-col gap-6">
                {/* Title and Description */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {selectedN2OProduct.name || 'Товар'}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedN2OProduct.description || 'Высококачественный продукт для профессионального использования'}
                  </p>
                </div>

                {/* Volume Selector */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Объём</label>
                  <div className="flex gap-2 sm:gap-3 flex-wrap">
                    {(["5л", "10л"] as Volume[]).map((volume) => {
                      const volPrice = volume === "5л" 
                        ? (purchaseType === "exchange" ? (selectedN2OProduct.exchangePrice5l || selectedN2OProduct.price5l) : selectedN2OProduct.price5l)
                        : (purchaseType === "exchange" ? (selectedN2OProduct.exchangePrice10l || selectedN2OProduct.price10l) : selectedN2OProduct.price10l);
                      return (
                        <motion.button
                          key={volume}
                          onClick={() => {
                            setSelectedVolume(volume);
                          }}
                          whileTap={{ scale: 0.97 }}
                          className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold text-sm transition-all duration-300 min-w-[80px] ${
                            selectedVolume === volume
                              ? "gold-gradient text-primary-foreground gold-glow border-2 border-primary"
                              : "bg-secondary/80 text-muted-foreground border-2 border-transparent hover:bg-secondary"
                          }`}
                        >
                          {volume}
                          <span className="block text-xs mt-1 opacity-75">{volPrice.toLocaleString()} ₽</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Purchase Type Selector - Only show if exchange prices are available */}
                {(selectedN2OProduct.exchangePrice5l || selectedN2OProduct.exchangePrice10l) && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Тип покупки</label>
                    <div className="glass-card p-1 rounded-lg inline-flex max-w-full">
                      <ToggleGroup
                        type="single"
                        value={purchaseType}
                        onValueChange={(value) => {
                          if (value) {
                            setPurchaseType(value as PurchaseType);
                          }
                        }}
                        className="flex gap-1"
                      >
                        <ToggleGroupItem
                          value="purchase"
                          aria-label="Покупка"
                          className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-md font-medium text-sm min-w-[120px] transition-all duration-300 data-[state=on]:gold-gradient data-[state=on]:text-primary-foreground data-[state=off]:bg-transparent data-[state=off]:text-muted-foreground hover:data-[state=off]:text-foreground`}
                        >
                          Покупка
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="exchange"
                          aria-label="Обмен"
                          className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-md font-medium text-sm min-w-[120px] transition-all duration-300 data-[state=on]:gold-gradient data-[state=on]:text-primary-foreground data-[state=off]:bg-transparent data-[state=off]:text-muted-foreground hover:data-[state=off]:text-foreground`}
                        >
                          Обмен
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>
                )}

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
                      className="flex items-baseline gap-2 flex-wrap"
                    >
                      <span className="text-4xl md:text-5xl font-extrabold gold-text inline-flex items-center gap-1 whitespace-nowrap">
                        <span className="flex-shrink-0">{currentPrice.toLocaleString()}</span>
                        <span className="flex-shrink-0">₽</span>
                      </span>
                      {quantity > 1 && (
                        <span className="text-muted-foreground text-sm inline-flex items-center gap-1 whitespace-nowrap">
                          <span>(</span>
                          <span className="inline-flex items-center gap-1">
                            <span className="flex-shrink-0">{(currentPrice * quantity).toLocaleString()}</span>
                            <span className="flex-shrink-0">₽</span>
                          </span>
                          <span>за {quantity} шт.)</span>
                        </span>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-2 md:items-start">
                  <Button
                    variant="gold"
                    size="lg"
                    onClick={handleBuyNow}
                    className="w-full md:w-auto md:min-w-[240px] shadow-lg shadow-primary/20"
                  >
                    Купить сейчас
                  </Button>
                  <Button
                    variant="goldOutline"
                    size="lg"
                    onClick={handleAddToCart}
                    className="w-full md:w-auto md:min-w-[240px] flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    В корзину
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        )}

        {activeTab === "accessories" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accessoryProducts.map((product) => {
              const isRequest = product.priceType === "request";
              const displayPrice = product.price ?? 0;
              const imageSrc = product.imageUrl || "/placeholder.png";
              return (
                <div key={product.id} className="glass-card rounded-xl p-5 border border-border/50">
                  <img
                    src={imageSrc}
                    alt={product.name || "Товар"}
                    className="w-full h-44 object-contain mb-4"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== "/placeholder.png") target.src = "/placeholder.png";
                    }}
                  />
                  <h3 className="text-lg font-semibold mb-2">{product.name || "Товар"}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{product.description || "Описание недоступно"}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold gold-text">
                      {isRequest ? "по запросу" : `${displayPrice.toLocaleString()} ₽`}
                    </span>
                    <Button
                      variant="gold"
                      size="sm"
                      onClick={() => {
                        if (isRequest) return;
                        addItem({
                          id: `accessory-${product.id}-${Date.now()}`,
                          name: product.name || "Товар",
                          type: "purchase",
                          price: displayPrice,
                          image: imageSrc,
                          productType: product.productType || "accessory",
                        });
                      }}
                      disabled={isRequest}
                    >
                      В корзину
                    </Button>
                  </div>
                </div>
              );
            })}
            {accessoryProducts.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-10">
                Аксессуары не найдены
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
