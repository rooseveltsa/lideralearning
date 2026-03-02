import { createClient } from '@/lib/supabase/server'
import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import LeadFormB2B from '@/components/site/LeadFormB2B'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, PlayCircle, Users2 } from 'lucide-react'

// ─── Dados ────────────────────────────────────────────────────────────────────

const dores = [
  {
    titulo: 'Crescimento Desordenado',
    descricao: 'Sua empresa escala, a operação infla, mas a linha de frente de gestão não suporta a pressão. O resultado é gargalo operacional.',
  },
  {
    titulo: 'Custo Oculto da Incompetência',
    descricao: 'Promover um excelente técnico sem método de gestão não gera um líder; gera a frustração e o turnover dos seus melhores talentos.',
  },
  {
    titulo: 'Eficácia vs. Motivação',
    descricao: 'O mercado corporativo não precisa de mais treinamentos motivacionais. Precisa de frameworks de execução implacáveis.',
  },
]

const diferenciais = [
  { icon: ShieldCheck, titulo: 'Metodologia de Trincheira', descricao: 'Nada de teorias acadêmicas obsoletas. Ensinamos gestão com base no que funciona hoje, no mercado brasileiro real.' },
  { icon: Users2, titulo: 'Grupos Ultra-Focados', descricao: 'Não somos uma plataforma de aulas gravadas para as massas. Somos uma consultoria de desenvolvimento de elites.' },
  { icon: TrendingUp, titulo: 'Impacto Mensurável', descricao: 'Cada programa é desenhado para retornar o investimento em até 90 dias através de retenção, eficiência e processos.' },
]

const trilha = [
  {
    nivel: '01',
    titulo: 'Gestão Operacional',
    publico: 'Coordenadores e Supervisores',
    competencias: ['Gestão de rotina e prioridades', 'Feedback estruturado e cobrança', 'Condução de reuniões de resultado'],
    duracao: '8 semanas',
    formato: 'Online ao vivo + Mentoria',
    destaque: false,
  },
  {
    nivel: '02',
    titulo: 'Liderança Executiva',
    publico: 'Gerentes e Heads de Área',
    competencias: ['Gestão de clima e retenção', 'OKRs e metas de time', 'Desenvolvimento de sucessores'],
    duracao: '10 semanas',
    formato: 'Online ao vivo + Consultoria',
    destaque: true,
  },
  {
    nivel: '03',
    titulo: 'Alta Performance C-Level',
    publico: 'Diretores e VPs',
    competencias: ['Pensamento estratégico aplicado', 'Cultura de alta performance', 'Gestão de conselho e stakeholders'],
    duracao: '12 semanas',
    formato: 'Presencial + Online + Mentoria 1:1',
    destaque: false,
  },
]

const depoimentos = [
  {
    iniciais: 'CM',
    nome: 'Carlos Mendes',
    cargo: 'Diretor de RH',
    empresa: 'Grupo Industrial Alfa',
    segmento: 'Indústria',
    texto: 'Reduzimos o turnover da linha de produção em 43% em seis meses. O método é brutalmente prático — meus gestores aplicaram desde a primeira semana.',
    resultado: '43% redução de turnover',
    cor: '#1565C0',
  },
  {
    iniciais: 'FP',
    nome: 'Fernanda Pacheco',
    cargo: 'CEO',
    empresa: 'TechBR Soluções',
    segmento: 'Tecnologia',
    texto: 'Nossa equipe passou de 62% para 91% de atingimento de meta trimestral. O ROI foi visível no primeiro trimestre e o CFO nunca mais questionou o orçamento de T&D.',
    resultado: 'de 62% → 91% de meta atingida',
    cor: '#1565C0',
  },
  {
    iniciais: 'RA',
    nome: 'Ricardo Albuquerque',
    cargo: 'COO',
    empresa: 'Rede Varejista Nacional',
    segmento: 'Varejo',
    texto: 'O dashboard corporativo virou ferramenta de board. Consigo mostrar para o Conselho a evolução de cada gestor em tempo real. T&D deixou de ser custo e virou estratégia.',
    resultado: 'T&D como KPI de board',
    cor: '#1565C0',
  },
]

