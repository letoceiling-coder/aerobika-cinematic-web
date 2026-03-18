import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ParticlesBackground from "./ParticlesBackground";
import heroCylinder from "@/assets/hero-cylinder.png";

const ease = [0.4, 0, 0.2, 1] as const;

const HeroSection = () => {
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <ParticlesBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 pt-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease }}
            className="text-center lg:text-left"
          >

            <h1 className="text-4xl md:text-7xl font-black leading-[1.1] mb-6 tracking-tight">
              <span className="text-foreground">Закись азота</span>
              <br />
              <span className="gold-text inline-flex items-end gap-0.5 pb-2 leading-none" aria-label="N₂O">
                <span>N</span>
                <span className="text-[0.58em] leading-none mb-[0.08em]">2</span>
                <span>O</span>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Доставка за <span className="text-foreground font-semibold">30–60 минут</span>
            </p>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Премиальное качество. Сертифицированный продукт. Быстрая и надёжная доставка по городу.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="gold" size="lg" onClick={scrollToProducts} className="shadow-lg shadow-primary/25">
                Заказать
              </Button>
              <Button variant="goldOutline" size="lg" onClick={scrollToProducts}>
                Каталог
              </Button>
            </div>

            <div className="flex gap-8 mt-10 justify-center lg:justify-start">
              {[
                { value: "30 мин", label: "Доставка" },
                { value: "24/7", label: "Работаем" },
                { value: "100%", label: "Качество" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, ease }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold gold-text">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease, delay: 0.3 }}
            className="relative flex justify-center"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 md:w-80 md:h-80 rounded-full gold-gradient opacity-[0.08] blur-3xl animate-pulse-glow" />
            </div>
            <motion.img
              src={heroCylinder}
              alt="N2O баллон"
              className="relative z-10 w-56 md:w-72 lg:w-80 animate-float-gentle drop-shadow-2xl"
              loading="eager"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
