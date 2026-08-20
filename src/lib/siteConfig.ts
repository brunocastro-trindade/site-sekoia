export const siteConfig = {
  name: "Sekoia",
  fullName: "Sekoia Growth Marketing",
  tagline: "Growth Marketing",

  nav: [
    { label: "Soluções", id: "solucoes" },
    { label: "Orçamentos", id: "orcamentos" },
    { label: "Contato", id: "contato" },
  ],

  contact: {
    email: "contato@sekoiamarketing.com.br",
    phone: "+55 (47) 99215-6393",
    cnpj: "66.526.186/0001-25",
  },

  whatsapp: {
    primaryNumber: "5547992156393",
    footerNumber: "5547991603130",
    defaultMessage:
      "Olá! Vim pelo site da Sekoia e gostaria de solicitar um orçamento de tráfego pago.",
  },

  social: {
    whatsapp: "https://wa.me/5547992156393",
    linkedin: "https://www.linkedin.com/company/sekoia-marketing/",
    instagram: "https://www.instagram.com/sekoia.ag",
  },

  externalLinks: {
    centralDeOportunidades: "https://form.sekoiamarketing.com.br/",
    googleMeuNegocio: "https://googlemeunegocio.sekoiamarketing.com.br/#planos",
  },
} as const;
