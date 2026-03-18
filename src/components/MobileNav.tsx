import { Home, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MobileNav = () => {
  const { toggleCart, totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    if (location.pathname === "/") {
      setActiveTab("home");
    } else if (location.pathname === "/profile") {
      setActiveTab("profile");
    }
  }, [location.pathname]);

  const scrollToTop = () => {
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setActiveTab("home");
  };

  const handleCart = () => {
    toggleCart();
    setActiveTab("cart");
  };

  const handleProfile = () => {
    navigate("/profile");
    setActiveTab("profile");
  };

  const tabs = [
    { id: "home", icon: Home, label: "Главная", action: scrollToTop },
    { id: "cart", icon: ShoppingCart, label: "Корзина", action: handleCart, badge: totalItems },
    { id: "profile", icon: User, label: "Профиль", action: handleProfile },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border/50 bg-card/95 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
    >
      <div className="flex items-stretch justify-around h-12">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={tab.action}
              whileTap={{ scale: 0.9 }}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors duration-200 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <tab.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                {tab.badge != null && tab.badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 rounded-full gold-gradient text-[9px] font-bold text-primary-foreground flex items-center justify-center px-1"
                  >
                    {tab.badge}
                  </motion.span>
                )}
              </div>
              <span className="text-[10px] font-medium leading-tight">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default MobileNav;
