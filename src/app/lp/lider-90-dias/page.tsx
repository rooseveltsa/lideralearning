import type { Metadata } from 'next'
import {
  Flame,
  BookOpen,
  Compass,
  CheckCircle2,
  MessageSquare,
  Hand,
  ClipboardCheck,
  UsersRound,
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
  title: 'Lidera · 90 dias para virar o líder que sua empresa precisa',
  description:
    'Você foi promovido por ser bom técnico, mas ninguém te ensinou a liderar. Faça o diagnóstico gratuito e receba um PDI personalizado de 90 dias.',
  robots: { index: false, follow: false }, // página dedicada a tráfego pago
}

const WHATSAPP_HREF =
  'https://wa.me/5564996099020?text=Quero%20meu%20diagn%C3%B3stico%20gratuito%20de%20lideran%C3%A7a%20%E2%80%94%20programa%2090%20dias'

const dores = [
  {
    icon: Flame,
    titulo: 'Você faz tudo porque ninguém faz como você',
    descricao:
      'Toda decisão passa por você. Toda urgência cai no seu colo. Não tem como crescer mais — virou o gargalo da própria operação.',
  },
  {
    icon: BookOpen,
    titulo: 'Cobra mas não consegue manter o time motivado',
    descricao:
      'Quando puxa o cinto, vira chefe ruim. Quando alivia, ninguém entrega. Sem método pra dar feedback, sobra cobrança e falta engajamento.',
  },
  {
    icon: Compass,
    titulo: 'Trabalha mais que todo mundo — e ainda parece pouco',
    descricao:
      'Chega em casa esgotado, fim de semana pensando em trabalho. E o time depende de você pra tudo, do começo ao fim.',
  },
]

const ferramentas = [
  {
    tag: 'Feedback',
    icon: MessageSquare,
    titulo: 'SBI — feedback que muda comportamento',
    descricao:
      'Modelo em 3 passos pra falar do fato, do impacto e do que precisa mudar — sem virar chefe chato nem deixar passar. Pronto pra usar segunda de manhã.',
  },
  {
    tag: 'Delegação',
    icon: Hand,
    titulo: 'GROW — delegar sem perder controle',
    descricao:
      'Pergunta certa na hora certa: você para de dar resposta pronta e o time começa a pensar. Em 30 dias eles trazem solução, não problema.',
  },
  {
    tag: 'Execução',
    icon: ClipboardCheck,
    titulo: '5W2H + PDCA — método de chão de fábrica',
    descricao:
      'Plano de ação que sai do post-it e vai pra realidade. Você acompanha sem ser micro-gerente — e cobra sem precisar gritar.',
  },
  {
    tag: 'Pessoas',
    icon: UsersRound,
    titulo: 'DISC + 9-Box — leitura de gente, não de cabeça',
    descricao:
      'Para de bater de frente com gente que não é igual a você. Aprende a ler perfil, ajustar comunicação e identificar quem tem potencial de crescer.',
  },
]

const etapas = [
  { n: '1', titulo: 'Diagnóstico (5 min + 60 min)', descricao: 'Você responde um questionário rápido, e marca uma conversa com o Claudemir. Sem custo, sem compromisso. Sai com o seu perfil DISC e o mapa do que precisa desenvolver.' },
  { n: '2', titulo: 'PDI personalizado de 90 dias', descricao: 'Plano sob medida pro seu cargo, seu time e seu setor. Não é vídeo aula genérico — é o que VOCÊ precisa fazer nos próximos 90 dias.' },
  { n: '3', titulo: 'Aplicação + mentoria quinzenal', descricao: 'A cada 15 dias você senta com o mentor. Conta o que aplicou, o que travou, ajusta a rota. Sem encheção, sem dever de casa motivacional.' },
  { n: '4', titulo: 'Reavaliação no dia 90', descricao: 'Comparamos o antes e o depois. Você sai com seu próprio playbook de liderança e o caminho pro próximo nível.' },
]

const depoimentos = [
  { quote: 'Eu achava que meu time era ruim. Era eu que não sabia liderar. Em 60 dias mudei a forma de dar feedback e o resultado virou — sem trocar uma pessoa.', autor: 'Encarregada de produção · 34 anos · SP' },
  { quote: 'Saí do operacional. Hoje eu coordeno e o time entrega. Antes eu fazia 70% do trabalho deles. Hoje eu desenvolvo gente — e ganhei tempo de respirar.', autor: 'Supervisor industrial · 41 anos · Catalão/GO' },
]

