import { Header } from "./Header";
import { Hero } from "./Hero";
import { FeatureCards } from "./FeatureCards";
import { TrafficPitch } from "./TrafficPitch";
import MethodologySection from "./MethodologySection";
import ContactForm from "./ContactForm";
import { Faq } from "./Faq";
import { FooterSekoia } from "../components/footer/FooterSekoia";
import { WhatsAppFab } from "../components/WhatsAppFab";
import { useScrollReveal } from "../lib/useScrollReveal";

export default function App() {
  useScrollReveal();

  return (
    <>
      <div className="relative z-10 bg-background">
        <Header />
        <Hero />
        <FeatureCards />
        <TrafficPitch />
        <MethodologySection />
        <ContactForm />
        <Faq />
      </div>
      <div className="sticky top-[100vh]">
        <FooterSekoia />
      </div>
      <WhatsAppFab />
    </>
  );
}
