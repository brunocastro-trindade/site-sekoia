import { useEffect, useState } from "react";
import HotPageTrafegoPagoSekoia from "../imports/HotPageTrafegoPagoSekoia";
import MethodologySection from "./MethodologySection";
import ContactForm from "./ContactForm";
import { Canvas } from "../components/Canvas";
import { WhatsAppFab } from "../components/WhatsAppFab";
import { MobileApp } from "./MobileApp";

// Coordenadas dentro do canvas de 1440×4259 (espaço Figma)
// Copy CTA banner termina em y=2408; "Seja o próximo case" começa em y≈2771
const METH_TOP = 2410;
const METH_HEIGHT = 360; // cobre até y=2770, justo antes do próximo bloco
const FORM_TOP = 3091;
const FORM_HEIGHT = 800;

/** Abaixo deste ponto usamos o layout mobile dedicado (reflow real). */
const MOBILE_BREAKPOINT = 900;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT,
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

export default function App() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <>
        <MobileApp />
        <WhatsAppFab />
      </>
    );
  }

  return (
    <>
    <Canvas>
      {/* Landing page completa do Figma */}
      <HotPageTrafegoPagoSekoia />

      {/* ── Metodologia: máscara branca + nova seção ── */}
      <div
        style={{
          position: "absolute",
          top: METH_TOP,
          left: 0,
          right: 0,
          height: METH_HEIGHT,
          background: "#ffffff",
          zIndex: 10,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: METH_TOP,
          left: 0,
          right: 0,
          zIndex: 11,
        }}
      >
        <MethodologySection />
      </div>

      {/* ── Formulário de contato: máscara branca + formulário ── */}
      <div
        style={{
          position: "absolute",
          top: FORM_TOP,
          left: 0,
          right: 0,
          height: FORM_HEIGHT,
          background: "#ffffff",
          zIndex: 10,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: FORM_TOP,
          left: 0,
          right: 0,
          zIndex: 11,
        }}
      >
        <ContactForm />
      </div>
    </Canvas>

    <WhatsAppFab />
    </>
  );
}
