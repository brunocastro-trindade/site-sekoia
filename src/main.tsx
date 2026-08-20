
  import { createRoot } from "react-dom/client";
  import { ThemeProvider } from "next-themes";
  import App from "./app/App.tsx";
  import { initGoogleAdsTag } from "./lib/pixel";
  import { initLenis } from "./lib/lenis";
  import "./styles/index.css";

  initGoogleAdsTag();
  initLenis();

  createRoot(document.getElementById("root")!).render(
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="sekoia-theme">
      <App />
    </ThemeProvider>,
  );
