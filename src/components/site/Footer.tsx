import Link from 'next/link'
import { ArrowUpRight, Building2, Instagram, Linkedin, Mail, Youtube } from 'lucide-react'

const footerLinks = {
  Plataforma: [
    { href: '/cursos', label: 'Lidera Academy' },
    { href: '/auth/login', label: 'Área do aluno' },
    { href: '/auth/register', label: 'Criar conta' },
  ],
  Corporativo: [
    { href: '/empresas', label: 'Solução B2B' },
    { href: '/contato', label: 'Solicitar diagnóstico' },
    { href: '/sobre', label: 'Quem somos' },
  ],
  Governança: [
    { href: '/privacidade', label: 'Política de privacidade' },
    { href: '/termos', label: 'Termos de uso' },
  ],
}

const socialLinks = [
  { href: 'https://instagram.com/lideratreinamentos', icon: Instagram, label: 'Instagram' },
  { href: 'https://linkedin.com/company/lideratreinamentos', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://youtube.com/@lideratreinamentos', icon: Youtube, label: 'YouTube' },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#1A2438] bg-[#050A14] text-[#D8E4F5]">
      <div className="mx-auto max-w-[1280px] px-6 pb-12 pt-20">
        <div className="mb-16 grid gap-6 rounded-3xl border border-[#22314C] bg-gradient-to-r from-[#0C1629] to-[#0A1322] p-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7FA0C2]">Lidera Corporate Engine</p>
            <h3 className="mt-3 max-w-xl font-heading text-3xl font-extrabold text-white">
              Treinamento corporativo com operação mensurável, da matrícula ao resultado de negócio.
            </h3>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/empresas"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E88E5] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#1E88E5]/20 transition-colors hover:bg-[#1565C0]"
            >
              Falar com comercial
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/cursos"
              className="inline-flex items-center justify-center rounded-xl border border-[#2B405F] px-5 py-3 text-sm font-bold text-[#D8E4F5] transition-colors hover:border-[#4C6C95] hover:text-white"
            >
              Explorar Academy
            </Link>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="font-heading text-3xl font-extrabold tracking-tight text-white">Lidera</span>
              <span className="h-2.5 w-2.5 rounded-full bg-[#1E88E5]" />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-[#9FB2CB]">
              Plataforma híbrida de desenvolvimento humano e corporativo para elevar líderes, acelerar execução e sustentar resultados.
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#2B405F] text-[#9FB2CB] transition-all hover:border-[#1E88E5] hover:text-white"
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span className="sr-only">{label}</span>
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-[#7FA0C2]">{title}</p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[#D8E4F5] transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[#1A2438] pt-6 text-sm text-[#7F96B3] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Lidera Treinamentos. Todos os direitos reservados.</p>
          <div className="flex flex-wrap items-center gap-5">
            <span className="inline-flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Operação Brasil
            </span>
            <a href="mailto:suporte@lideratreinamentos.com.br" className="inline-flex items-center gap-2 hover:text-white">
              <Mail className="h-4 w-4" />
              suporte@lideratreinamentos.com.br
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
