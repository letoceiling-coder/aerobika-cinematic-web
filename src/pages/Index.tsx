import FloatingBubbles from "@/components/FloatingBubbles";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductSection from "@/components/ProductSection";
import HowItWorks from "@/components/HowItWorks";
import DeliveryInfo from "@/components/DeliveryInfo";
import ContactSection from "@/components/ContactSection";
import SiteFooter from "@/components/SiteFooter";
import CartPanel from "@/components/CartPanel";
import MobileNav from "@/components/MobileNav";

const Index = () => (
  <div className="min-h-screen bg-background pb-16 md:pb-0">
    <FloatingBubbles />
    <Header />
    <HeroSection />
    <ProductSection />
    <HowItWorks />
    <DeliveryInfo />
    <ContactSection />
    <SiteFooter />
    <CartPanel />
    <MobileNav />
  </div>
);

export default Index;
