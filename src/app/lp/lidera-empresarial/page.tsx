import type { Metadata } from 'next'
import {
  TrendingDown,
  Users,
  AlertTriangle,
  CheckCircle2,
  Target,
  Layers,
  GraduationCap,
  GitBranch,
  ArrowRight,
  Quote,
  Plus,
  XCircle,
  MessageCircle,
  Phone,
} from 'lucide-react'

import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import { LpLeadForm } from '@/components/lp/LpLeadForm'

export const metadata: Metadata = {
  title: 'Lidera Empresarial · Diagnóstico gratuito de liderança',
  description:
    'Seu melhor operador virou supervisor — e a produtividade caiu. Receba o diagnóstico do seu time de líderes em 5 minutos e um PDI executivo personalizado de 90 dias.',
  robots: { index: false, follow: false }, // página dedicada a tráfego pago
}

const WHATSAPP_HREF =
  'https://wa.me/5564996099020?text=Quero%20fazer%20o%20diagn%C3%B3stico%20gratuito%20da%20Lidera%20para%20minha%20empresa'

const dores = [
  {
    icon: TrendingDown,
    titulo: 'Promoveu o melhor operador. A produtividade caiu.',
    descricao:
      'Ele era o melhor fazendo. Agora ele faz tudo — porque ninguém faz como ele. O time não cresce, ele se esgota.',
  },
  {
    icon: Users,
    titulo: 'Turnover não para. E a culpa cai no RH.',
    descricao:
      'Mas o problema não é recrutamento. É a chefia direta. As pessoas pedem demissão de chefes, não de empresas.',
  },
  {
    icon: AlertTriangle,
    titulo: 'Quem vai ser seu próximo gerente?',
    descricao:
      'Se a resposta é "não sei", você não tem problema de recrutamento — tem problema de sucessão.',
  },
]

const pilares = [
  {
    tag: 'Diagnóstico',
    icon: Target,
    titulo: 'Mapear cada líder com método, não com achismo',
    descricao:
      'Avaliação 360° + análise comportamental (DISC) + matriz 9-Box. Você sai com a foto exata de quem entrega, quem desenvolve, quem está parado.',
  },
  {
    tag: 'PDI 90 dias',
    icon: Layers,
    titulo: 'Plano individual por supervisor — não treinamento de massa',
    descricao:
      'Cada líder recebe metas claras, ferramentas (5W2H, GROW, PDCA, SBI) e KPIs comportamentais. Sem palestra. Sem dinâmica de abraço.',
  },
  {
    tag: 'Mentoria',
    icon: GraduationCap,
    titulo: 'Acompanhamento quinzenal de chão de fábrica',
    descricao:
      'O líder aplica, traz dúvida real, ajustamos. Quem mentora viveu operação — não é coach de internet.',
  },
  {
    tag: 'Sucessão',
    icon: GitBranch,
    titulo: 'Pipeline de liderança para os próximos 12-24 meses',
    descricao:
      'Identificamos quem tem potencial para crescer, em quanto tempo, e o que precisa desenvolver. Você para de apagar incêndio em vaga aberta.',
  },
]

const etapas = [
  { n: '1', titulo: 'Diagnóstico', descricao: 'Reunião de alinhamento (60 min) + avaliação dos líderes. Sem custo. Você recebe um relatório executivo em até 7 dias.' },
  { n: '2', titulo: 'PDI Executivo', descricao: 'Construímos o plano de 90 dias por supervisor: ferramentas, KPIs, marcos. Você aprova, a gente roda.' },
  { n: '3', titulo: 'Execução & Mentoria', descricao: 'Encontros quinzenais com cada líder. Aplicação prática, ajuste fino, indicadores reportados pra diretoria.' },
  { n: '4', titulo: 'Revisão & Sucessão', descricao: 'Ao fim dos 90 dias: relatório de evolução, próximos passos, plano de sucessão para 12-24 meses.' },
]

const depoimentos = [
  { quote: 'Em 90 dias três supervisores que estavam estagnados há anos passaram a entregar metas. O turnover caiu 40%. Não é mágica — é método.', autor: 'Diretor industrial · Metalúrgica · Catalão/GO' },
  { quote: 'A Lidera não vendeu sonho. Sentou com cada líder, abriu o problema, deu ferramenta. Hoje a operação roda sem eu apagar incêndio.', autor: 'Gerente de operações · Indústria alimentícia · SP' },
]

