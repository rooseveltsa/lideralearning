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

const metrics = [
  { num: '5.000+', label: 'Líderes formados', context: 'em programas presenciais e online desde 2012' },
  { num: '200+', label: 'Empresas clientes', context: 'de 12 segmentos diferentes já aplicaram o método' },
  { num: '98%', label: 'Índice de Retenção', context: 'dos gestores formados permanecem na empresa por mais de 1 ano' },
  { num: '12', label: 'Anos de Método', context: 'refinado em campo real, não em sala de aula acadêmica' },
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
    cor: '#4CAF35',
  },
  {
    iniciais: 'RA',
    nome: 'Ricardo Albuquerque',
    cargo: 'COO',
    empresa: 'Rede Varejista Nacional',
    segmento: 'Varejo',
    texto: 'O dashboard corporativo virou ferramenta de board. Consigo mostrar para o Conselho a evolução de cada gestor em tempo real. T&D deixou de ser custo e virou estratégia.',
    resultado: 'T&D como KPI de board',
    cor: '#8B5CF6',
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
    <div className="bg-[#FFFFFF] text-[#111827] selection:bg-[#1565C0]/20">
      <SiteHeader />

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden bg-white">
        <div className="hidden md:block absolute top-0 right-0 w-[800px] h-[800px] bg-[#1565C0]/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="hidden md:block absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#4CAF35]/[0.02] rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1565C0]/5 text-[#1565C0] text-sm font-semibold mb-8 animate-fade-up border border-[#1565C0]/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1565C0] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1565C0]"></span>
            </span>
            Nova Formação Executiva
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5rem] tracking-tight font-heading font-extrabold text-[#111827] leading-[1.05] mb-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
            Transformamos chefes operacionais em <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1565C0] to-[#4CAF35]">
              Líderes de Alto Impacto.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-[#64748B] max-w-[800px] mx-auto leading-relaxed mb-12 animate-fade-up font-light" style={{ animationDelay: '200ms' }}>
            Empresas perdem milhões promovendo seus melhores técnicos sem prepará-los para a gestão. Entregamos o método prático para que sua liderança pare de apagar incêndios e passe a escalar a margem de lucro da sua operação.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center animate-fade-up" style={{ animationDelay: '300ms' }}>
            <Link
              href="/cursos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#111827] text-white font-semibold rounded-xl hover:bg-[#1565C0] hover:shadow-xl hover:shadow-[#1565C0]/20 transition-all duration-300 transform hover:-translate-y-0.5 text-lg"
            >
              Conhecer as Formações
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-[#E5E7EB] text-[#111827] font-semibold rounded-xl hover:border-[#111827] transition-all duration-300 text-lg"
            >
              <PlayCircle className="h-5 w-5 text-[#64748B]" />
              Falar com Consultor
            </a>
          </div>
        </div>

        {/* Dashboard Preview — UI realista da plataforma corporativa */}
        <div className="max-w-[1000px] mx-auto mt-24 relative animate-fade-up" style={{ animationDelay: '500ms' }}>
          <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-b from-transparent to-white z-10 pointer-events-none" />
          <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl overflow-hidden p-2">
            <div className="rounded-xl overflow-hidden border border-[#E5E7EB]">
              {/* Barra do browser */}
              <div className="h-10 border-b border-[#E5E7EB] bg-[#F8FAFC] flex items-center px-4 gap-3">
                <div className="flex gap-1.5 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded border border-[#E5E7EB] flex items-center px-3 py-1 text-[11px] text-[#64748B] font-mono truncate">
                  painel.lideratreinamentos.com.br
                </div>
              </div>

              {/* UI do dashboard */}
              <div className="flex h-[380px] overflow-hidden">
                {/* Sidebar */}
                <div className="w-40 bg-[#0B0F19] text-white flex flex-col py-5 px-3 shrink-0 gap-1">
                  <p className="font-bold text-white text-sm mb-5 px-2">
                    Lidera<span className="text-[#1E88E5]">.</span>RH
                  </p>
                  {[
                    { label: 'Dashboard', active: true },
                    { label: 'Gestores', active: false },
                    { label: 'Relatórios', active: false },
                    { label: 'Avaliações 360°', active: false },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`px-3 py-2 rounded-lg text-xs font-medium cursor-default ${
                        item.active ? 'bg-[#1E88E5] text-white' : 'text-[#475569]'
                      }`}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>

                {/* Conteúdo principal */}
                <div className="flex-1 bg-white p-5 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-bold text-[#111827] text-sm">Painel de Liderança — T1 2025</p>
                    <span className="text-[10px] bg-[#4CAF35]/10 text-[#4CAF35] font-bold px-2 py-1 rounded-full">● Ao vivo</span>
                  </div>

                  {/* Cards de métricas */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[
                      { label: 'Gestores Ativos', value: '48', delta: '↑ 12% trim.', cor: '#4CAF35' },
                      { label: 'Evolução Média', value: '87%', delta: '↑ 5 pontos', cor: '#1565C0' },
                      { label: 'Aval. Pendentes', value: '3', delta: 'esta semana', cor: '#F59E0B' },
                      { label: 'Concluídos', value: '12', delta: 'este trimestre', cor: '#8B5CF6' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E5E7EB]">
                        <p className="text-[#94A3B8] text-[9px] mb-1 font-medium">{stat.label}</p>
                        <p className="font-extrabold text-[#111827] text-xl leading-none">{stat.value}</p>
                        <p className="text-[9px] mt-1 font-semibold" style={{ color: stat.cor }}>{stat.delta}</p>
                      </div>
                    ))}
                  </div>

                  {/* Gráficos */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E5E7EB]">
                      <p className="font-bold text-[#111827] mb-3 text-[11px]">Evolução por Competência</p>
                      <div className="space-y-2.5">
                        {[
                          { label: 'Feedback e Cobrança', pct: 92, cor: '#1565C0' },
                          { label: 'Gestão de Prioridades', pct: 85, cor: '#4CAF35' },
                          { label: 'Retenção de Talentos', pct: 78, cor: '#8B5CF6' },
                          { label: 'Comunicação Executiva', pct: 88, cor: '#F59E0B' },
                        ].map((bar) => (
                          <div key={bar.label}>
                            <div className="flex justify-between text-[9px] text-[#64748B] mb-1">
                              <span>{bar.label}</span>
                              <span className="font-bold text-[#111827]">{bar.pct}%</span>
                            </div>
                            <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${bar.pct}%`, backgroundColor: bar.cor }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E5E7EB]">
                      <p className="font-bold text-[#111827] mb-3 text-[11px]">Próximas Atividades</p>
                      <div className="space-y-3">
                        {[
                          { iniciais: 'JS', nome: 'João Silva', acao: 'Módulo 6 concluído', quando: 'hoje', cor: '#4CAF35' },
                          { iniciais: 'MC', nome: 'Maria Costa', acao: 'Avaliação 360° pendente', quando: 'amanhã', cor: '#1565C0' },
                          { iniciais: 'PR', nome: 'Pedro Ramos', acao: 'Check-in de Performance', quando: '15/03', cor: '#F59E0B' },
                        ].map((item) => (
                          <div key={item.nome} className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[9px] shrink-0"
                              style={{ backgroundColor: item.cor }}
                            >
                              {item.iniciais}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[#111827] text-[10px]">{item.nome}</p>
                              <p className="text-[#94A3B8] text-[9px]">{item.acao}</p>
                            </div>
                            <span className="text-[9px] text-[#94A3B8] shrink-0">{item.quando}</span>
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
      </section>

      {/* ══════════════════════════════
          MÉTRICAS COM CONTEXTO
      ══════════════════════════════ */}
      <section className="py-16 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-center text-sm font-bold tracking-widest text-[#64748B] uppercase mb-10">Métricas que comprovam nossa eficácia</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[#E5E7EB]">
            {metrics.map((metric, i) => (
              <div key={i} className={`flex flex-col items-center justify-center text-center ${i === 0 ? '' : 'pl-8'}`}>
                <span className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] mb-1">{metric.num}</span>
                <span className="text-sm font-bold text-[#111827] mb-1">{metric.label}</span>
                <span className="text-xs text-[#94A3B8] leading-tight">{metric.context}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          A DOR
      ══════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] leading-tight mb-6">
                A média gestão brasileira assumiu um cargo para o qual <span className="text-[#EF4444]">nunca</span> foi treinada.
              </h2>
              <p className="text-xl text-[#64748B] leading-relaxed mb-8">
                As empresas perdem milhões anualmente promovendo técnicos excelentes para serem gestores medianos. Sem método de liderança, a engrenagem da empresa para.
              </p>
              <ul className="space-y-4">
                {[
                  'Turnover altíssimo na base de operação',
                  'Gestor que só sabe apagar incêndios diários',
                  'Estratégia que nunca é executada na ponta',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg font-medium text-[#111827]">
                    <div className="w-6 h-6 rounded-full bg-[#EF4444]/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              {dores.map((dor, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-heading font-bold text-[#111827] mb-3">{dor.titulo}</h3>
                  <p className="text-[#64748B] leading-relaxed">{dor.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          ANCHOR CTA (mid-page)
      ══════════════════════════════ */}
      <section className="bg-white py-10 border-b border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xl font-bold text-[#111827]">Já se reconheceu nesse cenário?</p>
            <p className="text-[#64748B] mt-1">Veja como outras empresas resolveram esses problemas.</p>
          </div>
          <a
            href="#diagnostico"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1565C0] text-white font-bold rounded-xl hover:bg-[#1043A0] transition-all whitespace-nowrap shadow-lg shadow-[#1565C0]/20"
          >
            Ver como resolvemos
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* ══════════════════════════════
          CURSOS (O ANTÍDOTO)
      ══════════════════════════════ */}
      {cursos && cursos.length > 0 && (
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] mb-6">
                O Antídoto: Nossos Programas de Formação
              </h2>
              <p className="text-xl text-[#64748B] leading-relaxed">
                Desenhamos trilhas específicas para capacitar seu líder com ferramentas que ele usa já na segunda-feira.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {cursos.map((curso) => (
                <Link key={curso.id} href={`/curso/${curso.id}`} className="group flex flex-col bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:border-[#1565C0] hover:shadow-xl hover:shadow-[#1565C0]/10 transition-all duration-300">
                  <div className="h-56 bg-[#F8FAFC] relative overflow-hidden border-b border-[#E5E7EB]">
                    {curso.thumbnail_url ? (
                      <img
                        src={curso.thumbnail_url}
                        alt={curso.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-heading font-bold text-[100px] text-[#E5E7EB] leading-none opacity-50 select-none">
                          {curso.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-heading font-bold text-[#111827] mb-4 group-hover:text-[#1565C0] transition-colors leading-tight">
                      {curso.title}
                    </h3>
                    <p className="text-[#64748B] mb-8 line-clamp-3 leading-relaxed flex-grow">
                      {curso.description}
                    </p>

                    <div className="pt-6 border-t border-[#E5E7EB] mt-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">Acesso Imediato</span>
                          <span className="text-xl font-extrabold text-[#111827]">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(curso.price)}
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#F8FAFC] flex items-center justify-center group-hover:bg-[#1565C0] group-hover:text-white text-[#111827] transition-all">
                          <ArrowRight className="w-5 h-5" />
                        </div>
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
      ══════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-bold tracking-widest text-[#1565C0] uppercase mb-4">Trilha Completa de Desenvolvimento</p>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] mb-6">
              De Coordenação à Diretoria. Um método, três níveis.
            </h2>
            <p className="text-xl text-[#64748B] leading-relaxed">
              Cada nível da sua liderança tem um programa específico. Não vendemos o mesmo treinamento para todos — entregamos o que cada cargo realmente precisa.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {trilha.map((item, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-8 border flex flex-col transition-all duration-300 ${
                  item.destaque
                    ? 'bg-[#1565C0] border-[#1565C0] text-white shadow-2xl shadow-[#1565C0]/20 md:scale-105'
                    : 'bg-white border-[#E5E7EB] hover:border-[#1565C0] hover:shadow-lg'
                }`}
              >
                {item.destaque && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#4CAF35] text-white text-xs font-bold px-3 py-1 rounded-full">Mais Popular</span>
                  </div>
                )}

                <div className={`text-5xl font-extrabold mb-4 font-heading ${item.destaque ? 'text-white/20' : 'text-[#E5E7EB]'}`}>
                  {item.nivel}
                </div>
                <h3 className={`text-2xl font-heading font-bold mb-1 ${item.destaque ? 'text-white' : 'text-[#111827]'}`}>
                  {item.titulo}
                </h3>
                <p className={`text-sm font-semibold mb-6 ${item.destaque ? 'text-white/70' : 'text-[#64748B]'}`}>
                  {item.publico}
                </p>

                <ul className="space-y-3 mb-8 flex-grow">
                  {item.competencias.map((c, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${item.destaque ? 'text-white/70' : 'text-[#4CAF35]'}`} />
                      <span className={item.destaque ? 'text-white/90' : 'text-[#374151]'}>{c}</span>
                    </li>
                  ))}
                </ul>

                <div className={`pt-6 border-t mb-6 grid grid-cols-2 gap-4 text-sm ${item.destaque ? 'border-white/20' : 'border-[#E5E7EB]'}`}>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${item.destaque ? 'text-white/50' : 'text-[#94A3B8]'}`}>Duração</p>
                    <p className={`font-semibold ${item.destaque ? 'text-white' : 'text-[#111827]'}`}>{item.duracao}</p>
                  </div>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${item.destaque ? 'text-white/50' : 'text-[#94A3B8]'}`}>Formato</p>
                    <p className={`font-semibold ${item.destaque ? 'text-white' : 'text-[#111827]'}`}>{item.formato}</p>
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
          DIFERENCIAIS (B2B FOCUS)
      ══════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#0B0F19] text-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-8 leading-tight">
                Escute: Metodologia teórica <span className="text-[#1E88E5]">não suporta</span> a pressão diária do Corporate.
              </h2>
              <p className="text-xl text-[#94A3B8] leading-relaxed mb-10">
                Nosso formato é baseado em vivência executiva real. Ensinamos seu gestor a delegar, cobrar, avaliar e reter talento na prática. Sem firulas, direto ao ponto.
              </p>

              <div className="space-y-6">
                {diferenciais.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1E88E5]/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-[#1E88E5]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1">{item.titulo}</h4>
                      <p className="text-[#94A3B8] leading-relaxed">{item.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-10 md:p-12 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#1E88E5]/10 rounded-full blur-[60px]" />

              <h3 className="text-3xl font-heading font-bold mb-4 relative z-10">Para a sua Empresa (B2B)</h3>
              <p className="text-[#94A3B8] mb-8 relative z-10 leading-relaxed text-lg">
                Eleve a maturidade de gestão da sua diretoria à coordenação. Construímos academias de liderança in-company ou entregamos nossa plataforma corporativa whitelabel para o seu RH gerir.
              </p>

              <ul className="space-y-4 mb-10 relative z-10">
                {[
                  'Dashboard de Acompanhamento (RH)',
                  'Certificação Personalizada Lidera',
                  'Onboarding Dedicado',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-[#4CAF35]" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/empresas"
                className="w-full inline-flex items-center justify-center px-6 py-4 bg-[#1E88E5] hover:bg-[#1565C0] text-white font-bold rounded-xl transition-colors text-lg relative z-10"
              >
                Falar com Executivo B2B
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          DEPOIMENTOS / CASES
      ══════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-bold tracking-widest text-[#1565C0] uppercase mb-4">Resultados Reais</p>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] mb-6">
              Quem já aplicou o método.
            </h2>
            <p className="text-xl text-[#64748B] leading-relaxed">
              Números reais de empresas reais. Sem achismo, sem teoria.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {depoimentos.map((dep, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                <div className="text-5xl font-heading font-extrabold text-[#E5E7EB] leading-none mb-4 select-none">&ldquo;</div>

                <p className="text-[#374151] leading-relaxed mb-6 flex-grow text-lg">
                  {dep.texto}
                </p>

                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold mb-6 w-fit"
                  style={{ backgroundColor: `${dep.cor}18`, color: dep.cor }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dep.cor }} />
                  {dep.resultado}
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-[#E5E7EB]">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ backgroundColor: dep.cor }}
                  >
                    {dep.iniciais}
                  </div>
                  <div>
                    <p className="font-bold text-[#111827] text-sm">{dep.nome}</p>
                    <p className="text-xs text-[#64748B]">{dep.cargo} · {dep.empresa}</p>
                  </div>
                  <span className="ml-auto text-xs font-semibold text-[#94A3B8] bg-[#F8FAFC] px-2 py-1 rounded-full shrink-0">{dep.segmento}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-[#94A3B8] mt-12">
            * Perfis representativos de clientes reais. Cases completos disponíveis na consulta com nosso time comercial.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════
          FAQ
      ══════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-bold tracking-widest text-[#1565C0] uppercase mb-4">Perguntas Frequentes</p>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827]">
              O que seu RH e board vão perguntar.
            </h2>
          </div>

          <div className="space-y-4">
            {faq.map((item, i) => (
              <details key={i} className="group bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-8 py-6 cursor-pointer font-bold text-[#111827] text-lg [&::-webkit-details-marker]:hidden hover:text-[#1565C0] transition-colors">
                  {item.pergunta}
                  <span className="text-2xl text-[#64748B] group-open:text-[#1565C0] shrink-0 leading-none transition-transform duration-200 group-open:rotate-45 inline-block">+</span>
                </summary>
                <div className="px-8 pb-6">
                  <p className="text-[#64748B] leading-relaxed">{item.resposta}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          CTA FINAL B2B — FORMULÁRIO INLINE
      ══════════════════════════════ */}
      <section id="diagnostico" className="py-24 md:py-32 bg-[#0B0F19] text-white">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-bold tracking-widest text-[#1E88E5] uppercase mb-4">Para Empresas</p>
            <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-white leading-tight mb-6">
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
