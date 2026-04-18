# Lidera Design System — Premium Edition

## 1. Concept & Vision

Lidera is a premium Brazilian corporate training platform — *"A Netflix da Educação"*. The design conveys **authority without arrogance**: dark, immersive backgrounds that make content glow, glass surfaces that suggest depth, and vibrant accent colors that reward engagement. The experience feels like stepping into an exclusive members-only space where learning is both aspirational and achievable.

**Emotional targets:** Confident · Immersive · Community-driven · Progress-focused

---

## 2. Design Language

### 2.1 Aesthetic Direction

**Reference:** Netflix meets Linear meets Vercel — dark luxury with purposeful color. Not generic "SaaS dark mode." Every surface has intentional depth. Color is earned, not decorative.

### 2.2 Color Palette

#### Core Palette (CSS Variables)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#6366F1` | Indigo — CTAs, active states, primary actions |
| `--color-primary-hover` | `#818CF8` | Indigo light — hover states |
| `--color-primary-glow` | `rgba(99,102,241,0.25)` | Shadows, glows |
| `--color-secondary` | `#8B5CF6` | Violet — secondary accents, gradients |
| `--color-accent` | `#F59E0B` | Amber — trending, highlights, XP |
| `--color-success` | `#10B981` | Emerald — completion, online status, streaks |
| `--color-danger` | `#EF4444` | Red — errors, destructive actions |

#### Background Scale (Dark Theme)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-base` | `#030712` | Page background |
| `--bg-primary` | `#0A0F1E` | Section backgrounds |
| `--bg-secondary` | `#0D1424` | Cards, elevated surfaces |
| `--bg-card` | `#0F1729` | Component backgrounds |
| `--bg-glass` | `rgba(10,15,30,0.80)` | Glass surfaces |

#### Text Scale

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#FFFFFF` | Headings, primary text |
| `--text-secondary` | `rgba(255,255,255,0.70)` | Body text |
| `--text-tertiary` | `rgba(255,255,255,0.50)` | Captions, metadata |
| `--text-muted` | `rgba(255,255,255,0.40)` | Placeholders, disabled |

#### Border & Divider Scale

| Token | Hex | Usage |
|-------|-----|-------|
| `--border-subtle` | `rgba(255,255,255,0.05)` | Card borders |
| `--border-default` | `rgba(255,255,255,0.10)` | Section dividers |
| `--border-strong` | `rgba(255,255,255,0.20)` | Hover borders |

### 2.3 Typography

**Heading Font:** Sora (Google Fonts) — geometric, modern, confident

```
font-family: 'Sora', system-ui, sans-serif
```

**Body Font:** Inter (Google Fonts) — clean, highly legible

```
font-family: 'Inter', system-ui, sans-serif
```

#### Type Scale

| Class | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `text-hero` | clamp(3rem, 1rem + 7vw, 8rem) | 800 | 1.1 | Hero headlines |
| `font-heading` | — | 700+ | tight | All headings |
| `text-4xl` | 2.25rem | 700 | 1.2 | Section titles |
| `text-2xl` | 1.5rem | 700 | 1.3 | Card titles |
| `text-xl` | 1.25rem | 600 | 1.4 | Subheadings |
| `text-base` | 1rem | 400 | 1.6 | Body text |
| `text-sm` | 0.875rem | 400 | 1.5 | Captions |
| `text-xs` | 0.75rem | 500 | 1.4 | Labels, badges |

### 2.4 Spacing System

Base unit: 4px. All spacing uses multiples.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Tight gaps |
| `--space-sm` | 8px | Icon padding |
| `--space-md` | 16px | Card padding |
| `--space-lg` | 24px | Section gaps |
| `--space-xl` | 32px | Component spacing |
| `--space-2xl` | 48px | Section padding |
| `--space-section` | clamp(4rem, 3rem + 5vw, 10rem) | Major section vertical rhythm |

### 2.5 Motion Philosophy

**Core principle:** Motion clarifies, never decorates. Every animation has a purpose.

#### Timing Tokens

| Token | Duration | Usage |
|-------|----------|-------|
| `--duration-fast` | 150ms | Micro-interactions (hover, focus) |
| `--duration-normal` | 300ms | State transitions |
| `--duration-slow` | 500ms | Entrance animations |
| `--duration-slower` | 700ms | Complex transitions |

#### Easing

```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);  /* Primary entrance */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);      /* Standard transitions */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy interactions */
```

#### Animation Patterns

| Pattern | Usage |
|---------|-------|
| `animate-fade-up` | Staggered card entrance (80ms delay between items) |
| `animate-ping` | Live/online indicator pulse |
| `animate-glow-pulse` | Premium CTA glow effect |
| Scale + shadow on hover | Netflix-style card hover (scale 1.02, shadow lift) |

