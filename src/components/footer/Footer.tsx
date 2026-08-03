import React, { useState, type FC, type ReactNode } from 'react';
import { cn } from '@/app/components/ui/utils';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';

/**
 * Footer padrão da marca — compartilhado entre as landings da Sekoia.
 * Origem: `BNI DA SEKOIA/src/components/ui/footer.tsx` (pacote sekoia-footer).
 *
 * Os imports apontam para `@/app/components/ui/*` porque neste projeto os
 * componentes shadcn moram em `src/app/components/ui`, não em `src/components/ui`
 * como no projeto de origem. `cn` vive em `ui/utils.ts`, não em `lib/utils`.
 */

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  logoSrc: string;
  companyName?: string;
  description?: string;
  usefulLinks?: { label: string; href: string }[];
  socialLinks?: { label: string; href: string; icon: ReactNode }[];
  newsletterTitle?: string;
  onSubscribe?: (email: string) => Promise<boolean>;
  /**
   * Dados institucionais opcionais. Existem porque o site principal exibia
   * e-mail/telefone/CNPJ no rodapé antigo e essa informação não pode se perder
   * na padronização. Landings que não passam `contact` (ex.: BNI) renderizam
   * exatamente como antes.
   */
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
    <footer id="contato" className={cn('bg-[#0b1005] border-t border-[#40D11F]/20 text-white', className)} {...props}>
      <div className="container mx-auto grid grid-cols-1 gap-8 px-8 py-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-12 max-w-7xl">
        {/* Company Info */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt={`Logotipo da ${companyName}`} width={48} height={48} className="h-12 w-auto" />
            <span className="text-2xl font-['Gotham:Bold',sans-serif] text-[#40D11F]">{companyName}</span>
          </div>
          <p className="text-sm font-['Gotham:Book',sans-serif] text-gray-400 opacity-90 leading-relaxed">{description}</p>

          {contact && (
            <address className="not-italic text-sm font-['Gotham:Book',sans-serif] text-gray-400 leading-relaxed">
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="block transition-colors hover:text-[#40D11F]">
                  {contact.email}
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}
                  className="block transition-colors hover:text-[#40D11F]"
                >
                  {contact.phone}
                </a>
              )}
              {contact.cnpj && <span className="mt-1 block opacity-70">CNPJ {contact.cnpj}</span>}
            </address>
          )}
        </div>

        {/* Useful Links */}
        <nav className="md:justify-self-center mt-2" aria-labelledby="footer-links-uteis">
          <h3 id="footer-links-uteis" className="mb-6 text-lg font-['Gotham:Bold',sans-serif] text-white">Links Úteis</h3>
          <ul className="space-y-3">
            {usefulLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm font-['Gotham:Book',sans-serif] text-gray-400 transition-colors hover:text-[#40D11F]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Follow Us */}
        <nav className="md:justify-self-center mt-2" aria-labelledby="footer-canais">
          <h3 id="footer-canais" className="mb-6 text-lg font-['Gotham:Bold',sans-serif] text-white">Nossos canais</h3>
          <ul className="space-y-3">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  aria-label={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm font-['Gotham:Book',sans-serif] text-gray-400 transition-colors hover:text-[#40D11F] hover:-translate-y-0.5 transform duration-300 group"
                >
                  <span className="p-2 rounded-full bg-[#304515] text-[#40D11F] group-hover:bg-[#40D11F] group-hover:text-black transition-colors">
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Newsletter */}
        <div className="mt-2">
          <h3 className="mb-6 text-lg font-['Gotham:Bold',sans-serif] text-white">{newsletterTitle}</h3>
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
                className="pr-32 bg-[#141d08] border-[#40D11F]/30 text-white placeholder:text-gray-500 focus-visible:ring-[#40D11F]"
              />
              <Button
                type="submit"
                disabled={isSubmitting || subscriptionStatus !== 'idle'}
                className="absolute right-0 top-0 h-full rounded-l-none px-5 bg-[#40D11F] text-black hover:bg-[#32a816] font-['Gotham:Bold',sans-serif]"
              >
                {isSubmitting ? '...' : 'Assinar'}
              </Button>
            </div>
            {/* Advanced Animation Overlay */}
            {(subscriptionStatus === 'success' || subscriptionStatus === 'error') && (
              <div
                key={subscriptionStatus}
                role="status"
                aria-live="polite"
                className="animate-in fade-in absolute inset-0 flex items-center justify-center rounded-md bg-[#141d08]/90 text-center backdrop-blur-sm border border-[#40D11F]/20"
              >
                {subscriptionStatus === 'success' ? (
                  <span className="font-['Gotham:Bold',sans-serif] text-[15px] text-[#40D11F]">Assinado! 🎉</span>
                ) : (
                  <span className="font-['Gotham:Bold',sans-serif] text-[15px] text-red-500">Falhou. Tente novamente.</span>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </footer>
  );
};
