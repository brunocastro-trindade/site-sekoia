import HotPageTrafegoPagoSekoia from "../imports/HotPageTrafegoPagoSekoia";
import MethodologySection from "./MethodologySection";
import ContactForm from "./ContactForm";

// Methodology section: covers old block at ~2385px, ~380px tall
const METH_TOP = 2385;
const METH_HEIGHT = 380;

// Contact form: covers old block at ~3091px, ~750px tall
const FORM_TOP = 3091;
const FORM_HEIGHT = 750;

export default function App() {
  return (
    <div style={{ minWidth: 1440, position: "relative" }}>

      {/* Full original landing page */}
      <div style={{ minHeight: 4200, position: "relative" }}>
        <HotPageTrafegoPagoSekoia />
      </div>

      {/* ── Methodology: white mask + new section ── */}
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

      {/* ── Contact form: white mask + new form ── */}
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

    </div>
  );
}