### 2.6 Visual Assets

**Icons:** Lucide React — consistent 1.5px stroke weight, 24px default size.

**Decorative Elements:**
- Gradient edge fades on horizontal carousels (8px on mobile, 16px on desktop)
- Glass surfaces: `backdrop-blur-xl` + `bg-white/[0.02]` + `border-white/5`
- Glow effects: `shadow-[0_24px_80px_-20px_rgba(99,102,241,0.25)]`

---

## 3. Layout & Structure

### 3.1 Page Architecture

```
┌─────────────────────────────────────────────────────┐
│  Header Bar (gamificação — streak, XP, rank)        │  ← 48px strip
├─────────────────────────────────────────────────────┤
│  Navigation Header (nav links, auth)                │  ← 64px, rounded-2xl, glass
├─────────────────────────────────────────────────────┤
│  Hero Section                                        │  ← Full viewport height
│  ┌─────────────────────────────────────────────┐   │
│  │  Course Shelf (horizontal scroll carousel)   │   │
│  │  ← [card][card][card][card] →                │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │  Community Section (activity feed + stats)   │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │  Footer (links, social, legal)               │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### 3.2 Container System

| Breakpoint | Max Width | Padding |
|------------|-----------|---------|
| Mobile | 100% | 16px |
| Tablet | 768px+ | 24px |
| Desktop | 1024px+ | 32px |
| Wide | 1280px+ | 48px |

### 3.3 Responsive Strategy

- **Mobile-first** with progressive enhancement
- Carousels: 1.2 cards visible on mobile → 5 cards on 1440px+
- Header collapses to hamburger at `md` breakpoint
- Card widths use CSS `min()` with viewport fractions, not fixed breakpoints

---

## 4. Components

### 4.1 CourseShelf

Horizontal scroll carousel with Netflix-style presentation.

**Variants:**

| Variant | Accent Color | Icon | Label |
|---------|-------------|------|-------|
| `continue` | `text-emerald-400` | Flame | "Continue assistindo" |
| `trending` | `text-amber-400` | Flame | "Em alta" |
| `community` | `text-violet-400` | Users | "Comunidade" |
| `recommended` | `text-indigo-400` | — | — |
| `all` | `text-white/60` | — | — |

**Features:**
- Chevron navigation (hidden when at scroll boundary)
- Staggered `fade-up` animation (80ms delay per card)
- Live count badge: "X pessoas assistindo agora" with pulsing green dot
- "Ver mais" dashed card at end of shelf
- Gradient edge fades on both sides

**Card widths:**
- Mobile: `calc((100vw - 128px) / 1.2)`
- Tablet: `calc((100vw - 192px) / 2.5)`
- Desktop: `calc((100vw - 256px) / 3.5)`
- Wide: `300px`

### 4.2 CourseCard

Three display variants:

**`default` (Netflix-style):**
- Aspect-video thumbnail with hover zoom (scale 1.10)
- Play overlay on hover (opacity 0 → 1)
- Category pill (bottom-left)
- Badge pills (top-left): `new`, `bestseller`, `updated`, `coming-soon`
- Progress bar at bottom for in-progress courses
- Completion badge (emerald) for 100% progress
- Instructor avatar + name
- Duration + rating metadata

**`compact`:** Horizontal layout for lists — 16:9 thumbnail, title, instructor, inline progress bar, arrow navigation.

**`horizontal`:** Grid layout — 200px thumbnail, full metadata, larger format.

### 4.3 AvatarStack

Overlapping avatar group with `+N` overflow indicator.

**Sizes:** `sm` (h-7), `md` (h-9), `lg` (h-11)

**Features:**
- Overlap: `-ml-2` to `-ml-3` depending on size
- Online indicator dot (emerald, bottom-right) when `href` is undefined
- `+N` indicator for overflow
- Label: "X de Y pessoas" when overflow exists

### 4.4 ActivityFeed

Community activity stream with 6 activity types:

| Type | Icon | Color | Content |
|------|------|-------|---------|
| `course_completed` | CheckCircle | emerald | Course title + completion time |
| `course_started` | Play | indigo | Course title + timestamp |
| `xp_milestone` | Zap | amber | XP amount + new total |
| `badge_earned` | Award | violet | Badge name + tier |
| `comment` | Message | white/50 | Comment preview + author |
| `reaction` | Heart | rose | Reaction count + target |

**Features:**
- `formatTimeAgo()` in pt-BR ("há 2 minutos", "há 3 horas", "há 1 dia")
- Reaction and comment counts
- Skeleton loader for loading states
- Gradient fade at bottom with "Ver mais" link

### 4.5 Gamification Components

#### Streak

```tsx
<Streak days={7} size="sm" />
```

- Fire emoji + day count
- Milestone rings at 7, 30, 100 days
- Compact pill format in header

#### XPBadge

```tsx
<XPBadge xp={2450} tier="Ouro" size="sm" />
```

- Lightning bolt icon
- Current XP number
- Tier badge: Bronze / Prata / Ouro / Diamante
- Sizes: `sm` (header), `md` (profile)

#### RankBadge

```tsx
<RankBadge rank={1} />
```

- 🥇 / 🥈 / 🥉 for top 3
- Number badge for 4+
- Sizes: `sm`, `md`, `lg`

#### CommunityStats

Three-metric dashboard widget:
- Total de alunos (Users icon)
- Assistindo agora (Zap icon + pulsing dot)
- Aulas concluídas (CheckCircle icon)

### 4.6 Header (SiteHeader)

**States:**
- **Dark context** (over hero): `bg-[#0A0F1E]/80`, white text, `border-white/10`
- **Solid** (scrolled or mobile open): Same or white background with dark text

**Elements:**
- Logo with animated dot (scale on hover)
- Navigation links with active state highlighting
- Auth section: Login + "Começar agora" buttons OR Streak + XPBadge + "Meu progresso" button
- Mobile hamburger menu (collapsed nav on `md` breakpoint)

### 4.7 Footer (SiteFooter)

**Sections:**
- **Banner card:** "Lidera Corporate Engine" — gradient card with headline + dual CTAs
- **Brand column:** Logo, description, social icons (Instagram, LinkedIn, YouTube)
- **Link columns:** Plataforma, Corporativo, Governança
- **Bottom bar:** Copyright + "Operação Brasil" + email

---

## 5. Pattern Library

### 5.1 Glass Surface

```tsx
<div className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl" />
```

### 5.2 Premium Card Hover

```tsx
<div className="transition-all duration-400 hover:border-white/15 hover:shadow-[0_24px_80px_-20px_rgba(99,102,241,0.25)] hover:scale-[1.02]" />
```

### 5.3 Live Indicator

```tsx
<span className="relative flex h-2 w-2">
  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
</span>
```

### 5.4 Section Edge Fade

```tsx
<div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#030712] to-transparent lg:w-16" />
<div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#030712] to-transparent lg:w-16" />
```

### 5.5 Staggered Animation

```tsx
<div
  className="animate-fade-up opacity-0"
  style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
>
  {children}
</div>
```

---

## 6. Accessibility

- All interactive elements have visible focus states
- Color is never the sole indicator of state (icons + color for status)
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text
- `prefers-reduced-motion` respected via Tailwind's `motion-reduce:` variant
- Semantic HTML throughout: `<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`
- ARIA labels on icon-only buttons (scroll navigation, mobile menu)

---

## 7. Implementation Notes

### Color Token Migration

All hardcoded hex colors should be replaced with Tailwind equivalents:

| Old Hex | Tailwind Token |
|---------|---------------|
| `#1E88E5` | `indigo-500` |
| `#4CAF50` | `emerald-500` |
| `#F57C00` | `amber-500` |
| `#050A14` | `[#030712]` |
| `#0C1629` | `bg-[#030712]` |
| `#22314C` | `border-white/5` |
| `#7FA0C2` | `text-white/40` |
| `#9FB2CB` | `text-white/40` |
| `#D8E4F5` | `text-white/70` |
| `#2B405F` | `border-white/10` |
| `#4CAF50` | `bg-emerald-500` |

### File Organization

```
src/
├── app/
│   ├── page.tsx                 # Homepage with all sections
│   └── globals.css              # Design tokens + utilities
├── components/
│   ├── premium/
│   │   ├── course/
│   │   │   ├── CourseCard.tsx   # 3 variants
│   │   │   ├── CourseShelf.tsx  # Carousel container
│   │   │   └── CourseProgressBar.tsx  # Streak, XP, Rank
│   │   └── community/
│   │       ├── ActivityFeed.tsx # Activity stream
│   │       └── AvatarStack.tsx  # Avatar groups
│   └── site/
│       ├── Header.tsx           # Site navigation
│       └── Footer.tsx           # Site footer
└── lib/
    └── design-tokens.ts         # CSS variable exports
```

### Key Dependencies

```json
{
  "framer-motion": "^12.x",
  "lucide-react": "latest",
  "tailwind-merge": "latest",
  "clsx": "latest"
}
```

---

*Version 1.0 — Premium Edition. Built for Lidera Treinamentos.*