const INSTAGRAM_URL = "https://www.instagram.com/sekoia.ag/";

/**
 * Botão flutuante do Instagram, fixo no canto inferior direito, logo acima do
 * botão do WhatsApp. Acompanha a rolagem e faz um leve movimento de subir/descer
 * (defasado do WhatsApp). Ao clicar, abre o perfil da Sekoia no Instagram.
 */
export function InstagramFab() {
  return (
    <button
      type="button"
      onClick={() => window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer")}
      aria-label="Siga a Sekoia no Instagram"
      title="Siga a Sekoia no Instagram"
      className="wa-fab-bob"
      style={{
        position: "fixed",
        right: 24,
        bottom: 96,
        zIndex: 9999,
        width: 60,
        height: 60,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 6px 18px rgba(0,0,0,0.28)",
        color: "#ffffff",
        animationDelay: "-1.1s",
      }}
    >
      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5.5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    </button>
  );
}
