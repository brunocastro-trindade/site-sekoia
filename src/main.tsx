
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { initGoogleAdsTag } from "./lib/pixel";
  import "./styles/index.css";

  // Registra a tag do Google Ads (AW-) no gtag; inerte enquanto GOOGLE_ADS_ID
  // estiver vazio em src/lib/pixel.ts. Ver docs/CONVERSOES-GOOGLE-ADS.md.
  initGoogleAdsTag();

  createRoot(document.getElementById("root")!).render(<App />);
