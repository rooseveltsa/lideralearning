import Link from 'next/link'
import { Instagram, Linkedin, Youtube } from 'lucide-react'

const footerColumns = [
  { title: 'Formação', links: [{ href: '/treinamento/autoavaliacao', label: 'Diagnóstico gratuito' }, { href: '/treinamento/modulo-1', label: 'Próxima turma' }, { href: '/cursos', label: 'Academy digital' }, { href: '/certificado', label: 'Certificados' }] },
  { title: 'Empresas', links: [{ href: '/empresas', label: 'Programa corporativo' }, { href: '/treinamento/autoavaliacao', label: 'Diagnóstico organizacional' }, { href: '/empresas#casos', label: 'Casos de sucesso' }, { href: '/contato', label: 'Falar com comercial' }] },
  { title: 'Lidera', links: [{ href: '/sobre', label: 'Quem somos' }, { href: '/sobre#claudemir', label: 'Claudemir Domingos' }, { href: '/blog', label: 'Conteúdo' }, { href: '/contato', label: 'Contato' }] },
]

const socialLinks = [
  { href: 'https://instagram.com/lideratreinamentos', icon: Instagram, label: 'Instagram' },
  { href: 'https://linkedin.com/company/lideratreinamentos', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://youtube.com/@lideratreinamentos', icon: Youtube, label: 'YouTube' },
]

export default function SiteFooter() {
  return (
    <footer className="ld-deep" style={{ borderTop: '1px solid rgba(245,241,234,0.10)', background: '#03070f' }}>
      <div className="ld-mw-xl" style={{ paddingTop: 64, paddingBottom: 40 }}>
        {/* Main grid */}
        <div className="mb-14 grid gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <svg width={26} height={26} viewBox="0 0 64 64" fill="none" aria-hidden>
                <path d="M10 50 L22 18 L26 30 L18 50 Z" fill="#ec6411" />
                <path d="M22 50 L34 14 L38 26 L30 50 Z" fill="#0f8f3a" />
                <path d="M34 50 L46 18 L54 30 L42 50 Z" fill="#1855bd" />
              </svg>
              <span className="font-sans text-lg font-bold tracking-tight" style={{ color: '#f5f1ea' }}>
                Lidera
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed" style={{ color: 'rgba(245,241,234,0.55)' }}>
              Formação de líderes com diagnóstico, imersão presencial e acompanhamento. Da operação à liderança.
            </p>
            <div className="mt-5 flex gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
                  style={{ border: '1px solid rgba(245,241,234,0.10)', color: 'rgba(245,241,234,0.55)' }}
                >
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <div className="mb-4 text-[13px] font-semibold" style={{ color: '#f5f1ea' }}>
                {col.title}
              </div>
              {col.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-1.5 text-sm transition-colors hover:text-[#f5f1ea]"
                  style={{ color: 'rgba(245,241,234,0.55)' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col gap-4 pt-8 text-xs md:flex-row md:items-center md:justify-between"
          style={{ borderTop: '1px solid rgba(245,241,234,0.10)', color: 'rgba(245,241,234,0.4)' }}
        >
          <span>&copy; 2026 Lidera Treinamentos &middot; Todos os direitos reservados</span>
          <div className="flex gap-6">
            <Link href="/privacidade" className="hover:text-[#f5f1ea]" style={{ color: 'inherit' }}>Privacidade</Link>
            <Link href="/termos" className="hover:text-[#f5f1ea]" style={{ color: 'inherit' }}>Termos</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