const faq = [
  {
    pergunta: 'Funciona para qualquer segmento de mercado?',
    resposta: 'Sim. Nosso método foi desenhado para a realidade do mercado brasileiro e já foi aplicado em indústria, varejo, tecnologia, saúde e serviços. As competências de gestão — delegar, cobrar, dar feedback, reter talento — são universais. O contexto é adaptado no onboarding de cada empresa.',
  },
  {
    pergunta: 'Quanto tempo até ver resultados mensuráveis?',
    resposta: 'Os primeiros resultados aparecem entre 30 e 90 dias de programa. Cada semana tem um desafio prático que o gestor executa com sua equipe real. Não é formação para a gaveta — é formação para a segunda-feira.',
  },
  {
    pergunta: 'Como apresento o ROI para o CFO ou o board?',
    resposta: 'Nosso dashboard corporativo foi desenhado exatamente para isso. Ele exporta relatórios de evolução por competência, engajamento e NPS de liderança. Fornecemos também um modelo de apresentação de ROI que o seu RH adapta com os dados da empresa.',
  },
  {
    pergunta: 'Atendem empresas de qualquer porte?',
    resposta: 'Atendemos desde empresas com 5 gestores até corporações com 1.000+. Para equipes menores, indicamos nossas turmas abertas. Para empresas com 20+ gestores, desenhamos programas in-company ou configuramos a plataforma corporativa whitelabel.',
  },
  {
    pergunta: 'Como funciona o acompanhamento após o programa?',
    resposta: 'Oferecemos 90 dias de acompanhamento pós-programa com check-ins mensais de performance. Os gestores formados têm acesso permanente à comunidade Lidera e a sessões de atualização de método a cada trimestre.',
  },
  {
    pergunta: 'O que diferencia a Lidera de outros treinamentos corporativos?',
    resposta: 'Três coisas: (1) Método baseado em vivência executiva real, não em teoria acadêmica. (2) Turmas fechadas e ultra-focadas — não somos plataforma de massa. (3) Tecnologia de acompanhamento que transforma T&D em dado de negócio, não em gasto de RH.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const supabase = await createClient()
  const { data: cursos } = await supabase
    .from('courses')
    .select('id, title, description, price, thumbnail_url')
    .eq('is_published', true)
    .limit(3)

  return (
    <div className="bg-white text-[#111827] selection:bg-[#1565C0]/20">
      <SiteHeader />

      {/* ══════════════════════════════
          HERO — SPLIT LAYOUT
          Texto esquerda · Dashboard direita
      ══════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center pt-28 pb-20 px-6 overflow-hidden bg-white">

        {/* Dot grid: textura ambiente, nunca protagonista */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{ backgroundImage: 'radial-gradient(circle, #1565C0 0.6px, transparent 0.6px)', backgroundSize: '24px 24px' }}
        />

        {/* Gradiente radial suave no canto superior direito */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1565C0]/[0.04] rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />

        <div className="max-w-[1200px] mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-[55fr_45fr] gap-12 xl:gap-20 items-center">

            {/* ── Coluna esquerda: copy ── */}
            <div className="flex flex-col">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1565C0]/5 text-[#1565C0] text-sm font-semibold mb-8 w-fit animate-fade-up border border-[#1565C0]/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1565C0] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1565C0]" />
                </span>
                Nova Formação Executiva
              </div>

              {/* Headline — left-aligned, tracking tight, tamanho que domina */}
              <h1
                className="text-5xl md:text-6xl xl:text-[4.25rem] font-heading font-extrabold text-[#111827] leading-[1.05] tracking-tight mb-6 animate-fade-up"
                style={{ animationDelay: '100ms' }}
              >
                Transformamos chefes operacionais em{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1565C0] to-[#1E88E5]">
                  Líderes de Alto Impacto.
                </span>
              </h1>

              <p
                className="text-xl text-[#64748B] leading-relaxed mb-10 font-light max-w-[520px] animate-fade-up"
                style={{ animationDelay: '200ms' }}
              >
                Empresas perdem milhões promovendo seus melhores técnicos sem prepará-los para a gestão. Entregamos o método prático para que sua liderança pare de apagar incêndios e passe a escalar resultados.
              </p>

              {/* CTAs */}
              <div
                className="flex flex-col sm:flex-row gap-4 mb-10 animate-fade-up"
                style={{ animationDelay: '300ms' }}
              >
                <Link
                  href="/cursos"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#111827] text-white font-semibold rounded-xl hover:bg-[#1565C0] hover:shadow-xl hover:shadow-[#1565C0]/20 transition-all duration-300 hover:-translate-y-0.5 text-base"
                >
                  Conhecer as Formações
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://wa.me/5500000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white border-2 border-[#E5E7EB] text-[#111827] font-semibold rounded-xl hover:border-[#1565C0] hover:text-[#1565C0] transition-all duration-300 text-base"
                >
                  <PlayCircle className="h-4 w-4 text-[#64748B]" />
                  Falar com Consultor
                </a>
              </div>

              {/* Mini social proof — linha separadora limpa */}
              <div
                className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#E5E7EB] pt-7 animate-fade-up"
                style={{ animationDelay: '400ms' }}
              >
                {[
                  { num: '5.000+', label: 'líderes formados' },
                  { num: '200+', label: 'empresas clientes' },
                  { num: '12 anos', label: 'de método prático' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {i > 0 && <span className="w-px h-4 bg-[#E5E7EB] hidden sm:block" />}
                    <span className="font-extrabold text-[#111827]">{item.num}</span>
                    <span className="text-[#94A3B8]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Coluna direita: dashboard da plataforma ── */}
            <div className="hidden lg:block animate-fade-up" style={{ animationDelay: '350ms' }}>
              <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl shadow-[#1565C0]/[0.06] overflow-hidden p-2">
                <div className="rounded-xl overflow-hidden border border-[#E5E7EB]">
                  {/* Barra do browser */}
                  <div className="h-10 border-b border-[#E5E7EB] bg-[#F8FAFC] flex items-center px-4 gap-3">
                    <div className="flex gap-1.5 shrink-0">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                      <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
                    </div>
                    <div className="flex-1 bg-white rounded border border-[#E5E7EB] flex items-center px-3 py-1 text-[10px] text-[#94A3B8] font-mono truncate">
                      painel.lideratreinamentos.com.br
                    </div>
                  </div>

                  {/* UI do dashboard */}
                  <div className="flex h-[360px] overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-36 bg-[#0B0F19] flex flex-col py-4 px-3 shrink-0 gap-1">
                      <p className="font-bold text-white text-sm mb-4 px-2">
                        Lidera<span className="text-[#1E88E5]">.</span>RH
                      </p>
                      {[
                        { label: 'Dashboard', active: true },
                        { label: 'Gestores' },
                        { label: 'Relatórios' },
                        { label: 'Avaliações 360°' },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className={`px-3 py-2 rounded-lg text-[11px] font-medium cursor-default ${item.active ? 'bg-[#1565C0] text-white' : 'text-[#475569]'}`}
                        >
                          {item.label}
                        </div>
                      ))}
                    </div>

                    {/* Conteúdo principal */}
                    <div className="flex-1 bg-white p-4 overflow-hidden">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-bold text-[#111827] text-xs">Painel de Liderança — T1 2025</p>
                        <span className="text-[9px] bg-[#4CAF35]/10 text-[#4CAF35] font-bold px-2 py-0.5 rounded-full">● Ao vivo</span>
                      </div>

                      {/* Stat cards */}
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {[
                          { label: 'Gestores Ativos', value: '48', delta: '↑ 12%', cor: '#4CAF35' },
                          { label: 'Evolução Média', value: '87%', delta: '↑ 5 pts', cor: '#1565C0' },
                          { label: 'Aval. Pend.', value: '3', delta: 'esta semana', cor: '#F59E0B' },
                          { label: 'Concluídos', value: '12', delta: 'trimestre', cor: '#8B5CF6' },
                        ].map((s) => (
                          <div key={s.label} className="bg-[#F8FAFC] rounded-lg p-2 border border-[#E5E7EB]">
                            <p className="text-[#94A3B8] text-[8px] mb-0.5 font-medium leading-tight">{s.label}</p>
                            <p className="font-extrabold text-[#111827] text-lg leading-none">{s.value}</p>
                            <p className="text-[8px] mt-0.5 font-semibold" style={{ color: s.cor }}>{s.delta}</p>
                          </div>
                        ))}
                      </div>

                      {/* Charts */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E5E7EB]">
                          <p className="font-bold text-[#111827] mb-2 text-[10px]">Evolução por Competência</p>
                          <div className="space-y-2">
                            {[
                              { label: 'Feedback e Cobrança', pct: 92, cor: '#1565C0' },
                              { label: 'Gestão de Prioridades', pct: 85, cor: '#1565C0' },
                              { label: 'Retenção de Talentos', pct: 78, cor: '#1565C0' },
                              { label: 'Comunicação Exec.', pct: 88, cor: '#1565C0' },
                            ].map((bar) => (
                              <div key={bar.label}>
                                <div className="flex justify-between text-[8px] text-[#94A3B8] mb-0.5">
                                  <span>{bar.label}</span>
                                  <span className="font-bold text-[#111827]">{bar.pct}%</span>
                                </div>
                                <div className="h-1 bg-[#E5E7EB] rounded-full overflow-hidden">
                                  <div className="h-full rounded-full bg-[#1565C0]" style={{ width: `${bar.pct}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E5E7EB]">
                          <p className="font-bold text-[#111827] mb-2 text-[10px]">Próximas Atividades</p>
                          <div className="space-y-2.5">
                            {[
                              { iniciais: 'JS', nome: 'João Silva', acao: 'Módulo 6 concluído', quando: 'hoje', cor: '#4CAF35' },
                              { iniciais: 'MC', nome: 'Maria Costa', acao: 'Avaliação 360° pend.', quando: 'amanhã', cor: '#1565C0' },
                              { iniciais: 'PR', nome: 'Pedro Ramos', acao: 'Check-in Performance', quando: '15/03', cor: '#F59E0B' },
                            ].map((item) => (
                              <div key={item.nome} className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-[8px] shrink-0" style={{ backgroundColor: item.cor }}>
                                  {item.iniciais}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-[#111827] text-[9px]">{item.nome}</p>
                                  <p className="text-[#94A3B8] text-[8px] truncate">{item.acao}</p>
                                </div>
                                <span className="text-[8px] text-[#94A3B8] shrink-0">{item.quando}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          MÉTRICAS — respiro limpo
      ══════════════════════════════ */}
      <section className="py-16 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="section-label mb-10 justify-center">Métricas que comprovam nossa eficácia</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[#E5E7EB]">
            {[
              { num: '5.000+', label: 'Líderes formados', context: 'em programas presenciais e online desde 2012' },
              { num: '200+', label: 'Empresas clientes', context: 'de 12 segmentos diferentes já aplicaram o método' },
              { num: '98%', label: 'Índice de Retenção', context: 'dos gestores formados permanecem na empresa por mais de 1 ano' },
              { num: '12', label: 'Anos de Método', context: 'refinado em campo real, não em sala de aula acadêmica' },
            ].map((metric, i) => (
              <div key={i} className={`flex flex-col items-center text-center ${i > 0 ? 'pl-8' : ''}`}>
                <span className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] mb-1 tracking-tight">{metric.num}</span>
                <span className="text-sm font-bold text-[#111827] mb-1">{metric.label}</span>
                <span className="text-xs text-[#94A3B8] leading-tight">{metric.context}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          A DOR — dark background
          O problema vive na escuridão.
          A solução ilumina na próxima seção.
      ══════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#0B0F19]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">

            <div className="lg:sticky lg:top-24">
              <p className="section-label mb-6" style={{ color: '#EF4444' }}>
                <span style={{ background: '#EF4444', width: '2rem', height: '2px', display: 'inline-block', marginRight: '0.6rem', borderRadius: '1px', verticalAlign: 'middle' }} />
                O diagnóstico
              </p>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white leading-tight mb-6">
                A média gestão brasileira assumiu um cargo para o qual{' '}
                <span className="text-[#EF4444]">nunca</span>{' '}
                foi treinada.
              </h2>
              <p className="text-xl text-[#94A3B8] leading-relaxed mb-8">
                As empresas perdem milhões anualmente promovendo técnicos excelentes para serem gestores medianos. Sem método de liderança, a engrenagem da empresa para.
              </p>
              <ul className="space-y-4">
                {[
                  'Turnover altíssimo na base de operação',
                  'Gestor que só sabe apagar incêndios diários',
                  'Estratégia que nunca é executada na ponta',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-base font-medium text-white/90">
                    <div className="w-5 h-5 rounded-full bg-[#EF4444]/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              {dores.map((dor, i) => (
                <div
                  key={i}
                  className="bg-[#1E293B] p-8 rounded-2xl border border-[#334155] hover:border-[#EF4444]/30 transition-colors"
                >
                  <div className="w-8 h-0.5 bg-[#EF4444]/60 mb-4 rounded-full" />
                  <h3 className="text-xl font-heading font-bold text-white mb-3">{dor.titulo}</h3>
                  <p className="text-[#94A3B8] leading-relaxed">{dor.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          ANCHOR CTA — banda de transição azul
          De escuro (problema) para claro (solução)
      ══════════════════════════════ */}
      <section className="bg-[#1565C0] py-10">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xl font-bold text-white">Já se reconheceu nesse cenário?</p>
            <p className="text-[#93C5FD] mt-1 text-sm">Veja como outras empresas resolveram esses problemas.</p>
          </div>
          <a
            href="#diagnostico"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#1565C0] font-bold rounded-xl hover:bg-white/90 transition-all whitespace-nowrap text-sm"
          >
            Ver como resolvemos
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ══════════════════════════════
          CURSOS — O ANTÍDOTO
      ══════════════════════════════ */}
      {cursos && cursos.length > 0 && (
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <p className="section-label mb-5 justify-center">O antídoto</p>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] mb-6 tracking-tight">
                Nossos Programas de Formação
              </h2>
              <p className="text-xl text-[#64748B] leading-relaxed">
                Desenhamos trilhas específicas para capacitar seu líder com ferramentas que ele usa já na segunda-feira.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {cursos.map((curso) => (
                <Link
                  key={curso.id}
                  href={`/curso/${curso.id}`}
                  className="group flex flex-col bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:border-[#1565C0] hover:shadow-xl hover:shadow-[#1565C0]/10 transition-all duration-300"
                >
                  <div className="h-52 bg-[#F8FAFC] relative overflow-hidden border-b border-[#E5E7EB]">
                    {curso.thumbnail_url ? (
                      <img src={curso.thumbnail_url} alt={curso.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-heading font-extrabold text-[100px] text-[#E5E7EB] leading-none opacity-40 select-none">{curso.title.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-xl font-heading font-bold text-[#111827] mb-4 group-hover:text-[#1565C0] transition-colors leading-tight tracking-tight">
                      {curso.title}
                    </h3>
                    <p className="text-[#64748B] mb-8 line-clamp-3 leading-relaxed flex-grow text-sm">
                      {curso.description}
                    </p>
                    <div className="pt-5 border-t border-[#E5E7EB] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] block mb-1">Acesso Imediato</span>
                        <span className="text-xl font-extrabold text-[#111827]">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(curso.price)}
                        </span>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-[#F8FAFC] flex items-center justify-center group-hover:bg-[#1565C0] group-hover:text-white transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════
          TRILHA DE PROGRAMAS
          Progressão visual explícita: 3 níveis conectados
      ══════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="section-label mb-5 justify-center">Trilha completa de desenvolvimento</p>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] mb-6 tracking-tight">
              De Coordenação à Diretoria.
              <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1565C0] to-[#1E88E5]"> Um método, três níveis.</span>
            </h2>
            <p className="text-xl text-[#64748B] leading-relaxed">
              Não vendemos o mesmo treinamento para todos — cada cargo tem o que realmente precisa.
            </p>
          </div>

          {/* Indicador de progressão horizontal */}
          <div className="hidden md:flex items-center justify-center gap-0 mb-10 max-w-[640px] mx-auto">
            {trilha.map((item, i) => (
              <div key={i} className="flex items-center gap-0 flex-1">
                <div className={`flex-1 flex flex-col items-center gap-1.5 ${item.destaque ? 'text-[#1565C0]' : 'text-[#94A3B8]'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold border-2 ${item.destaque ? 'bg-[#1565C0] border-[#1565C0] text-white' : 'border-[#E5E7EB] bg-white text-[#94A3B8]'}`}>
                    {item.nivel}
                  </div>
                  <span className="text-xs font-semibold text-center leading-tight">{item.titulo}</span>
                </div>
                {i < trilha.length - 1 && (
                  <div className="flex items-center shrink-0 mb-5 px-1">
                    <div className="w-12 h-px bg-[#E5E7EB]" />
                    <ArrowRight className="w-3 h-3 text-[#CBD5E1] -ml-1" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {trilha.map((item, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-8 border flex flex-col transition-all duration-300 ${
                  item.destaque
                    ? 'bg-[#1565C0] border-[#1565C0] text-white shadow-2xl shadow-[#1565C0]/25 md:scale-105'
                    : 'bg-white border-[#E5E7EB] hover:border-[#1565C0]/40 hover:shadow-lg'
                }`}
              >
                {item.destaque && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#4CAF35] text-white text-xs font-bold px-3 py-1 rounded-full">Mais Popular</span>
                  </div>
                )}

                <div className={`text-5xl font-extrabold mb-4 font-heading leading-none ${item.destaque ? 'text-white/15' : 'text-[#F0F4FF]'}`}>
                  {item.nivel}
                </div>
                <h3 className={`text-xl font-heading font-bold mb-1 tracking-tight ${item.destaque ? 'text-white' : 'text-[#111827]'}`}>
                  {item.titulo}
                </h3>
                <p className={`text-sm font-medium mb-6 ${item.destaque ? 'text-white/60' : 'text-[#64748B]'}`}>
                  {item.publico}
                </p>

                <ul className="space-y-3 mb-8 flex-grow">
                  {item.competencias.map((c, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${item.destaque ? 'text-white/60' : 'text-[#4CAF35]'}`} />
                      <span className={item.destaque ? 'text-white/90' : 'text-[#374151]'}>{c}</span>
                    </li>
                  ))}
                </ul>

                <div className={`pt-5 border-t mb-6 grid grid-cols-2 gap-3 ${item.destaque ? 'border-white/20' : 'border-[#E5E7EB]'}`}>
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${item.destaque ? 'text-white/40' : 'text-[#94A3B8]'}`}>Duração</p>
                    <p className={`font-bold text-sm ${item.destaque ? 'text-white' : 'text-[#111827]'}`}>{item.duracao}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${item.destaque ? 'text-white/40' : 'text-[#94A3B8]'}`}>Formato</p>
                    <p className={`font-bold text-sm ${item.destaque ? 'text-white' : 'text-[#111827]'}`}>{item.formato}</p>
                  </div>
                </div>

                <a
                  href="https://wa.me/5500000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                    item.destaque
                      ? 'bg-white text-[#1565C0] hover:bg-white/90'
                      : 'bg-[#F8FAFC] text-[#111827] border border-[#E5E7EB] hover:bg-[#1565C0] hover:text-white hover:border-[#1565C0]'
                  }`}
                >
                  Quero esse programa
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          DIFERENCIAIS B2B — dark
      ══════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#0B0F19] text-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-label mb-6" style={{ color: '#1E88E5' }}>
                <span style={{ background: '#1E88E5', width: '2rem', height: '2px', display: 'inline-block', marginRight: '0.6rem', borderRadius: '1px', verticalAlign: 'middle' }} />
                Por que a Lidera
              </p>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-8 leading-tight tracking-tight">
                Metodologia teórica{' '}
                <span className="text-[#1E88E5]">não suporta</span>{' '}
                a pressão diária do Corporate.
              </h2>
              <p className="text-xl text-[#94A3B8] leading-relaxed mb-10">
                Nosso formato é baseado em vivência executiva real. Ensinamos seu gestor a delegar, cobrar, avaliar e reter talento na prática. Sem firulas, direto ao ponto.
              </p>

              <div className="space-y-7">
                {diferenciais.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#1E88E5]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="h-5 w-5 text-[#1E88E5]" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold mb-1">{item.titulo}</h4>
                      <p className="text-[#94A3B8] leading-relaxed text-sm">{item.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-10 md:p-12 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#1565C0]/10 rounded-full blur-[60px] pointer-events-none" />
              <h3 className="text-2xl font-heading font-bold mb-4 relative z-10 tracking-tight">Para a sua Empresa (B2B)</h3>
              <p className="text-[#94A3B8] mb-8 relative z-10 leading-relaxed">
                Eleve a maturidade de gestão da sua diretoria à coordenação. Construímos academias de liderança in-company ou entregamos nossa plataforma corporativa whitelabel para o seu RH gerir.
              </p>

              <ul className="space-y-4 mb-10 relative z-10">
                {['Dashboard de Acompanhamento (RH)', 'Certificação Personalizada Lidera', 'Onboarding Dedicado'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 text-[#4CAF35] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/empresas"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#1565C0] hover:bg-[#1043A0] text-white font-bold rounded-xl transition-colors relative z-10"
              >
                Falar com Executivo B2B
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          DEPOIMENTOS — branco, contraste após dark
      ══════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="section-label mb-5 justify-center">Resultados reais</p>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] mb-6 tracking-tight">
              Quem já aplicou o método.
            </h2>
            <p className="text-xl text-[#64748B] leading-relaxed">
              Números reais de empresas reais. Sem achismo, sem teoria.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {depoimentos.map((dep, i) => (
              <div key={i} className="card-premium p-8 flex flex-col">
                <div className="text-6xl font-heading font-extrabold text-[#E5E7EB] leading-none mb-5 select-none">&ldquo;</div>

                <p className="text-[#374151] leading-relaxed mb-6 flex-grow">
                  {dep.texto}
                </p>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold mb-6 w-fit bg-[#1565C0]/8 text-[#1565C0]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1565C0]" />
                  {dep.resultado}
                </div>

                <div className="flex items-center gap-3 pt-5 border-t border-[#E5E7EB]">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 bg-[#1565C0]">
                    {dep.iniciais}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#111827] text-sm">{dep.nome}</p>
                    <p className="text-xs text-[#64748B]">{dep.cargo} · {dep.empresa}</p>
                  </div>
                  <span className="text-xs font-semibold text-[#94A3B8] bg-[#F8FAFC] px-2 py-1 rounded-full border border-[#E5E7EB] shrink-0">{dep.segmento}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-[#94A3B8] mt-10">
            * Perfis representativos de clientes reais. Cases completos disponíveis na consulta com nosso time comercial.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════
          FAQ — cinza, respiro técnico
      ══════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#F8FAFC]">
        <div className="max-w-[780px] mx-auto px-6">
          <div className="text-center mb-14">
            <p className="section-label mb-5 justify-center">Perguntas frequentes</p>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] tracking-tight">
              O que seu RH e board vão perguntar.
            </h2>
          </div>

          <div className="space-y-3">
            {faq.map((item, i) => (
              <details key={i} className="group bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
                <summary className="flex items-center justify-between gap-4 px-7 py-5 cursor-pointer font-bold text-[#111827] [&::-webkit-details-marker]:hidden hover:text-[#1565C0] transition-colors text-base">
                  {item.pergunta}
                  <span className="text-xl text-[#94A3B8] group-open:text-[#1565C0] shrink-0 leading-none group-open:rotate-45 inline-block transition-transform duration-200">+</span>
                </summary>
                <div className="px-7 pb-6">
                  <p className="text-[#64748B] leading-relaxed text-sm">{item.resposta}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          CTA FINAL B2B — dark, clímax
      ══════════════════════════════ */}
      <section id="diagnostico" className="py-24 md:py-32 bg-[#0B0F19] text-white">
        <div className="max-w-[860px] mx-auto px-6">
          <div className="text-center mb-12">
            <p className="section-label mb-5 justify-center" style={{ color: '#1E88E5' }}>
              <span style={{ background: '#1E88E5', width: '2rem', height: '2px', display: 'inline-block', marginRight: '0.6rem', borderRadius: '1px', verticalAlign: 'middle' }} />
              Para empresas
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-white leading-tight mb-6 tracking-tight">
              Solicite um Diagnóstico Gratuito de Liderança.
            </h2>
            <p className="text-xl text-[#94A3B8] leading-relaxed max-w-xl mx-auto">
              Em 30 minutos, nosso consultor mapeia os gaps de gestão da sua empresa e apresenta um plano personalizado. Sem custo, sem compromisso.
            </p>
          </div>

          <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-8 md:p-12">
            <LeadFormB2B />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10 text-sm text-[#475569]">
            <Link href="/cursos" className="hover:text-white transition-colors">
              → Ver catálogo completo de formações
            </Link>
            <Link href="/auth/register" className="hover:text-white transition-colors">
              → Criar conta individual gratuita
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
