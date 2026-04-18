/**
 * LIDERA Design Tokens — Premium Edition
 * "Netflix Education Club" — Comunidade, Imersão, Resultados
 *
 * Paleta inspirada em plataformas premium (Netflix, Disney+, Linear)
 * com identidade brasileira de treinamento corporativo.
 *
 * @usage Importar tokens deste arquivo, nunca valores hardcoded
 */

export const colors = {
  // ── Primary: Indigo (Modernidade, Tecnologia, Plataforma) ──
  primary: {
    DEFAULT: '#6366F1',   // Indigo 500 — CTA principal, links
    dark: '#4F46E5',      // Indigo 600 — hover
    deeper: '#4338CA',    // Indigo 700 — headings, active
    light: '#818CF8',     // Indigo 400 — highlights
    muted: '#EEF2FF',     // Indigo 50 — badges em bg claro
    faint: 'rgba(99, 102, 241, 0.08)', // Hover backgrounds
  },

  // ── Secondary: Violet (Comunidade, Criatividade, Membership) ──
  secondary: {
    DEFAULT: '#8B5CF6',   // Violet 500 — comunidade, badges
    dark: '#7C3AED',      // Violet 600 — hover
    light: '#A78BFA',     // Violet 400 — highlights
    muted: '#F5F3FF',     // Violet 50 — badges
    faint: 'rgba(139, 92, 246, 0.08)',
  },

  // ── Accent: Amber (Energia, Urgência, CTAs de ação) ──
  accent: {
    DEFAULT: '#F59E0B',   // Amber 500 — CTAs principais
    dark: '#D97706',      // Amber 600 — hover
    light: '#FBBF24',     // Amber 400 — highlights
    muted: '#FFFBEB',     // Amber 50 — badges
    faint: 'rgba(245, 158, 11, 0.08)',
    glow: 'rgba(245, 158, 11, 0.35)',
  },

  // ── Success: Emerald (Progresso, Conclusão, Sucesso) ──
  success: {
    DEFAULT: '#10B981',   // Emerald 500
    dark: '#059669',      // Emerald 600
    light: '#34D399',     // Emerald 400
    muted: '#ECFDF5',     // Emerald 50
    faint: 'rgba(16, 185, 129, 0.08)',
  },

  // ── Brand: Mantém Azul corporativo original para contextos de confiança ──
  brand: {
    blue: {
      DEFAULT: '#1E88E5',
      dark: '#1565C0',
      deeper: '#0B4A8F',
      light: '#8CC1F7',
      muted: '#ECF3FC',
    },
    orange: {
      DEFAULT: '#F57C00',
      dark: '#E65100',
      light: '#FFF7ED',
      muted: '#F57C00',
    },
    green: {
      DEFAULT: '#4CAF50',
      dark: '#2E7D32',
      lime: '#7CB342',
      light: '#E8F5E9',
    },
  },

  // ── Backgrounds — Dark Mode (Netflix-style imersivo) ──
  bg: {
    dark: {
      base: '#030712',       // Slate 950 — fundo raiz imersivo
      primary: '#0A0F1E',    // Fundo principal das páginas
      secondary: '#0D1424',  // Seções alternadas
      card: '#0F1729',       // Cards (quase invisíveis no base)
      elevated: '#131C30',   // Cards elevados, modais
      input: '#0B1120',      // Inputs
      overlay: 'rgba(3, 7, 18, 0.85)', // Overlays
    },
    light: {
      base: '#FAFBFC',
      primary: '#FFFFFF',
      secondary: '#F4F7FB',
      tertiary: '#EEF2F8',
      card: '#FFFFFF',
      muted: '#F8FAFC',
    },
  },

  // ── Text ──
  text: {
    onDark: {
      primary: '#F8FAFC',    // Títulos, texto principal
      secondary: '#CBD5E1',  // Subtextos
      muted: '#94A3B8',      // Labels, captions
      subtle: '#64748B',     // Placeholders
      disabled: '#475569',   // Disabled
      inverse: '#0F172A',    // Texto sobre cores claras
    },
    onLight: {
      primary: '#0F172A',    // Slate 900
      secondary: '#1E293B',  // Slate 800
      muted: '#475569',      // Slate 600
      subtle: '#64748B',     // Slate 500
      disabled: '#94A3B8',   // Slate 400
    },
  },

  // ── Borders ──
  border: {
    dark: {
      DEFAULT: 'rgba(255, 255, 255, 0.06)',  // Bordas quase invisíveis
      subtle: 'rgba(255, 255, 255, 0.03)',   // Divisores
      strong: 'rgba(255, 255, 255, 0.12)',   // Hover
      focus: '#6366F1',                       // Focus rings
    },
    light: {
      DEFAULT: '#E2E8F0',
      subtle: '#F1F5F9',
      strong: '#CBD5E1',
    },
  },

  // ── Semantic Colors ──
  semantic: {
    error: '#EF4444',      // Red 500
    errorMuted: '#FEF2F2',
    warning: '#F59E0B',    // Amber 500
    warningMuted: '#FFFBEB',
    info: '#6366F1',       // Indigo
    infoMuted: '#EEF2FF',
    success: '#10B981',    // Emerald
    successMuted: '#ECFDF5',
  },

  // ── Gradients ──
  gradient: {
    brand: 'linear-gradient(135deg, #6366F1 0%, #10B981 50%, #F59E0B 100%)',
    primary: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    gold: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    surface: 'linear-gradient(180deg, #0F1729 0%, #0A0F1E 100%)',
    card: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
  },
} as const

