import { motion } from "framer-motion";
import { ShoppingCart, ClipboardCheck, Truck } from "lucide-react";
import { useContent } from "@/hooks/useContent";

const ease = [0.4, 0, 0.2, 1] as const;

const HowItWorks = () => {
  const { get } = useContent();
  
  const steps = [
    { icon: ShoppingCart, title: get('how_step_1_title', 'Выберите товар'), desc: get('how_step_1_desc', 'Выберите объём и тип покупки') },
    { icon: ClipboardCheck, title: get('how_step_2_title', 'Оформите заказ'), desc: get('how_step_2_desc', 'Укажите адрес и контакты') },
    { icon: Truck, title: get('how_step_3_title', 'Получите доставку'), desc: get('how_step_3_desc', 'Быстрая доставка по городу') },
  ];

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gold-text">{get('how_title', 'Как это работает')}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.12, duration: 0.5, ease }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="text-center glass-card rounded-2xl p-8 border border-border/50 hover:border-primary/20 transition-colors duration-300"
              style={{ boxShadow: "inset 0 1px 0 0 hsla(0,0%,100%,0.06)" }}
            >
              <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/20">
                <step.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="text-sm font-bold gold-text mb-2">Шаг {i + 1}</div>
              <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
