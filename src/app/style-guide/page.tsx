import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Layers3,
  Loader2,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const courseRows = [
  { name: 'Liderança de Alta Performance', type: 'Trilha certificada', status: 'Publicado', students: 328, updatedAt: '04/03/2026' },
  { name: 'Comunicação para Gestores', type: 'Programa on-demand', status: 'Publicado', students: 195, updatedAt: '03/03/2026' },
  { name: 'Feedback e Conversas Difíceis', type: 'Masterclass', status: 'Rascunho', students: 0, updatedAt: '02/03/2026' },
  { name: 'Gestão de Conflitos em Operação', type: 'Workshop', status: 'Publicado', students: 141, updatedAt: '01/03/2026' },
  { name: 'Autogestão para Supervisores', type: 'Trilha certificada', status: 'Arquivado', students: 92, updatedAt: '27/02/2026' },
]

const sections = [
  { id: 'tokens', label: 'Tokens' },
  { id: 'typography', label: 'Tipografia' },
  { id: 'actions', label: 'Ações e Inputs' },
  { id: 'surfaces', label: 'Cards e Tabela' },
  { id: 'states', label: 'Estados QA' },
]

function TokenSwatch({
  name,
  className,
  token,
}: {
  name: string
  className: string
  token: string
}) {
  return (
    <div className="rounded-xl border bg-card p-3">
      <div className={`mb-3 h-10 rounded-lg border ${className}`} />
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{name}</p>
      <p className="mt-1 text-xs text-muted-foreground">{token}</p>
    </div>
  )
}

