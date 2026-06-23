import HotPageTrafegoPagoSekoia from "../imports/HotPageTrafegoPagoSekoia";
import MethodologySection from "./MethodologySection";
import ContactForm from "./ContactForm";
import { Canvas } from "../components/Canvas";

// Coordenadas dentro do canvas de 1440×4259 (espaço Figma)
const METH_TOP = 2385;
const METH_HEIGHT = 706;
const FORM_TOP = 3091;
const FORM_HEIGHT = 750;

export default function App() {
  return (
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
  );
}
