import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  ClipboardList,
  GraduationCap,
  UsersRound,
} from "lucide-react";
import SiteFooter from "@/components/site/Footer";
import SiteHeader from "@/components/site/Header";
import { DiagnosticoCTA } from "@/components/diagnostico/DiagnosticoCTA";
import { CONTACT } from "@/lib/config/contact";

const learningSteps = [
  {
    number: "01",
    title: "Entenda seu momento",
    description:
      "Um diagnóstico para reconhecer suas competências e os pontos que precisam de atenção.",
  },
  {
    number: "02",
    title: "Desenvolva sua liderança",
    description:
      "Treinamentos sobre comunicação, delegação, feedback e gestão de equipes.",
  },
  {
    number: "03",
    title: "Leve para a rotina",
    description:
      "Retome as aulas, acompanhe seu progresso e aplique o aprendizado no trabalho.",
  },
];

export default function HomePage() {
  return (
    <div className="institutional-site">
      <SiteHeader />
      <main id="main-content">
        <section className="institutional-hero" aria-labelledby="home-title">
          <div className="institutional-container grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:py-24">
            <div>
              <p className="institutional-eyebrow">Lidera Treinamentos</p>
              <h1 id="home-title" className="institutional-headline mt-6">
                Liderar bem
                <br />
                se aprende.
                <br />
                <span className="text-site-secondary">E se pratica.</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-site-muted md:text-lg">
                Formação para quem cuida de pessoas e precisa fazer a equipe
                avançar. Treinamentos presenciais e digitais, com foco nas
                decisões do dia a dia.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <DiagnosticoCTA className="institutional-button">
                  Fazer diagnóstico gratuito
                  <ArrowRight className="size-4" aria-hidden="true" />
                </DiagnosticoCTA>
                <Link href="/cursos" className="institutional-button-secondary">
                  Conhecer os treinamentos
                </Link>
              </div>
              <p className="mt-4 text-xs text-site-muted">
                Já é aluno?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-site-ink underline underline-offset-4"
                >
                  Acesse seus treinamentos
                </Link>
              </p>
            </div>
            <aside
              className="institutional-path"
              aria-labelledby="development-path"
            >
              <div className="border-b border-site-border pb-6">
                <p className="institutional-eyebrow">
                  Desenvolvimento na prática
                </p>
                <h2
                  id="development-path"
                  className="mt-3 text-2xl font-semibold leading-snug tracking-tight text-site-ink"
                >
                  Da primeira conversa
                  <br />à rotina da sua equipe.
                </h2>
              </div>
              <ol className="divide-y divide-site-border">
                {learningSteps.map((step) => (
                  <li key={step.number} className="flex gap-5 py-6">
                    <span
                      className="pt-1 font-mono text-xs text-site-secondary"
                      aria-hidden="true"
                    >
                      {step.number}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-site-ink">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-site-muted">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link
                href="/treinamento/modulo-1"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-site-secondary"
              >
                Conheça a formação de líderes
                <ArrowRight className="size-4" />
              </Link>
            </aside>
          </div>
        </section>

        <section
          aria-label="Formatos de aprendizagem"
          className="border-y border-site-border bg-site-white"
        >
          <div className="institutional-container grid divide-y divide-site-border py-2 md:grid-cols-3 md:divide-x md:divide-y-0">
            {[
              {
                icon: UsersRound,
                title: "Presencial",
                text: "Discussão, troca e prática em grupo.",
              },
              {
                icon: BookOpen,
                title: "Digital",
                text: "Aulas para acompanhar no seu ritmo.",
              },
              {
                icon: GraduationCap,
                title: "Para empresas",
                text: "Formação alinhada ao contexto da equipe.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="flex items-start gap-4 px-0 py-6 md:px-7 md:first:pl-0 md:last:pr-0"
              >
                <Icon
                  className="mt-1 size-5 shrink-0 text-site-secondary"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-sm font-semibold text-site-ink">
                    {title}
                  </h2>
                  <p className="mt-1 text-sm text-site-muted">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="treinamentos"
          className="institutional-container py-16 md:py-24"
          aria-labelledby="training-heading"
        >
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="institutional-eyebrow">Escolha por onde começar</p>
              <h2
                id="training-heading"
                className="institutional-section-heading mt-4"
              >
                Uma formação que cabe
                <br />
                no seu momento.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-site-muted">
              Para quem está assumindo a primeira equipe ou já lidera e quer
              melhorar sua forma de gerir.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <article className="institutional-training-card">
              <span className="text-xs font-medium uppercase tracking-widest text-site-secondary">
                Para você
              </span>
              <h3 className="mt-5 text-2xl font-semibold text-site-ink">
                Sua próxima etapa como líder.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-site-muted">
                Reconheça os desafios da sua liderança e encontre um treinamento
                para desenvolver as competências que fazem falta na rotina.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-site-ink">
                {[
                  "Diagnóstico individual de liderança",
                  "Conteúdo organizado em módulos e aulas",
                  "Acompanhamento do progresso na plataforma",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-site-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/treinamento/modulo-1"
                className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-site-secondary"
              >
                Ver formação de líderes
                <ArrowRight className="size-4" />
              </Link>
            </article>
            <article className="institutional-training-card">
              <span className="text-xs font-medium uppercase tracking-widest text-site-secondary">
                Para sua empresa
              </span>
              <h3 className="mt-5 text-2xl font-semibold text-site-ink">
                Desenvolva quem conduz a equipe.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-site-muted">
                Converse com a Lidera sobre os desafios da operação e os
                comportamentos que sua empresa precisa desenvolver nas
                lideranças.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-site-ink">
                {[
                  "Diagnóstico do contexto da equipe",
                  "Treinamentos presenciais e corporativos",
                  "Definição do escopo em conversa com a empresa",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-site-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/empresas"
                className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-site-secondary"
              >
                Conhecer soluções para empresas
                <ArrowRight className="size-4" />
              </Link>
            </article>
          </div>
        </section>

        <section
          className="institutional-practice"
          aria-labelledby="practice-heading"
        >
          <div className="institutional-container grid gap-10 py-16 md:grid-cols-2 md:gap-20 md:py-20">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-site-on-dark-muted">
                O que desenvolver
              </p>
              <h2
                id="practice-heading"
                className="institutional-section-heading mt-4 text-site-on-dark"
              >
                Os desafios são reais.
                <br />O aprendizado também precisa ser.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-site-on-dark-muted">
                A liderança acontece na conversa difícil, na distribuição de
                tarefas e no acompanhamento das entregas. É nesse contexto que o
                treinamento precisa fazer sentido.
              </p>
            </div>
            <dl className="divide-y divide-site-dark-border">
              {[
                {
                  title: "Conversas mais claras",
                  text: "Comunicação, escuta e feedback para orientar sem deixar dúvidas.",
                },
                {
                  title: "Responsabilidade compartilhada",
                  text: "Delegação e acompanhamento para desenvolver autonomia na equipe.",
                },
                {
                  title: "Uma rotina de gestão",
                  text: "Prioridades, acordos e decisões para organizar o trabalho.",
                },
              ].map((item) => (
                <div key={item.title} className="py-5 first:pt-0">
                  <dt className="text-base font-semibold text-site-on-dark">
                    {item.title}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-site-on-dark-muted">
                    {item.text}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section
          className="institutional-container grid items-center gap-10 py-16 md:grid-cols-[1fr_auto] md:py-24"
          aria-labelledby="contact-heading"
        >
          <div>
            <p className="institutional-eyebrow">
              Uma conversa antes da proposta
            </p>
            <h2
              id="contact-heading"
              className="institutional-section-heading mt-4"
            >
              Conte o que sua equipe precisa.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-site-muted">
              Fale com {CONTACT.owner.name}, {CONTACT.owner.role.toLowerCase()}{" "}
              da Lidera. Entenda os formatos de treinamento e o que faz sentido
              para sua realidade.
            </p>
            <Link
              href="/sobre"
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-site-ink underline underline-offset-4"
            >
              Conheça a Lidera
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <a
            href={CONTACT.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="institutional-button"
          >
            Conversar com Claudemir
            <ArrowRight className="size-4" />
          </a>
        </section>

        <section className="border-t border-site-border bg-site-white">
          <div className="institutional-container flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <ClipboardList className="mt-1 size-6 shrink-0 text-site-secondary" />
              <div>
                <h2 className="text-lg font-semibold text-site-ink">
                  Comece entendendo sua liderança.
                </h2>
                <p className="mt-2 text-sm text-site-muted">
                  Escolha o diagnóstico individual ou a avaliação para empresas.
                </p>
              </div>
            </div>
            <DiagnosticoCTA className="institutional-button-secondary shrink-0">
              Fazer diagnóstico
              <ArrowRight className="size-4" />
            </DiagnosticoCTA>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