export const radius = {
  sm: 'rounded-lg',     // 8px — inputs, badges pequenos
  md: 'rounded-xl',     // 12px — buttons, cards
  lg: 'rounded-2xl',    // 16px — large cards, panels
  xl: 'rounded-3xl',    // 24px — hero cards, modais
  full: 'rounded-full', // Pills, avatars
} as const

export const shadow = {
  sm: 'shadow-sm',
  card: 'shadow-[0_4px_16px_rgba(0,0,0,0.08)]',
  cardDark: 'shadow-[0_4px 20px_rgba(0,0,0,0.4)]',
  elevated: 'shadow-[0_22px_48px_rgba(0,0,0,0.5)]',
  glow: {
    indigo: 'shadow-[0_14px_34px_rgba(99,102,241,0.25)]',
    violet: 'shadow-[0_14px_34px_rgba(139,92,246,0.25)]',
    amber: 'shadow-[0_14px_34px_rgba(245,158,11,0.3)]',
    emerald: 'shadow-[0_14px_34px_rgba(16,185,129,0.2)]',
    card: 'shadow-[0_20px_60px_-15px_rgba(99,102,241,0.15)]',
  },
} as const

export const motion = {
  // ── Timing ──
  duration: {
    fast: '100ms',
    normal: '200ms',
    slow: '400ms',
    slower: '600ms',
  },
  // ── Easing curves ──
  easing: {
    DEFAULT: 'cubic-bezier(0.16, 1, 0.3, 1)',     // ease-out-expo — premium feel
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',  // ease-out-back — bounce
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',       // ease-in-out
    linear: 'linear',
  },
  // ── Animation keyframes ──
  keyframes: {
    fadeInUp: {
      from: { opacity: '0', transform: 'translateY(24px)' },
      to: { opacity: '1', transform: 'translateY(0)' },
    },
    fadeIn: {
      from: { opacity: '0' },
      to: { opacity: '1' },
    },
    shimmer: {
      from: { backgroundPosition: '-200% 0' },
      to: { backgroundPosition: '200% 0' },
    },
    float: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-8px)' },
    },
    slideInRight: {
      from: { opacity: '0', transform: 'translateX(24px)' },
      to: { opacity: '1', transform: 'translateX(0)' },
    },
    scaleIn: {
      from: { opacity: '0', transform: 'scale(0.95)' },
      to: { opacity: '1', transform: 'scale(1)' },
    },
    pulse: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' },
    },
  },
} as const

export const typography = {
  fontHeading: 'var(--font-heading)',
  fontSans: 'var(--font-sans)',
  fontMono: 'var(--font-mono)',
  scale: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
  },
} as const

export const spacing = {
  section: {
    padding: 'px-6 py-24',
    paddingSmall: 'px-6 py-16',
    paddingLarge: 'px-6 py-32',
    gap: 'gap-6',
  },
  container: 'mx-auto w-full max-w-[1280px]',
  containerNarrow: 'mx-auto w-full max-w-[960px]',
  containerWide: 'mx-auto w-full max-w-[1440px]',
} as const

// ── Semantic component tokens ──
export const componentTokens = {
  // Botões
  button: {
    primary: {
      bg: '#6366F1',
      bgHover: '#4F46E5',
      text: '#FFFFFF',
      shadow: 'shadow-[0_4px_14px_rgba(99,102,241,0.35)]',
    },
    secondary: {
      bg: 'rgba(255,255,255,0.06)',
      bgHover: 'rgba(255,255,255,0.1)',
      text: '#F8FAFC',
      border: 'rgba(255,255,255,0.08)',
    },
    accent: {
      bg: '#F59E0B',
      bgHover: '#D97706',
      text: '#0F172A',
      shadow: 'shadow-[0_4px_14px_rgba(245,158,11,0.4)]',
    },
    ghost: {
      bg: 'transparent',
      bgHover: 'rgba(255,255,255,0.05)',
      text: '#94A3B8',
    },
  },
  // Cards
  card: {
    dark: {
      bg: '#0F1729',
      bgHover: '#131C30',
      border: 'rgba(255,255,255,0.06)',
      borderHover: 'rgba(255,255,255,0.12)',
    },
    light: {
      bg: '#FFFFFF',
      bgHover: '#F8FAFC',
      border: '#E2E8F0',
      borderHover: '#CBD5E1',
    },
  },
} as const