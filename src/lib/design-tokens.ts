/**
 * LIDERA Design Tokens — Identidade Premium Consultiva
 * Navy profundo + Laranja ação + Verde sucesso + Azul info
 *
 * TIPOGRAFIA OFICIAL:
 * - Display/Editorial: Instrument Serif 400 (+ italic) → hero, h1, h2, citações, números editoriais
 * - UI/Corpo: Geist 400/500/600/700 → h3-h6, body, botões, labels, navegação
 * - Mono/Dados: Geist Mono 400/500 → métricas, tabelas, código
 *
 * PROIBIDO: Instrument Serif em h3-h6, body, botões, labels, badges, nav
 * PROIBIDO: Inter, Roboto, Arial como fonte primária
 */

export const colors = {
  navy: {
    50: '#f1f4f9',
    100: '#dde4ee',
    200: '#b8c5d8',
    300: '#8095b3',
    400: '#4f6588',
    500: '#2c4063',
    600: '#1c2d4d',
    700: '#122039',
    800: '#0c1729',
    900: '#070e1c',
    950: '#03070f',
  },

  orange: {
    50: '#fff3ec',
    100: '#ffe0cc',
    200: '#ffbf95',
    300: '#ff9a5a',
    400: '#fb7d2e',
    500: '#ec6411',
    600: '#cc4f06',
    700: '#a13d05',
    800: '#6e2a04',
  },

  green: {
    50: '#ecfaef',
    100: '#d0f3d9',
    200: '#9ae5ad',
    300: '#5fd07c',
    400: '#2eb555',
    500: '#0f8f3a',
    600: '#0a722e',
    700: '#085824',
  },

  blue: {
    50: '#ecf3ff',
    100: '#d0e1ff',
    200: '#99bcff',
    300: '#5d92f7',
    400: '#2f6fde',
    500: '#1855bd',
    600: '#114495',
  },

  neutral: {
    paper: '#f5f1ea',
    paper2: '#ebe5d9',
    bone: '#e2dccd',
    ink50: '#fafafa',
    ink100: '#f0f0f2',
    ink200: '#d9dade',
    ink300: '#adb1bc',
    ink400: '#6f7585',
    ink500: '#4a5060',
    ink600: '#2e3340',
    ink700: '#1c2029',
    ink800: '#0f1218',
  },

  semantic: {
    action: '#ec6411',
    actionHover: '#cc4f06',
    success: '#0f8f3a',
    info: '#2f6fde',
    warn: '#c98908',
    danger: '#c5343a',
  },

  bg: {
    DEFAULT: '#f5f1ea',
    elevated: '#ffffff',
    deep: '#070e1c',
    deep2: '#0c1729',
  },

  fg: {
    DEFAULT: '#070e1c',
    muted: '#4a5060',
    subtle: '#6f7585',
    onDeep: '#f5f1ea',
  },

  border: {
    DEFAULT: 'rgba(12, 23, 41, 0.10)',
    strong: 'rgba(12, 23, 41, 0.18)',
    deep: 'rgba(245, 241, 234, 0.10)',
    deepStrong: 'rgba(245, 241, 234, 0.18)',
  },
} as const

export const radius = {
  xs: '4px',
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '20px',
  '2xl': '28px',
  pill: '999px',
} as const

export const shadow = {
  xs: '0 1px 2px rgba(7, 14, 28, 0.06)',
  sm: '0 2px 6px rgba(7, 14, 28, 0.08), 0 1px 2px rgba(7, 14, 28, 0.04)',
  md: '0 8px 24px rgba(7, 14, 28, 0.10), 0 2px 6px rgba(7, 14, 28, 0.06)',
  lg: '0 24px 60px rgba(7, 14, 28, 0.18), 0 8px 24px rgba(7, 14, 28, 0.10)',
  xl: '0 40px 100px rgba(7, 14, 28, 0.28), 0 16px 40px rgba(7, 14, 28, 0.14)',
  glowOrange: '0 12px 40px -12px rgba(236, 100, 17, 0.55)',
  glowGreen: '0 12px 40px -12px rgba(15, 143, 58, 0.45)',
} as const

export const motion = {
  ease: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  dFast: '140ms',
  dBase: '220ms',
  dSlow: '420ms',
} as const

export const typography = {
  /** Instrument Serif 400 + italic — hero, h1, h2, citações grandes, números editoriais */
  fontDisplay: "'Instrument Serif', 'Times New Roman', serif",
  /** Geist 400/500/600/700 — h3-h6, body, botões, labels, navegação */
  fontSans: "'Geist', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
  /** Geist Mono 400/500 — métricas, tabelas, código, IDs */
  fontMono: "'Geist Mono', ui-monospace, 'JetBrains Mono', monospace",
  cssVars: {
    display: 'var(--ld-font-display)',
    sans: 'var(--ld-font-sans)',
    mono: 'var(--ld-font-mono)',
  },
  /** Escala tipográfica modular 1.25 (idêntica ao tokens.css) */
  scale: {
    '2xs': '11px',
    xs: '12px',
    sm: '14px',
    base: '16px',
    md: '18px',
    lg: '22px',
    xl: '28px',
    '2xl': '36px',
    '3xl': '48px',
    '4xl': '64px',
    '5xl': '88px',
    '6xl': '120px',
  },
} as const

export const spacing = {
  section: {
    padding: 'px-6 py-[120px]',
    paddingSmall: 'px-6 py-16',
  },
  container: 'mx-auto w-full max-w-[1280px] px-8',
  containerNarrow: 'mx-auto w-full max-w-[920px] px-8',
  containerWide: 'mx-auto w-full max-w-[1440px] px-12',
} as const
