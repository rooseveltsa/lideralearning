/**
 * LIDERA Design Tokens
 *
 * Fonte de verdade para todas as cores, espaçamentos e valores do design system.
 * Baseado nas cores oficiais da logo: Laranja + Verde + Azul.
 *
 * Usar estes tokens ao invés de hex values inline nos componentes.
 */

export const colors = {
  // ── Brand Colors (from logo) ──
  brand: {
    blue: {
      DEFAULT: '#1E88E5',  // Primary brand — confiança, corporativo
      dark: '#1565C0',     // Hover, headings
      deeper: '#0B4A8F',   // Labels, small text
      light: '#8CC1F7',    // Highlights on dark backgrounds
      muted: '#ECF3FC',    // Light backgrounds, badges
    },
    orange: {
      DEFAULT: '#F57C00',  // CTA principal — energia, ação, urgência
      dark: '#E65100',     // Hover state
      light: '#FFF7ED',    // Light alert backgrounds
      muted: '#F57C00',    // Badges
    },
    green: {
      DEFAULT: '#4CAF50',  // Crescimento, progresso, sucesso (from logo)
      dark: '#2E7D32',     // Hover
      lime: '#7CB342',     // Growth indicators, level-up
      light: '#E8F5E9',    // Light success backgrounds
    },
  },

  // ── Backgrounds ──
  bg: {
    dark: {
      primary: '#050A14',    // Main dark background
      secondary: '#060D1A',  // Alternate dark sections
      card: '#0A1324',       // Cards on dark
      elevated: '#0D1B30',   // Elevated cards, modals
      input: '#0B1222',      // Form inputs on dark
    },
    light: {
      primary: '#FFFFFF',    // Main light background
      secondary: '#F4F8FC',  // Alternate light sections
      tertiary: '#F7FAFD',   // Page backgrounds
      card: '#FFFFFF',       // Cards on light
      muted: '#F8FAFC',      // Muted backgrounds
    },
  },

  // ── Text ──
  text: {
    onDark: {
      primary: '#FFFFFF',
      secondary: '#E5ECF8',
      muted: '#A9BDD8',
      subtle: '#7FA0C2',
      disabled: '#4A6B8A',
    },
    onLight: {
      primary: '#0F172A',
      secondary: '#1E293B',
      muted: '#475569',
      subtle: '#64748B',
      disabled: '#94A3B8',
    },
  },

  // ── Borders ──
  border: {
    dark: {
      DEFAULT: '#22314B',
      subtle: '#1A2438',
      strong: '#335077',
      hover: '#4F77AA',
    },
    light: {
      DEFAULT: '#D8E2EF',
      subtle: '#E5ECF6',
      strong: '#CBD5E1',
    },
  },

  // ── Semantic ──
  semantic: {
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#1E88E5',
    success: '#4CAF50',
  },

  // ── External ──
  external: {
    whatsapp: '#25D366',
    stripe: '#635BFF',
  },
} as const

export const radius = {
  sm: 'rounded-lg',     // 8px — inputs, small buttons
  md: 'rounded-xl',     // 12px — buttons, cards
  lg: 'rounded-2xl',    // 16px — large cards, sections
  xl: 'rounded-3xl',    // 24px — hero cards, modals
} as const

export const shadow = {
  sm: 'shadow-sm',
  card: 'shadow-[0_10px_28px_rgba(15,23,42,0.08)]',
  elevated: 'shadow-[0_22px_48px_rgba(2,6,23,0.5)]',
  glow: {
    blue: 'shadow-[0_14px_34px_rgba(16,64,120,0.4)]',
    orange: 'shadow-lg shadow-[#F57C00]/25',
    green: 'shadow-lg shadow-[#4CAF50]/20',
  },
} as const

export const spacing = {
  section: {
    padding: 'px-6 py-24',
    paddingSmall: 'px-6 py-16',
    gap: 'gap-6',
  },
  container: 'mx-auto w-full max-w-[1280px]',
  containerNarrow: 'mx-auto w-full max-w-[960px]',
} as const
