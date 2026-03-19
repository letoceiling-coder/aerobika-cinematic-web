import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  image: string;
  title: string;
  volume: string;
  description: string;
  price: number;
  onBuy: () => void;
  delay?: number;
}

const ProductCard = ({ image, title, volume, description, price, onBuy, delay = 0 }: ProductCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
    whileHover={{ y: -6, transition: { duration: 0.25 } }}
    whileTap={{ scale: 0.98 }}
    className="glass-card rounded-2xl overflow-hidden group cursor-pointer border border-border/50 hover:border-primary/30 transition-colors duration-300"
    style={{ boxShadow: "inset 0 1px 0 0 hsla(0,0%,100%,0.06)" }}
  >
    <div className="relative p-8 flex justify-center bg-gradient-to-b from-secondary/60 to-transparent">
      <motion.img
        src={image}
        alt={title}
        className="w-36 h-52 object-contain drop-shadow-lg"
        whileHover={{ scale: 1.08, rotate: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>

    <div className="p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <span className="text-sm text-muted-foreground font-medium glass-card px-3 py-1 rounded-full">{volume}</span>
      </div>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold gold-text">{price.toLocaleString()} ₽</span>
        <Button variant="gold" size="default" onClick={onBuy} className="shadow-lg shadow-primary/20">
          Купить
        </Button>
      </div>
    </div>
  </motion.div>
);

export default ProductCard;
