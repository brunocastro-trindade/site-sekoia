import React, { useState, type FC, type ReactNode } from 'react';
import { cn } from '@/app/components/ui/utils';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  logoSrc: string;
  companyName?: string;
  description?: string;
  usefulLinks?: { label: string; href: string }[];
  socialLinks?: { label: string; href: string; icon: ReactNode }[];
  newsletterTitle?: string;
  onSubscribe?: (email: string) => Promise<boolean>;
  contact?: { email?: string; phone?: string; cnpj?: string };
}

export const Footer: FC<FooterProps> = ({
  logoSrc,
  companyName = 'Sekoia Marketing',
  description = 'Gerar oportunidades de negócio não deveria depender só da sorte do networking. Nossa equipe identifica os gargalos do seu momento atual e monta um plano de marketing sob medida para gerar mais clientes qualificados.',
  usefulLinks = [
    { label: 'Sobre nós', href: '#' },
    { label: 'Serviços', href: '#' },
    { label: 'Google Meu Negócio', href: 'https://googlemeunegocio.sekoiamarketing.com.br/#planos' },
    { label: 'Contato', href: '#' },
  ],
  socialLinks = [],
  newsletterTitle = 'Receba novidades e estratégias',
  onSubscribe,
  contact,
  className,
  ...props
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !onSubscribe || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onSubscribe(email);

    setSubscriptionStatus(success ? 'success' : 'error');
    setIsSubmitting(false);

    if (success) {
      setEmail('');
    }

    setTimeout(() => {
      setSubscriptionStatus('idle');
    }, 3000);
  };
  return (
    <footer id="contato" className={cn('bg-background border-t border-border/40 text-foreground', className)} {...props}>
      <div className="container mx-auto grid grid-cols-1 gap-8 px-8 py-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-12 max-w-7xl">
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt={`Logotipo da ${companyName}`} width={48} height={48} className="h-12 w-auto" />
            <span className="text-2xl font-['Gotham:Bold',sans-serif] text-accent-bright">{companyName}</span>
          </div>
          <p className="text-sm font-['Gotham:Book',sans-serif] text-muted-foreground opacity-90 leading-relaxed">{description}</p>

          {contact && (
            <address className="not-italic text-sm font-['Gotham:Book',sans-serif] text-muted-foreground leading-relaxed">
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="block transition-colors hover:text-accent-bright">
                  {contact.email}
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}
                  className="block transition-colors hover:text-accent-bright"
                >
                  {contact.phone}
                </a>
              )}
              {contact.cnpj && <span className="mt-1 block opacity-70">CNPJ {contact.cnpj}</span>}
            </address>
          )}
        </div>
        <nav className="md:justify-self-center mt-2" aria-labelledby="footer-links-uteis">
          <h3 id="footer-links-uteis" className="mb-6 text-lg font-['Gotham:Bold',sans-serif] text-foreground">Links Úteis</h3>
          <ul className="space-y-3">
            {usefulLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm font-['Gotham:Book',sans-serif] text-muted-foreground transition-colors hover:text-accent-bright"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav className="md:justify-self-center mt-2" aria-labelledby="footer-canais">
          <h3 id="footer-canais" className="mb-6 text-lg font-['Gotham:Bold',sans-serif] text-foreground">Nossos canais</h3>
          <ul className="space-y-3">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  aria-label={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm font-['Gotham:Book',sans-serif] text-muted-foreground transition-colors hover:text-accent-bright hover:-translate-y-0.5 transform duration-300 group"
                >
                  <span className="p-2 rounded-full bg-accent-bright/10 text-accent-bright group-hover:bg-accent-bright group-hover:text-accent-foreground transition-colors">
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-2">
          <h3 className="mb-6 text-lg font-['Gotham:Bold',sans-serif] text-foreground">{newsletterTitle}</h3>
          <form onSubmit={handleSubscribe} className="relative w-full max-w-sm">
            <div className="relative">
              <Input
                type="email"
                placeholder="Seu endereço de e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || subscriptionStatus !== 'idle'}
                required
                aria-label="Email para newsletter"
                className="pr-32 bg-input border-accent-bright/25 text-foreground placeholder:text-muted-foreground focus-visible:ring-accent-bright"
              />
              <Button
                type="submit"
                disabled={isSubmitting || subscriptionStatus !== 'idle'}
                className="absolute right-0 top-0 h-full rounded-l-none px-5 bg-accent-bright text-accent-foreground hover:bg-accent-bright/85 font-['Gotham:Bold',sans-serif]"
              >
                {isSubmitting ? '...' : 'Assinar'}
              </Button>
            </div>
            {(subscriptionStatus === 'success' || subscriptionStatus === 'error') && (
              <div
                key={subscriptionStatus}
                role="status"
                aria-live="polite"
                className="animate-in fade-in absolute inset-0 flex items-center justify-center rounded-md bg-popover/95 text-center backdrop-blur-sm border border-accent-bright/20"
              >
                {subscriptionStatus === 'success' ? (
                  <span className="font-['Gotham:Bold',sans-serif] text-[15px] text-accent-bright">Assinado! 🎉</span>
                ) : (
                  <span className="font-['Gotham:Bold',sans-serif] text-[15px] text-destructive">Falhou. Tente novamente.</span>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </footer>
  );
};
