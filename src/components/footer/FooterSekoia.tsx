import { MessageCircle } from 'lucide-react';
import { Footer } from './Footer';
import sekoiaLogo from './assets/sekoia-logo.png';
import { siteConfig } from '../../lib/siteConfig';

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
export const FooterSekoia = (props: { className?: string }) => (
  <Footer
    className={props.className}
    logoSrc={sekoiaLogo}
    companyName={siteConfig.fullName}
    contact={siteConfig.contact}
    usefulLinks={[
      { label: 'Soluções', href: '#solucoes' },
      { label: 'Solicitar orçamento', href: '#orcamentos' },
      { label: 'Central de Oportunidades', href: siteConfig.externalLinks.centralDeOportunidades },
      { label: 'Google Meu Negócio', href: siteConfig.externalLinks.googleMeuNegocio },
    ]}
    socialLinks={[
      { label: 'WhatsApp', href: siteConfig.social.whatsapp, icon: <MessageCircle className="w-5 h-5" /> },
      { label: 'LinkedIn', href: siteConfig.social.linkedin, icon: <LinkedinIcon className="w-5 h-5" /> },
      { label: 'Instagram', href: siteConfig.social.instagram, icon: <InstagramIcon className="w-5 h-5" /> },
    ]}
    onSubscribe={async (email) => {
      try {
        const r = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, origem: 'footer-site-principal' }),
        });
        const data = await r.json().catch(() => ({}));
        return r.ok && data?.success === true;
      } catch {
        return false;
      }
    }}
  />
);
