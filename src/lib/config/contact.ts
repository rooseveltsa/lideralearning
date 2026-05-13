// Single source of truth para dados de contato da Lidera Treinamentos.
// Centralizado aqui para evitar hardcode espalhado (header, footer, contato, emails).

export const CONTACT = {
  owner: {
    name: 'Claudemir Domingos',
    role: 'Fundador',
  },
  whatsapp: {
    display: '+55 (64) 9 9609-9020',
    e164: '5564996099020',
    url: 'https://wa.me/5564996099020',
  },
  email: {
    commercial: 'claudemir.lidera@gmail.com',
    commercialMailto: 'mailto:claudemir.lidera@gmail.com',
  },
  social: {
    instagram: 'https://instagram.com/lideratreinamentos',
    linkedin: 'https://linkedin.com/company/lideratreinamentos',
  },
  site: 'https://lideralearning.vercel.app',
} as const