const naoSomos = [
  'Curso motivacional de fim de semana',
  'Coach de internet com frase de efeito',
  'Dinâmica de abraço e gritaria',
  'Treinamento genérico de prateleira',
  'Slide bonito sem aplicação',
]

const somos = [
  'Diagnóstico técnico de cada líder',
  'PDI individual com prazo e KPI',
  'Ferramentas testadas na operação real',
  'Mentoria com quem viveu chão de fábrica',
  'Indicadores reportados à diretoria',
]

const faqs = [
  { q: 'Quanto custa o diagnóstico?', a: 'Zero. O diagnóstico inicial é gratuito e dura cerca de 5 minutos para o cadastro + 60 minutos de reunião. Você recebe um relatório executivo sem compromisso de contratação.' },
  { q: 'Em quanto tempo vejo resultado?', a: 'Os primeiros sinais comportamentais aparecem entre 30 e 45 dias (mudança de postura, delegação, qualidade de feedback). Indicadores operacionais (produtividade, turnover, atraso) costumam reagir entre 60 e 120 dias.' },
  { q: 'Vocês atendem fora de SP e Catalão?', a: 'Sim. O programa tem componente online (mentoria quinzenal por vídeo) e presencial pontual. Atendemos Brasil inteiro, mas o programa presencial completo está disponível para SP capital e região + Catalão e entorno.' },
  { q: 'Funciona para empresa pequena?', a: 'Funciona a partir de 1 líder. Não existe tamanho mínimo. A diferença é o formato: empresas com 1–5 líderes operam em programa enxuto; acima disso entra plano corporativo com cohorts.' },
  { q: 'Como mede o ROI?', a: 'Antes de começar, definimos 3 a 5 KPIs operacionais e comportamentais (turnover, retrabalho, NPS interno, tempo de resposta, score 9-Box). Mensalmente comparamos contra baseline. Você recebe o relatório.' },
  { q: 'É reconhecido pelo RH ou só pelos líderes?', a: 'O programa é desenhado pra ser comprado pelo decisor (diretor, dono, head) e operado em parceria com o RH. Quando o RH conduz sozinho, o programa também roda — mas o impacto é maior com sponsor executivo.' },
]

