import Link from 'next/link'
import SiteFooter from '@/components/site/Footer'
import SiteHeader from '@/components/site/Header'
import { DiagnosticoCTA } from '@/components/diagnostico/DiagnosticoCTA'

export default function HomePage() {
  return (
    <div className="ld-deep">
      <SiteHeader />

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden px-0 py-16 md:py-20 lg:py-[120px]">
        {/* Background: setas ascendentes decorativas */}
        <div className="pointer-events-none absolute inset-0" style={{ opacity: 0.16 }}>
          <svg width="100%" height="100%" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="h-orange" x1="0" x2="0" y1="1" y2="0">
                <stop offset="0" stopColor="#ec6411" stopOpacity="0" />
                <stop offset="1" stopColor="#ec6411" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="h-green" x1="0" x2="0" y1="1" y2="0">
                <stop offset="0" stopColor="#0f8f3a" stopOpacity="0" />
                <stop offset="1" stopColor="#0f8f3a" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="h-blue" x1="0" x2="0" y1="1" y2="0">
                <stop offset="0" stopColor="#1855bd" stopOpacity="0" />
                <stop offset="1" stopColor="#1855bd" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path d="M-100 900 L600 200 L680 320 L20 900 Z" fill="url(#h-orange)" />
            <path d="M200 900 L900 100 L980 240 L320 900 Z" fill="url(#h-green)" />
            <path d="M500 900 L1300 180 L1500 320 L760 900 Z" fill="url(#h-blue)" />
          </svg>
        </div>

        <div className="ld-mw-xl relative">
          {/* Badge */}
          <span className="ld-badge-deep-line ld-badge">
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v6M12 14v6M4 12h6M14 12h6" />
              <path d="M18 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" fill="currentColor" stroke="none" />
            </svg>
            Formação de líderes &middot; Presencial + Digital
          </span>

          {/* Headline */}
          <h1
            className="ld-display mt-8"
            style={{ fontSize: 'clamp(3rem, 8vw, 7.5rem)', maxWidth: 1200, color: '#f5f1ea' }}
          >
            Formamos os líderes que a sua <em style={{ fontStyle: 'normal', color: '#fb7d2e' }}>operação precisa.</em>
          </h1>

          {/* Subheadline */}
          <p
            className="mt-9"
            style={{ color: 'rgba(245,241,234,0.78)', fontSize: 21, maxWidth: 640, lineHeight: 1.55 }}
          >
            Diagnóstico individualizado, imersão presencial de alto impacto e 60 dias de
            acompanhamento. Supervisores que saem da operação e assumem a{' '}
            <strong style={{ color: '#f5f1ea' }}>liderança de verdade.</strong>
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap gap-3">
            <DiagnosticoCTA className="ld-btn-primary ld-btn-primary-xl">
              Fazer diagnóstico gratuito
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </DiagnosticoCTA>
            <Link href="/empresas" className="ld-btn-outline-light ld-btn-primary-xl">
              Soluções para empresas
            </Link>
          </div>

          {/* Prova social inline */}
          <div className="mt-14 flex flex-wrap items-center gap-5">
            <div className="flex -space-x-2.5">
              {['#ec6411', '#0f8f3a', '#1855bd', '#122039', '#cc4f06'].map((c, i) => (
                <div
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ background: c, border: '2px solid #070e1c' }}
                >
                  {['CM', 'FP', 'RA', 'JP', 'AC'][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="flex gap-0.5" style={{ color: '#fb7d2e' }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <svg key={i} width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
                    <path d="m12 3 2.7 5.7 6.3.9-4.5 4.4 1 6.3L12 17.4 6.5 20.3l1-6.3L3 9.6l6.3-.9L12 3Z" />
                  </svg>
                ))}
              </div>
              <div className="mt-1 text-[13px]" style={{ color: 'rgba(245,241,234,0.78)' }}>
                <span style={{ color: '#f5f1ea', fontWeight: 600 }}>4.9</span> &middot; +500 supervisores formados &middot; NPS 72
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BARRA DE LOGOS ═══ */}
      <section
        className="hidden sm:block"
        style={{
          borderTop: '1px solid rgba(245,241,234,0.10)',
          borderBottom: '1px solid rgba(245,241,234,0.10)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <div className="ld-mw-xl flex flex-wrap items-center justify-center gap-4 py-8 sm:justify-between sm:gap-6">
          <span
            className="w-full text-center text-xs uppercase tracking-[0.14em] sm:w-auto sm:text-left"
            style={{ color: 'rgba(245,241,234,0.55)' }}
          >
            Empresas que formam líderes conosco
          </span>
          {['GRUPO ALFA', 'MERIDIAN', 'VOLTARE', 'NORTHCAP', 'PRISMO', 'ORION'].map((n) => (
            <span
              key={n}
              className="font-heading text-lg tracking-[0.08em] sm:text-2xl"
              style={{ color: 'rgba(245,241,234,0.45)' }}
            >
              {n}
            </span>
          ))}
        </div>
      </section>

      {/* ═══ MÉTRICAS — impacto na formação ═══ */}
      <section className="py-16 md:py-20 lg:py-[120px]" style={{ background: '#070e1c' }}>
        <div className="ld-mw-xl">
          <div className="mb-10 grid items-end gap-8 lg:mb-16 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="ld-eyebrow" style={{ color: '#fb7d2e' }}>Impacto mensurável</div>
              <h2 className="ld-display mt-4" style={{ fontSize: 'clamp(2rem, 5.5vw, 5rem)', color: '#f5f1ea' }}>
                Formação que vira <em style={{ fontStyle: 'normal', color: '#fb7d2e' }}>resultado</em>.
              </h2>
            </div>
            <p className="ld-body-lg" style={{ color: 'rgba(245,241,234,0.7)', fontSize: 19, maxWidth: 480 }}>
              Medimos o antes e o depois. Engajamento do time, retenção de talentos, execução gerencial — indicadores reais que mostram a transformação do líder.
            </p>
          </div>

          <div
            className="grid grid-cols-2 lg:grid-cols-4"
            style={{ borderTop: '1px solid rgba(245,241,234,0.10)', borderBottom: '1px solid rgba(245,241,234,0.10)' }}
          >
            {[
              { v: '+79%', l: 'Engajamento da equipe após formação' },
              { v: '−43%', l: 'Turnover nos primeiros 6 meses' },
              { v: '98%', l: 'Recomendam o programa' },
              { v: '91%', l: 'Aplicam na rotina após 60 dias' },
            ].map((s, i, a) => (
              <div
                key={s.l}
                className="p-8 lg:p-10"
                style={{ borderRight: i < a.length - 1 ? '1px solid rgba(245,241,234,0.10)' : 'none' }}
              >
                <div className="font-heading" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.75rem)', color: '#f5f1ea', lineHeight: 1, letterSpacing: '-0.025em' }}>
                  {s.v}
                </div>
                <div className="mt-3 text-sm" style={{ color: 'rgba(245,241,234,0.65)', maxWidth: 220 }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMO FUNCIONA — 3 passos ═══ */}
      <section className="py-16 md:py-20 lg:py-[120px]" style={{ background: '#f5f1ea' }}>
        <div className="ld-mw-xl">
          <div className="mb-10 lg:mb-16" style={{ maxWidth: 720 }}>
            <div className="ld-eyebrow">Como funciona</div>
            <h2 className="ld-h2 mt-4" style={{ color: '#070e1c' }}>
              Do <em style={{ fontStyle: 'normal', color: '#ec6411' }}>diagnóstico</em> à transformação real.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { n: '01', t: 'Diagnóstico de liderança', d: 'Autoavaliação das 5 dimensões de liderança. Você recebe o mapa completo de competências do seu time — onde estão os gaps e o que desenvolver.', c: '#ec6411' },
              { n: '02', t: 'Imersão presencial + Academy', d: 'Workshop intensivo de 2 dias com turmas de até 10 pessoas. Depois, acesso contínuo à plataforma digital com trilhas personalizadas por papel.', c: '#0f8f3a' },
              { n: '03', t: 'Acompanhamento de 60 dias', d: 'Mentoria pós-treinamento para garantir que o aprendizado vire prática. Sem isso, é teoria. Com isso, é transformação.', c: '#1855bd' },
            ].map((s) => (
              <div
                key={s.n}
                className="ld-card relative overflow-hidden p-9"
              >
                <div className="mb-8 flex items-start justify-between">
                  <div className="font-heading" style={{ fontSize: 'clamp(36px, 5vw, 56px)', color: s.c, lineHeight: 1, letterSpacing: '-0.025em' }}>
                    {s.n}
                  </div>
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: '#f1f4f9', color: s.c }}
                  >
                    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                      {s.n === '01' && <><circle cx="12" cy="12" r="9" /><path d="m15 9-2 6-6 2 2-6 6-2Z" /></>}
                      {s.n === '02' && <><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M8 7h2M8 11h2M8 15h2M14 7h2M14 11h2M14 15h2M10 21v-3h4v3" /></>}
                      {s.n === '03' && <><path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" /><path d="M8 6H5a3 3 0 0 0 3 3M16 6h3a3 3 0 0 1-3 3M9 18h6M10 14v4M14 14v4" /></>}
                    </svg>
                  </div>
                </div>
                <h4 className="ld-h5" style={{ margin: '0 0 10px', color: '#070e1c' }}>{s.t}</h4>
                <p className="ld-body" style={{ margin: 0 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ O QUE ESTÁ INCLUSO ═══ */}
      <section className="relative overflow-hidden py-16 md:py-20 lg:py-[120px]" style={{ background: '#070e1c' }}>
        <div className="ld-mw-xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <div className="ld-eyebrow" style={{ color: '#fb7d2e' }}>Programa completo</div>
              <h2 className="ld-display mt-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.75rem)', color: '#f5f1ea' }}>
                Tudo que o seu líder precisa para <em style={{ fontStyle: 'normal', color: '#fb7d2e' }}>crescer.</em>
              </h2>
              <p className="ld-body-lg mt-7" style={{ color: 'rgba(245,241,234,0.7)', fontSize: 18, maxWidth: 480 }}>
                Um programa completo que combina presencial e digital.
                Não é só conteúdo — é formação estruturada com acompanhamento e resultado mensurável.
              </p>

              <div className="mt-9 flex flex-col gap-3.5">
                {[
                  'Diagnóstico individualizado de liderança',
                  'PDI — Plano de Desenvolvimento Individual',
                  'Imersão presencial de 2 dias (turmas de até 10)',
                  'Acesso à Academy digital com 120+ cursos',
                  'Mentoria de acompanhamento 30 e 60 dias',
                  'Certificado verificável ao final da trilha',
                ].map((b) => (
                  <div key={b} className="flex items-center gap-3" style={{ color: '#f5f1ea' }}>
                    <div
                      className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full"
                      style={{ background: '#ec6411' }}
                    >
                      <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.5l4.5 4.5L20 7" />
                      </svg>
                    </div>
                    <span className="text-[15px]">{b}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex gap-3">
                <DiagnosticoCTA className="ld-btn-primary">
                  Começar pelo diagnóstico
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </DiagnosticoCTA>
              </div>
            </div>

            {/* Platform preview card — hidden on mobile */}
            <div className="relative hidden lg:block">
              <div
                className="rounded-2xl p-6"
                style={{
                  background: 'linear-gradient(180deg, #0c1729 0%, #070e1c 100%)',
                  border: '1px solid rgba(245,241,234,0.10)',
                  boxShadow: '0 40px 100px rgba(7, 14, 28, 0.28), 0 16px 40px rgba(7, 14, 28, 0.14)',
                }}
              >
                {/* Mini nav dots */}
                <div className="mb-6 flex items-center gap-2.5">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#fb7d2e' }} />
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#2eb555' }} />
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#2f6fde' }} />
                  </div>
                  <div
                    className="flex flex-1 items-center gap-1.5 rounded-md px-2.5"
                    style={{ height: 28, background: 'rgba(245,241,234,0.06)' }}
                  >
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="rgba(245,241,234,0.5)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.3-4.3" />
                    </svg>
                    <span className="text-[11px]" style={{ color: 'rgba(245,241,234,0.5)' }}>liderança situacional</span>
                  </div>
                </div>

                {/* Row: Trilha em andamento */}
                <div className="mb-3.5 flex items-baseline justify-between">
                  <h5 className="text-base font-semibold" style={{ color: '#f5f1ea' }}>Sua trilha de liderança</h5>
                  <span className="text-[11px]" style={{ color: '#fb7d2e' }}>Ver tudo →</span>
                </div>
                <div className="mb-6 grid grid-cols-3 gap-3">
                  {[
                    { t: 'Gestão de pessoas', a: 'Módulo 3', p: 72, c: 'linear-gradient(135deg,#1855bd,#070e1c)' },
                    { t: 'Feedback eficaz', a: 'Módulo 1', p: 38, c: 'linear-gradient(135deg,#0f8f3a,#122039)' },
                    { t: 'Tomada de decisão', a: 'Módulo 5', p: 88, c: 'linear-gradient(135deg,#ec6411,#070e1c)' },
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="flex flex-col justify-end overflow-hidden rounded-[10px] p-3"
                      style={{ background: c.c, height: 110 }}
                    >
                      <div className="text-xs font-semibold" style={{ color: '#f5f1ea' }}>{c.t}</div>
                      <div className="mb-2 text-[10px]" style={{ color: 'rgba(245,241,234,0.7)' }}>{c.a}</div>
                      <div className="h-[3px] w-full overflow-hidden rounded-full" style={{ background: 'rgba(245,241,234,0.18)' }}>
                        <div className="h-full rounded-full" style={{ width: `${c.p}%`, background: '#fb7d2e' }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Row: Recomendado */}
                <div className="mb-3.5">
                  <h5 className="text-base font-semibold" style={{ color: '#f5f1ea' }}>Para supervisores em transição</h5>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    { c: 'linear-gradient(135deg,#0f8f3a,#070e1c)', t: 'Delegação' },
                    { c: 'linear-gradient(135deg,#1855bd,#070e1c)', t: 'Comunicação' },
                    { c: 'linear-gradient(135deg,#ec6411,#122039)', t: '1:1 eficaz' },
                    { c: 'linear-gradient(135deg,#5d92f7,#070e1c)', t: 'Conflitos' },
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="flex flex-col justify-end rounded-lg p-2.5"
                      style={{ height: 92, background: c.c }}
                    >
                      <div className="text-[11px] font-medium" style={{ color: '#f5f1ea' }}>{c.t}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating chip */}
              <div
                className="absolute -right-2.5 -top-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white"
                style={{ background: '#0f8f3a', boxShadow: '0 12px 40px -12px rgba(15, 143, 58, 0.45)' }}
              >
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L20 7" />
                </svg>
                +500 líderes formados
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DEPOIMENTOS ═══ */}
      <section className="py-16 md:py-20 lg:py-[120px]" style={{ background: '#f5f1ea' }}>
        <div className="ld-mw-xl">
          <div className="mb-10 lg:mb-14" style={{ maxWidth: 720 }}>
            <div className="ld-eyebrow">Resultados reais</div>
            <h2 className="ld-h2 mt-4" style={{ color: '#070e1c' }}>
              Quem já passou pelo programa.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
            {/* Featured testimonial */}
            <div
              className="flex flex-col justify-between rounded-2xl p-8 md:col-span-2 md:p-10 lg:col-span-1"
              style={{ background: '#070e1c', color: '#f5f1ea', minHeight: 320 }}
            >
              <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(245,241,234,0.3)' }}>
                <path d="M6 9c0-2 2-4 4-4M6 9v5h5v-5H6ZM14 9c0-2 2-4 4-4M14 9v5h5v-5h-5Z" />
              </svg>
              <div className="font-heading mt-6" style={{ fontSize: 32, lineHeight: 1.15, letterSpacing: '-0.018em' }}>
                Em 90 dias o treinamento virou sistema de execução gerencial. Os supervisores assumiram a liderança de verdade.
              </div>
              <div className="mt-8 flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white" style={{ background: '#ec6411' }}>
                  CM
                </div>
                <div>
                  <div className="text-sm font-semibold">Carlos Mendes</div>
                  <div className="text-xs" style={{ color: 'rgba(245,241,234,0.6)' }}>Diretor de RH &middot; Grupo Industrial Alfa</div>
                </div>
              </div>
            </div>

            {/* Other testimonials */}
            {[
              { q: 'A operação ganhou clareza. Os times passaram a executar com consistência — sem depender do dono.', n: 'Fernanda Pacheco', r: 'CEO · TechBR Soluções', result: 'Meta de 62% para 91%' },
              { q: 'Conseguimos ligar formação e performance com dados reais de aplicação no dia a dia.', n: 'Ricardo Albuquerque', r: 'COO · Rede Varejista Nacional', result: '43% menos turnover' },
            ].map((t) => (
              <div
                key={t.n}
                className="ld-card flex flex-col justify-between p-8"
                style={{ minHeight: 380 }}
              >
                <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(7,14,28,0.2)' }}>
                  <path d="M6 9c0-2 2-4 4-4M6 9v5h5v-5H6ZM14 9c0-2 2-4 4-4M14 9v5h5v-5h-5Z" />
                </svg>
                <div>
                  <div className="font-heading mt-5" style={{ fontSize: 22, lineHeight: 1.25, color: '#070e1c' }}>
                    &ldquo;{t.q}&rdquo;
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: '#ecfaef', color: '#085824' }}>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 17 9 11l4 4 8-9M14 4h7v7" />
                    </svg>
                    {t.result}
                  </div>
                </div>
                <div className="mt-7">
                  <div className="text-sm font-semibold" style={{ color: '#070e1c' }}>{t.n}</div>
                  <div className="text-xs" style={{ color: '#4a5060' }}>{t.r}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DOIS CAMINHOS — Individual + Corporativo ═══ */}
      <section className="py-16 md:py-20 lg:py-[100px]" style={{ background: '#070e1c' }}>
        <div className="ld-mw-xl grid gap-6 md:grid-cols-2">
          {/* Para você */}
          <div
            className="rounded-2xl p-10 transition-all"
            style={{ border: '1px solid rgba(236,100,17,0.2)', background: 'linear-gradient(135deg, rgba(236,100,17,0.06), transparent)' }}
          >
            <div className="ld-eyebrow" style={{ color: '#fb7d2e' }}>Para você</div>
            <h3 className="mt-5 font-sans text-2xl font-bold" style={{ color: '#f5f1ea' }}>
              Treinamento Individual
            </h3>
            <p className="mt-3 text-[15px]" style={{ color: 'rgba(245,241,234,0.65)', lineHeight: 1.55 }}>
              Workshop presencial, autoavaliação, PDI personalizado e acesso à Academy digital.
              Para quem quer dar o próximo passo na carreira de liderança.
            </p>
            <Link href="/treinamento/modulo-1" className="ld-btn-primary mt-8">
              Ver próxima turma
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Para empresas */}
          <div
            className="rounded-2xl p-10 transition-all"
            style={{ border: '1px solid rgba(245,241,234,0.10)', background: 'linear-gradient(135deg, rgba(245,241,234,0.03), transparent)' }}
          >
            <div className="ld-eyebrow" style={{ color: 'rgba(245,241,234,0.55)' }}>Para empresas</div>
            <h3 className="mt-5 font-sans text-2xl font-bold" style={{ color: '#f5f1ea' }}>
              Programa Corporativo
            </h3>
            <p className="mt-3 text-[15px]" style={{ color: 'rgba(245,241,234,0.65)', lineHeight: 1.55 }}>
              Diagnóstico organizacional, trilhas por papel, dashboard de acompanhamento e mentoria dedicada.
              Para empresas que querem formar seus líderes em escala.
            </p>
            <Link href="/empresas" className="ld-btn-outline-light mt-8">
              Solicitar proposta
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="relative overflow-hidden py-16 md:py-20 lg:py-[120px]" style={{ background: '#070e1c' }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at 80% 50%, rgba(236,100,17,0.18), transparent 50%)' }} />
        <div className="ld-mw relative text-center">
          <div className="ld-eyebrow" style={{ color: '#fb7d2e' }}>Comece sua jornada</div>
          <h2 className="ld-display mx-auto mt-5" style={{ fontSize: 'clamp(2.5rem, 7vw, 6.875rem)', color: '#f5f1ea', maxWidth: 1100 }}>
            Descubra seu perfil de<br /><em style={{ fontStyle: 'normal', color: '#fb7d2e' }}>liderança.</em>
          </h2>
          <p className="mx-auto mt-8" style={{ color: 'rgba(245,241,234,0.7)', fontSize: 19, maxWidth: 580 }}>
            Autoavaliação gratuita em 5 minutos. Receba seu diagnóstico e Plano de Desenvolvimento Individual — sem compromisso.
          </p>
          <div className="mt-11 flex flex-wrap justify-center gap-3">
            <DiagnosticoCTA className="ld-btn-primary ld-btn-primary-xl">
              Fazer diagnóstico gratuito
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </DiagnosticoCTA>
            <a
              href="https://wa.me/5564996099020"
              target="_blank"
              rel="noopener noreferrer"
              className="ld-btn-outline-light ld-btn-primary-xl"
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
              </svg>
              Falar com Claudemir
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