const naoTem = [
  'Vídeo motivacional com música de fundo',
  'Frase de impacto pra postar no LinkedIn',
  'Curso genérico de prateleira',
  'Dever de casa que não cabe na rotina',
  'Mentor que nunca pisou em operação',
]

const tem = [
  'Plano de 90 dias só seu, sob medida',
  '4 ferramentas prontas pra usar segunda',
  'Mentoria quinzenal com gente de chão',
  'Indicadores claros de evolução',
  'Seu próprio playbook de liderança',
]

const transformacoes = [
  { antes: 'Faz tudo sozinho', depois: 'Delega com segurança' },
  { antes: 'Cobra e desmotiva', depois: 'Dá feedback que muda comportamento' },
  { antes: 'Apaga incêndio o dia todo', depois: 'Antecipa problema com indicador' },
]

const faqs = [
  { q: 'Quanto custa o programa?', a: 'O diagnóstico inicial é 100% gratuito (questionário + conversa com o Claudemir). O programa completo de 90 dias tem investimento que varia de acordo com o formato (individual ou em grupo). A gente conversa o valor depois do diagnóstico, sem pressão de fechamento.' },
  { q: 'Quanto tempo por semana eu vou precisar?', a: 'Em média 2 a 3 horas por semana: 1 hora de mentoria a cada 15 dias + aplicação no dia a dia (que é o trabalho que você já faz, agora com método). Não é curso pra fazer fora do expediente — é prática integrada à sua rotina.' },
  { q: 'Funciona pra quem é coordenador / encarregado / supervisor júnior?', a: 'Sim. O programa atende qualquer pessoa que lidera time direto — de encarregado a gerente. O conteúdo é ajustado pro seu nível e pro tamanho do time.' },
  { q: 'Meu chefe não precisa aprovar?', a: 'Pra você fazer o programa por conta própria, não. Muitas vezes os profissionais começam por iniciativa própria e depois o resultado convence a empresa a continuar pagando. Se quiser que sua empresa banque, existe o modelo corporativo (versão B2B).' },
  { q: 'É online ou presencial?', a: 'Mentoria é online (vídeo). Aplicação acontece no seu trabalho real. Em SP capital e Catalão/GO, fazemos workshops presenciais opcionais 1x por ciclo.' },
  { q: 'Em quanto tempo eu vejo diferença?', a: 'A primeira ferramenta (SBI – feedback) você aplica na primeira semana e já sente a reação do time. Mudança consistente de rotina e percepção do time costuma aparecer entre 45 e 60 dias.' },
]

