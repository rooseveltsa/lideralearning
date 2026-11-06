import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import SiteFooter from "@/components/site/Footer";
import SiteHeader from "@/components/site/Header";
import { DiagnosticoCTA } from "@/components/diagnostico/DiagnosticoCTA";
import { CONTACT } from "@/lib/config/contact";

export const metadata: Metadata = {
  title: "Supervisor: Da Operação à Liderança | Lidera",
  description:
    "Com Claudemir Domingos: diagnóstico, PDI e turma presencial para supervisores. A mentoria segue com ele. As aulas gravadas entram depois.",
  openGraph: {
    title: "Supervisor: Da Operação à Liderança",
    description:
      "O produto do Claudemir Domingos. Diagnóstico gratuito, PDI e turma presencial para quem lidera a operação.",
    url: CONTACT.site,
  },
};

const path = [
  {
    number: "01",
    title: "Diagnóstico",
    text: "Você ou a empresa responde. O resultado mostra o gap, sem aula genérica no meio.",
  },
  {
    number: "02",
    title: "PDI",
    text: "O plano de 90 dias sai das suas respostas. Ele vira a pauta da turma.",
  },
  {
    number: "03",
    title: "Conversa com o Claudemir",
    text: "30 minutos para ler o PDI junto. É a porta da mentoria.",
  },
  {
    number: "04",
    title: "Turma presencial",
    text: "8 módulos, 16 horas, 2 dias. As gravações entram na plataforma depois.",
  },
];

const modules = [
  "A função estratégica do supervisor",
  "Inteligência comportamental e comunicação",
  "Alicerce ético e responsabilidade",
  "Gestão da diversidade geracional",
  "Engenharia de equipes e sucessão",
  "Supervisor 4.0: tecnologia e IA",
  "Padrões de sucesso",
  "Carreira, PDI e mentoria",
];

const offers = [
  {
    kicker: "Para você",
    title: "Entre pelo diagnóstico.",
    text: "O caminho B2C que já funciona: suas respostas, seu PDI e a conversa com o Claudemir antes da turma.",
    items: ["Diagnóstico individual", "PDI com a sua pauta", "Conversa de 30 minutos"],
    href: "/diagnostico/pessoal",
    label: "Fazer meu diagnóstico",
  },
  {
    kicker: "Mentoria",
    title: "Siga com o Claudemir.",
    text: "A mentoria online começa nessa leitura do PDI. Quem precisa de mais tempo marca direto com ele.",
    items: ["Leitura do seu plano", "Combinação do próximo passo", "Acompanhamento depois da turma"],
    href: `${CONTACT.whatsapp.url}?text=${encodeURIComponent("Olá Claudemir, quero conversar sobre mentoria a partir do meu PDI.")}`,
    label: "Falar com o Claudemir",
    external: true,
  },
  {
    kicker: "Para a empresa",
    title: "Feche a turma do time.",
    text: "O mesmo programa, com o PDI de cada supervisor. A proposta sai depois do diagnóstico, não de um catálogo genérico.",
    items: ["Diagnóstico dos supervisores", "Turma fechada na operação", "Proposta em cima do gap"],
    href: "/diagnostico/empresa",
    label: "Diagnosticar a liderança",
  },
];

