import { motion } from "framer-motion";
import { MapPin, Clock, Truck } from "lucide-react";

const ease = [0.4, 0, 0.2, 1] as const;

const DeliveryInfo = () => (
  <section id="delivery" className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          <span className="gold-text">Доставка</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { icon: MapPin, title: "По городу", desc: "Бесплатная доставка", accent: true },
          { icon: Truck, title: "За город", desc: "от 500 ₽", accent: false },
          { icon: Clock, title: "Время", desc: "30–60 минут", accent: true },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.5, ease }}
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
            className="glass-card rounded-2xl p-6 text-center border border-border/50 hover:border-primary/20 transition-colors duration-300"
            style={{ boxShadow: "inset 0 1px 0 0 hsla(0,0%,100%,0.06)" }}
          >
            <item.icon className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
            <p className={`text-sm ${item.accent ? "text-accent font-semibold" : "text-muted-foreground"}`}>
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default DeliveryInfo;