function SectionBlock({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="space-y-4 rounded-2xl border bg-card p-5 shadow-sm md:p-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}

export default function StyleGuidePage() {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto w-full max-w-[1320px] space-y-6 p-4 lg:p-8">
        <header className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Lidera Design Ops</p>
              <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-foreground">Style Guide Operacional</h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Referência única para interface de produção da plataforma. Inclui tokens, componentes base e estados de engenharia (ideal, loading, empty, error e partial/max).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center gap-2 rounded-xl border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Voltar ao produto
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <nav className="mt-5 flex flex-wrap gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="inline-flex items-center rounded-full border bg-background px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {section.label}
              </a>
            ))}
          </nav>
        </header>

        <SectionBlock
          id="tokens"
          title="Tokens"
          description="Paleta semântica usada no produto. Não usar hex hardcoded em novos componentes."
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <TokenSwatch name="Primary" className="bg-primary" token="--primary" />
            <TokenSwatch name="Background" className="bg-background" token="--background" />
            <TokenSwatch name="Card" className="bg-card" token="--card" />
            <TokenSwatch name="Muted" className="bg-muted" token="--muted" />
            <TokenSwatch name="Destructive" className="bg-destructive" token="--destructive" />
          </div>
        </SectionBlock>

        <SectionBlock
          id="typography"
          title="Tipografia"
          description="Hierarquia funcional para páginas de trabalho (com densidade de informação adequada)."
        >
          <div className="space-y-3 rounded-xl border bg-background p-4">
            <h1 className="font-heading text-4xl font-extrabold">H1 - Painel de evolução corporativa</h1>
            <h2 className="font-heading text-3xl font-extrabold">H2 - Trilha em andamento</h2>
            <h3 className="font-heading text-2xl font-bold">H3 - Módulo e ações</h3>
            <p className="text-base text-foreground">
              Body - Texto para explicar contexto de negócio, impacto da ação e próximos passos dentro da plataforma.
            </p>
            <p className="text-sm text-muted-foreground">Caption - Metadados de atualização, status e observações operacionais.</p>
            <code className="inline-flex w-fit rounded-md border bg-muted px-2 py-1 text-xs">Mono - CERT-LIDERA-2026-AB12</code>
          </div>
        </SectionBlock>

        <SectionBlock
          id="actions"
          title="Ações e Inputs"
          description="Botões e campos com variantes padrão, estados de foco e erro."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>Estados principais de ação no fluxo.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="flex flex-wrap gap-2">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button disabled>Disabled</Button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="xs">XS</Button>
                  <Button size="sm">SM</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">LG</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inputs</CardTitle>
                <CardDescription>Campo padrão, preenchido e erro com acessibilidade.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="company-name">Empresa</Label>
                  <Input id="company-name" placeholder="Ex: Grupo Industrial Alfa" />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="managers-count">Quantidade de gestores</Label>
                  <Input id="managers-count" value="51 a 200 gestores" readOnly />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="email-error">E-mail corporativo</Label>
                  <Input id="email-error" aria-invalid value="contato@empresa" readOnly />
                  <p className="text-xs text-destructive">Formato inválido. Use um domínio válido.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </SectionBlock>

        <SectionBlock
          id="surfaces"
          title="Cards e Tabela"
          description="Composição de interface para páginas administrativas e de acompanhamento."
        >
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: 'Leads B2B no mês', value: '31', hint: '7 novos na última semana', icon: Target },
              { label: 'Matrículas ativas', value: '523', hint: 'Academy + trilhas', icon: Layers3 },
              { label: 'SLA comercial', value: '4h úteis', hint: 'tempo médio de resposta', icon: Clock3 },
            ].map(({ label, value, hint, icon: Icon }) => (
              <Card key={label}>
                <CardHeader className="gap-1">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <CardDescription>{label}</CardDescription>
                  <CardTitle className="text-3xl font-extrabold">{value}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">{hint}</CardContent>
              </Card>
            ))}
          </div>

          <div className="overflow-hidden rounded-xl border bg-background">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b bg-muted/60 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Programa</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Alunos</th>
                    <th className="px-4 py-3">Atualizado</th>
                  </tr>
                </thead>
                <tbody>
                  {courseRows.map((row) => (
                    <tr key={row.name} className="border-b last:border-b-0">
                      <td className="px-4 py-3 font-semibold text-foreground">{row.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.type}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                            row.status === 'Publicado'
                              ? 'bg-primary/10 text-primary'
                              : row.status === 'Rascunho'
                                ? 'bg-muted text-muted-foreground'
                                : 'bg-destructive/10 text-destructive'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">{row.students}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.updatedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SectionBlock>

        <SectionBlock
          id="states"
          title="Estados QA"
          description="Padrão obrigatório para componentes críticos: ideal, loading, empty, error e partial/max."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Ideal State
                </CardTitle>
                <CardDescription>Dados completos, CTA disponível e contexto claro.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Aluno com trilha ativa, progresso atualizado e recomendação de próxima aula.</p>
                <Button size="sm">Continuar trilha</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Loading State
                </CardTitle>
                <CardDescription>Skeleton contextual, sem bloqueio visual total.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-8 animate-pulse rounded-md bg-muted" />
                <div className="h-8 animate-pulse rounded-md bg-muted" />
                <div className="h-8 animate-pulse rounded-md bg-muted" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Empty State
                </CardTitle>
                <CardDescription>Sem dados, com CTA acionável de criação/início.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">Nenhuma trilha iniciada neste perfil.</p>
                <Button variant="outline" size="sm">
                  Ver catálogo de programas
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Error State
                </CardTitle>
                <CardDescription>Falha de rede, permissão ou validação com recuperação rápida.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  Não foi possível carregar dados do dashboard.
                </div>
                <Button variant="destructive" size="sm">
                  Tentar novamente
                </Button>
              </CardContent>
            </Card>
          </div>

          <Accordion type="single" collapsible className="rounded-xl border bg-background px-4">
            <AccordionItem value="max-state">
              <AccordionTrigger className="font-semibold">Partial/Max State (1 item vs 10.000 itens)</AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  `1 item`: centralizar contexto e ação principal para evitar layout vazio.
                </p>
                <p>
                  `10.000 itens`: paginação server-side, busca por coluna e virtualização para reduzir custo de render.
                </p>
                <div className="inline-flex items-center gap-2 rounded-lg border bg-muted px-3 py-2 text-xs font-semibold text-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Checklist: Paginação + Filtro + Ordenação + Retry
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </SectionBlock>
      </div>
    </div>
  )
}