export default function HomePage() {
  return (
    <div className="institutional-site">
      <SiteHeader />
      <main id="main-content">
        <section className="bg-[#122039] text-[#f5f1ea]" aria-labelledby="home-title">
          <div className="institutional-container grid items-end gap-14 py-16 md:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            <div>
              <p className="institutional-eyebrow" style={{ color: "#ff9a5a" }}>
                Claudemir Domingos · Metodologia LIDERA
              </p>
              <h1 id="home-title" className="institutional-headline mt-6" style={{ color: "#f5f1ea" }}>
                Supervisor:
                <br />
                da operação
                <br />
                <span className="text-[#ff9a5a]">à liderança.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#bdc6d3] md:text-lg">
                Para quem foi promovido pela técnica e agora responde por gente.
                O Claudemir começa pelo diagnóstico, entrega o PDI e leva isso
                para a turma presencial.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <DiagnosticoCTA className="institutional-button">
                  Fazer diagnóstico gratuito
                  <ArrowRight className="size-4" aria-hidden="true" />
                </DiagnosticoCTA>
                <Link href="/treinamento/modulos" className="institutional-button-on-dark">
                  Ver os 8 módulos
                </Link>
              </div>
              <p className="mt-5 text-sm text-[#bdc6d3]">
                Link para a bio do LinkedIn:{" "}
                <a href={CONTACT.site} className="font-semibold text-[#f5f1ea] underline underline-offset-4">
                  {CONTACT.site.replace("https://", "")}
                </a>
              </p>
            </div>

            <ol className="divide-y divide-[#344258] border-y border-[#344258]" aria-label="Como o produto funciona">
              {path.map((step) => (
                <li key={step.number} className="grid grid-cols-[auto_1fr] gap-5 py-5">
                  <span className="pt-1 font-mono text-xs text-[#ff9a5a]">{step.number}</span>
                  <div>
                    <h2 className="text-base font-semibold">{step.title}</h2>
                    <p className="mt-1 text-sm leading-relaxed text-[#bdc6d3]">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-site-border bg-site-white" aria-label="O que a turma entrega">
          <dl className="institutional-container grid gap-px bg-site-border sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["8 módulos", "O programa Supervisor, do chão de fábrica à carreira."],
              ["16 horas", "Dois dias de imersão presencial, com ferramenta para levar."],
              ["1 PDI", "Cada pessoa sai com o próprio plano, não com um slide igual."],
              ["Mentoria", "A conversa com o Claudemir continua depois da turma."],
            ].map(([title, text]) => (
              <div key={title} className="bg-site-white px-0 py-8 sm:px-6 sm:first:pl-0 sm:last:pr-0">
                <dt className="text-lg font-semibold text-site-ink">{title}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-site-muted">{text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="institutional-container py-16 md:py-24" aria-labelledby="offers-heading">
          <p className="institutional-eyebrow">Três portas, um método</p>
          <h2 id="offers-heading" className="institutional-section-heading mt-4 max-w-2xl">
            A pessoa entra sozinha. A empresa fecha a turma. A mentoria fica com o Claudemir.
          </h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {offers.map((offer) => {
              const className = "mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-site-secondary";
              return (
                <article key={offer.kicker} className="institutional-training-card flex flex-col">
                  <span className="text-xs font-medium uppercase tracking-widest text-site-secondary">
                    {offer.kicker}
                  </span>
                  <h3 className="mt-5 text-2xl font-semibold text-site-ink">{offer.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-site-muted">{offer.text}</p>
                  <ul className="mt-6 space-y-3 text-sm text-site-ink">
                    {offer.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <Check className="mt-0.5 size-4 shrink-0 text-site-secondary" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {offer.external ? (
                    <a href={offer.href} target="_blank" rel="noopener noreferrer" className={className}>
                      {offer.label}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </a>
                  ) : (
                    <Link href={offer.href} className={className}>
                      {offer.label}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="institutional-practice" aria-labelledby="program-heading">
          <div className="institutional-container grid gap-12 py-16 md:grid-cols-[0.8fr_1.2fr] md:py-20">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#ff9a5a]">
                O programa, com nome
              </p>
              <h2 id="program-heading" className="institutional-section-heading mt-4 text-site-on-dark">
                Oito módulos do supervisor. Nada de trilha genérica.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-site-on-dark-muted">
                Claudemir Domingos criou a metodologia LIDERA para ligar a
                autoavaliação, o plano individual e o acompanhamento depois do
                encontro.
              </p>
              <Link
                href="/treinamento/modulos"
                className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#ff9a5a]"
              >
                Abrir a ementa
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <ol className="grid gap-3 sm:grid-cols-2">
              {modules.map((title, index) => (
                <li key={title} className="flex gap-3 border-t border-site-dark-border pt-3">
                  <span className="font-mono text-xs text-[#ff9a5a]">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-sm font-medium text-site-on-dark">{title}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="institutional-container grid items-center gap-8 py-16 md:grid-cols-[1.2fr_auto] md:py-24" aria-labelledby="linkedin-heading">
          <div>
            <p className="institutional-eyebrow">Para quem chega do LinkedIn</p>
            <h2 id="linkedin-heading" className="institutional-section-heading mt-4">
              Este endereço é o produto.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-site-muted">
              O post apresenta o Claudemir. Quem clica cai aqui, vê o método e
              começa pelo diagnóstico. A frase para a publicação: diagnóstico
              gratuito, PDI e turma presencial com Claudemir Domingos.
            </p>
          </div>
          <DiagnosticoCTA className="institutional-button">
            Começar pelo diagnóstico
            <ArrowRight className="size-4" aria-hidden="true" />
          </DiagnosticoCTA>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