export default function LideraEmpresarialPage() {
  return (
    <div className="min-h-screen bg-ld-navy-900 text-ld-paper">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(800px 400px at 80% -10%, rgba(236,100,17,0.18), transparent 60%), radial-gradient(600px 300px at 0% 100%, rgba(24,85,189,0.12), transparent 60%)',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-16 lg:pt-28 lg:pb-24">
          <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20 lg:items-start">
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-ld-orange-500">
                Lidera Empresarial · B2B
              </span>
              <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-ld-paper sm:text-5xl lg:text-6xl">
                Seu supervisor é bom <span className="text-ld-orange-500">técnico</span>,
                <br />
                mas não <span className="text-ld-orange-500">lidera</span>?
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ld-paper/85">
                Diagnóstico gratuito + PDI executivo de 90 dias para cada supervisor da sua operação — com ferramentas, KPIs e plano de ação.
                <br />
                <strong className="text-ld-paper">5 minutos. Sem cartão. Sem ligação de vendas.</strong>
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#diagnostico" className="inline-flex items-center gap-2 rounded-full bg-ld-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(236,100,17,0.55)] transition-all hover:-translate-y-0.5 hover:bg-ld-orange-400">
                  Fazer diagnóstico gratuito
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#metodo" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-transparent px-6 py-3.5 text-sm font-semibold text-ld-paper transition-all hover:border-white/25 hover:bg-ld-navy-800">
                  Ver o método
                </a>
              </div>
              <div className="mt-10 flex flex-wrap gap-8 border-t border-white/10 pt-7">
                {[
                  { label: 'Atendimento', value: 'SP · Catalão/GO' },
                  { label: 'Formato', value: 'Presencial + Online' },
                  { label: 'Aplicação', value: 'Indústria · Médio porte' },
                ].map((t) => (
                  <div key={t.label}>
                    <div className="text-[11px] uppercase tracking-[0.15em] text-ld-paper/55">{t.label}</div>
                    <div className="mt-1 font-heading text-sm font-bold text-ld-paper">{t.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div id="diagnostico" className="lg:pt-2">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-ld-orange-500/12 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ld-orange-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Diagnóstico gratuito · sem compromisso
              </div>
              <LpLeadForm
                origem="lp_empresarial"
                accent="orange"
                ctaLabel="Quero o diagnóstico gratuito"
                nextStepHref="/treinamento/autoavaliacao"
                nextStepLabel="Continuar para o questionário"
              />
              <p className="mt-3 text-xs text-ld-paper/55">
                Seus dados ficam só com a Lidera. Não vendemos lista nem disparamos spam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DOR */}
      <section className="border-t border-white/5 bg-ld-navy-900 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ld-orange-500">A dor que você reconhece</span>
            <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight text-ld-paper sm:text-4xl lg:text-5xl">
              Você não tem um problema técnico.<br />Tem um problema de liderança.
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {dores.map((d, i) => (
              <article key={i} className="group rounded-2xl border border-white/8 bg-ld-navy-800 p-8 transition-all hover:-translate-y-1 hover:border-ld-orange-500/30">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ld-orange-500/10 text-ld-orange-400">
                  <d.icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-xs uppercase tracking-[0.12em] text-ld-orange-500">0{i + 1}</span>
                <h3 className="mt-2 font-heading text-xl font-bold text-ld-paper">{d.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ld-paper/70">{d.descricao}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTO INVISÍVEL */}
      <section className="bg-gradient-to-b from-ld-navy-900 to-ld-navy-800 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ld-orange-500">Custo invisível</span>
              <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight text-ld-paper sm:text-4xl lg:text-5xl">
                O turnover não é problema de RH.<br />É de <span className="text-ld-orange-500">liderança.</span>
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-ld-paper/80">
                Recrutamento, treinamento, retrabalho, atraso de entrega, perda de cliente. Cada desligamento de operador qualificado sangra a operação — e quase sempre a raiz é a mesma: a relação com a chefia direta.
              </p>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-ld-paper/80">
                Antes de contratar mais um supervisor, descubra o que está faltando nos que você já tem.
              </p>
              <a href="#diagnostico" className="mt-7 inline-flex items-center gap-2 rounded-full bg-ld-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(236,100,17,0.55)] transition-all hover:-translate-y-0.5 hover:bg-ld-orange-400">
                Ver onde está vazando
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { value: '3-9×', label: 'o salário mensal — custo médio de um desligamento qualificado' },
                { value: '70%', label: 'dos pedidos de demissão estão ligados ao relacionamento com a chefia direta' },
                { value: '90 dias', label: 'é o ciclo mínimo para reconfigurar um time sob nova liderança' },
              ].map((s, i) => (
                <div key={i} className="flex items-baseline gap-6 rounded-2xl border border-white/8 border-l-4 border-l-ld-orange-500 bg-ld-navy-800/80 px-7 py-6">
                  <span className="font-mono text-3xl font-bold text-ld-orange-500 min-w-[100px]">{s.value}</span>
                  <span className="text-sm leading-snug text-ld-paper/85">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MÉTODO */}
      <section id="metodo" className="border-t border-white/5 bg-ld-navy-900 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ld-orange-500">Método Lidera</span>
            <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight text-ld-paper sm:text-4xl lg:text-5xl">
              Quatro pilares.<br />Zero motivação vazia.
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {pilares.map((p, i) => (
              <article key={i} className="rounded-2xl border border-white/8 bg-ld-navy-800 p-9 transition-colors hover:border-ld-orange-500/30">
                <div className="mb-5 flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-ld-orange-500/10 text-ld-orange-400">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <span className="inline-block rounded-full bg-ld-orange-500/12 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-ld-orange-400">{p.tag}</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-ld-paper">{p.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ld-paper/75">{p.descricao}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="bg-gradient-to-b from-ld-navy-900 to-ld-navy-800 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ld-orange-500">Como funciona</span>
            <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight text-ld-paper sm:text-4xl lg:text-5xl">
              Sem mistério.<br />Quatro etapas, prazo definido.
            </h2>
          </div>
          <ol className="mt-14 flex max-w-4xl flex-col gap-4">
            {etapas.map((e) => (
              <li key={e.n} className="grid grid-cols-[64px_1fr] items-start gap-6 rounded-2xl border border-white/8 bg-ld-navy-800/80 p-7 sm:grid-cols-[80px_1fr]">
                <span className="font-mono text-4xl font-bold leading-none text-ld-orange-500 sm:text-5xl">{e.n}</span>
                <div>
                  <h3 className="font-heading text-xl font-bold text-ld-paper">{e.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ld-paper/75">{e.descricao}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section id="depoimentos" className="border-t border-white/5 bg-ld-navy-900 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ld-orange-500">Resultados</span>
            <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight text-ld-paper sm:text-4xl lg:text-5xl">
              Quem aplicou parou de apagar incêndio.
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {depoimentos.map((t, i) => (
              <blockquote key={i} className="rounded-2xl border border-white/8 bg-ld-navy-800 p-9">
                <Quote className="h-7 w-7 text-ld-orange-500" />
                <p className="mt-4 font-heading text-lg font-medium leading-relaxed text-ld-paper">{t.quote}</p>
                <cite className="mt-5 block text-xs not-italic uppercase tracking-[0.05em] text-ld-paper/55">{t.autor}</cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ANTI-COACH */}
      <section className="bg-gradient-to-br from-ld-orange-500 to-ld-orange-400 py-24 text-ld-navy-900">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ld-navy-900">Posicionamento</span>
          <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Lidera não é palco de palestra.<br />É chão de fábrica.
          </h2>
          <div className="mt-12 grid gap-5 text-left md:grid-cols-2">
            <div className="rounded-2xl bg-ld-navy-900/92 p-8 text-ld-paper">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.1em] text-[#ff8a8a]">O que NÃO somos</h3>
              <ul>
                {naoSomos.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 border-b border-white/10 py-3 text-sm last:border-b-0">
                    <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#ff8a8a]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-ld-navy-900/92 p-8 text-ld-paper">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.1em] text-ld-orange-400">O que somos</h3>
              <ul>
                {somos.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 border-b border-white/10 py-3 text-sm last:border-b-0">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-ld-orange-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FUNDADOR */}
      <section className="border-t border-white/5 bg-ld-navy-900 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[280px_1fr] lg:gap-16 lg:items-center">
          <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-ld-navy-800 to-ld-navy-700">
            <span className="font-heading text-7xl font-extrabold tracking-tight text-ld-orange-500/55">CC</span>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ld-orange-500">Quem conduz</span>
            <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight text-ld-paper sm:text-4xl">Claudemir Domingos</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ld-paper/80">
              Mais de 20 anos formando líderes em indústrias de médio e grande porte. Fundador da Lidera Treinamentos. Formação em gestão, certificado em DISC, Coaching Executivo e metodologias de chão de fábrica.
            </p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ld-paper/80">
              Trabalha com ferramenta — não com motivação vazia. Acredita que liderança é construída no contraponto: cobrar sem desmotivar, delegar sem perder controle, dar feedback que muda comportamento.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-gradient-to-b from-ld-navy-900 to-ld-navy-800 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ld-orange-500">Perguntas frequentes</span>
            <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight text-ld-paper sm:text-4xl lg:text-5xl">
              Antes de falar com a gente.
            </h2>
          </div>
          <div className="mt-12 flex max-w-3xl flex-col gap-3">
            {faqs.map((f, i) => (
              <details key={i} className="group rounded-2xl border border-white/8 bg-ld-navy-800/80 px-7 transition-colors open:border-ld-orange-500/35">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-heading text-base font-bold text-ld-paper sm:text-lg">
                  {f.q}
                  <Plus className="h-5 w-5 flex-shrink-0 text-ld-orange-500 transition-transform group-open:rotate-45" />
                </summary>
                <p className="pb-5 text-sm leading-relaxed text-ld-paper/75">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden border-t border-white/5 py-24 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(900px 500px at 50% 0%, rgba(236,100,17,0.18), transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-3xl px-6">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ld-orange-500">Próximo passo</span>
          <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight text-ld-paper sm:text-4xl lg:text-5xl">
            5 minutos pra começar.<br />
            <span className="text-ld-orange-500">90 dias</span> pra mudar a operação.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ld-paper/85">
            Diagnóstico gratuito, sem ligação de vendas chata. Você fala com o Claudemir direto pelo WhatsApp ou pelo formulário.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-full bg-ld-orange-500 px-7 py-4 text-base font-semibold text-white shadow-[0_12px_40px_-12px_rgba(236,100,17,0.55)] transition-all hover:-translate-y-0.5 hover:bg-ld-orange-400">
              <MessageCircle className="h-5 w-5" />
              Falar agora no WhatsApp
            </a>
            <a href="#diagnostico" className="inline-flex items-center gap-2.5 rounded-full border border-white/10 px-7 py-4 text-base font-semibold text-ld-paper transition-all hover:border-white/25 hover:bg-ld-navy-800">
              <Phone className="h-5 w-5" />
              Preencher diagnóstico
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