export default function Lider90DiasPage() {
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
                Líder em 90 dias · Diagnóstico gratuito
              </span>
              <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-ld-paper sm:text-5xl lg:text-6xl">
                Promovido por ser bom <span className="text-ld-orange-500">técnico</span>.
                <br />
                E <span className="text-ld-orange-500">agora</span>?
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ld-paper/85">
                Você faz tudo porque ninguém faz como você. Chega em casa esgotado. O time continua dependente.
                <br />
                <strong className="text-ld-paper">Ninguém te ensinou a liderar. A gente ensina — em 90 dias.</strong>
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#diagnostico" className="inline-flex items-center gap-2 rounded-full bg-ld-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(236,100,17,0.55)] transition-all hover:-translate-y-0.5 hover:bg-ld-orange-400">
                  Quero meu plano de 90 dias
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#metodo" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-transparent px-6 py-3.5 text-sm font-semibold text-ld-paper transition-all hover:border-white/25 hover:bg-ld-navy-800">
                  Ver o método
                </a>
              </div>
              <div className="mt-10 flex flex-wrap gap-8 border-t border-white/10 pt-7">
                {[
                  { label: 'Custo', value: 'Diagnóstico grátis' },
                  { label: 'Tempo', value: '5 min pra começar' },
                  { label: 'Formato', value: 'Online + Mentoria' },
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
                Diagnóstico gratuito · 5 minutos
              </div>
              <LpLeadForm
                origem="lp_pessoal"
                accent="orange"
                ctaLabel="Quero meu plano de 90 dias"
                nextStepHref="/treinamento/autoavaliacao"
                nextStepLabel="Continuar para o diagnóstico"
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
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ld-orange-500">A vida real do supervisor</span>
            <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight text-ld-paper sm:text-4xl lg:text-5xl">
              Você não está errado.<br />Só nunca te ensinaram.
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

      {/* ASPIRAÇÃO */}
      <section className="bg-gradient-to-b from-ld-navy-900 to-ld-navy-800 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ld-orange-500">O depois</span>
              <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight text-ld-paper sm:text-4xl lg:text-5xl">
                Em 90 dias você para de<br /><span className="text-ld-orange-500">apagar incêndio</span>.
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-ld-paper/80">
                Imagina chegar no fim do expediente sabendo que o time girou sem você precisar correr atrás. Não é sorte. Não é dom. É método.
              </p>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-ld-paper/80">
                Você sai do operacional reativo — aquele de bombeiro — pra liderar de verdade: desenvolver gente, delegar com segurança e ser reconhecido pelo que entrega, não pelas horas que faz.
              </p>
              <a href="#diagnostico" className="mt-7 inline-flex items-center gap-2 rounded-full bg-ld-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(236,100,17,0.55)] transition-all hover:-translate-y-0.5 hover:bg-ld-orange-400">
                Começar agora
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="flex flex-col gap-3">
              {transformacoes.map((t, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-2xl border border-white/8 border-l-4 border-l-ld-orange-500 bg-ld-navy-800/80 px-6 py-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-ld-paper/55">ANTES</span>
                    <span className="text-sm text-ld-paper/70 line-through decoration-ld-paper/30">{t.antes}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-ld-orange-500" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-ld-orange-500">DEPOIS</span>
                    <span className="text-sm font-semibold text-ld-paper">{t.depois}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FERRAMENTAS */}
      <section id="metodo" className="border-t border-white/5 bg-ld-navy-900 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ld-orange-500">O que você leva pra usar segunda de manhã</span>
            <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight text-ld-paper sm:text-4xl lg:text-5xl">
              Quatro ferramentas.<br />Nada motivacional.
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {ferramentas.map((p, i) => (
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
              Quatro etapas.<br />Prazo definido. Sem enrolação.
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
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ld-orange-500">Quem aplicou</span>
            <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight text-ld-paper sm:text-4xl lg:text-5xl">
              Pessoas reais.<br />Resultado mensurável.
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
            Não é motivação.<br />É ferramenta.
          </h2>
          <div className="mt-12 grid gap-5 text-left md:grid-cols-2">
            <div className="rounded-2xl bg-ld-navy-900/92 p-8 text-ld-paper">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.1em] text-[#ff8a8a]">Você NÃO vai ter</h3>
              <ul>
                {naoTem.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 border-b border-white/10 py-3 text-sm last:border-b-0">
                    <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#ff8a8a]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-ld-navy-900/92 p-8 text-ld-paper">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.1em] text-ld-orange-400">Você VAI ter</h3>
              <ul>
                {tem.map((item, i) => (
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
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ld-orange-500">Quem te mentora</span>
            <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight text-ld-paper sm:text-4xl">Claudemir Domingos</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ld-paper/80">
              20+ anos formando supervisores e coordenadores em indústrias. Não é coach de internet: cresceu no chão de fábrica e hoje conduz a Lidera. Já mentorou centenas de líderes operacionais no Centro-Oeste e Sudeste.
            </p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ld-paper/80">
              Trabalha com ferramenta, não com motivação. Acredita que liderança se aprende — desde que tenha quem ensine direito.
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
              Antes de chamar no WhatsApp.
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
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ld-orange-500">Último passo</span>
          <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight text-ld-paper sm:text-4xl lg:text-5xl">
            5 minutos pra começar.<br />
            <span className="text-ld-orange-500">90 dias</span> pra virar líder de verdade.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ld-paper/85">
            Diagnóstico gratuito, sem ligação chata de vendedor. Você conversa direto com o Claudemir pelo WhatsApp.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-full bg-ld-orange-500 px-7 py-4 text-base font-semibold text-white shadow-[0_12px_40px_-12px_rgba(236,100,17,0.55)] transition-all hover:-translate-y-0.5 hover:bg-ld-orange-400">
              <MessageCircle className="h-5 w-5" />
              Quero meu plano agora
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
