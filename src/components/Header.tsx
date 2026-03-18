import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import logo from "@/assets/logo.png";

const Header = () => {
  const { toggleCart, totalItems } = useCart();
  const { scrollY } = useScroll();
  const headerShadow = useTransform(
    scrollY,
    [0, 100],
    ["0 0 0 0 rgba(0,0,0,0)", "0 4px 30px -4px rgba(212,175,55,0.08)"]
  );
  const headerBg = useTransform(
    scrollY,
    [0, 80],
    ["hsla(0,0%,4.3%,0.6)", "hsla(0,0%,4.3%,0.92)"]
  );

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      style={{ boxShadow: headerShadow, backgroundColor: headerBg }}
      className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl border-b border-border/50"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2.5 group">
          <img src={logo} alt="N2O" className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110" />
          <div className="flex flex-col leading-none">
            <span className="text-sm font-black gold-text tracking-tight">N₂O</span>
            <span className="text-[8px] text-muted-foreground font-medium tracking-widest uppercase">Delivery</span>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: "Каталог", id: "products" },
            { label: "Как это работает", id: "how-it-works" },
            { label: "Доставка", id: "delivery" },
            { label: "Контакты", id: "contacts" },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="relative px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full gold-gradient transition-all duration-300 group-hover:w-3/4" />
            </button>
          ))}
        </nav>

        <Button variant="ghost" size="icon" onClick={toggleCart} className="relative group">
          <ShoppingCart className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full gold-gradient text-[10px] font-bold text-primary-foreground flex items-center justify-center"
            >
              {totalItems}
            </motion.span>
          )}
        </Button>
      </div>
    </motion.header>
  );
};

export default Header;
