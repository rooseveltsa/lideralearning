import Link from 'next/link'
import { Instagram, Linkedin, Youtube } from 'lucide-react'

const footerLinks = {
    'Ecossistema': [
        { href: '/cursos', label: 'Formações de Liderança' },
        { href: '/empresas', label: 'Lidera Corporativo (B2B)' },
        { href: '/contato', label: 'Consultoria e Diagnóstico' },
    ],
    'Plataforma': [
        { href: '/auth/login', label: 'Login do Aluno' },
        { href: '/auth/register', label: 'Criar Conta' },
        { href: '/sobre', label: 'Nosso Manifesto' },
    ],
    'Governança': [
        { href: '/privacidade', label: 'Política de Privacidade' },
        { href: '/termos', label: 'Termos e Condições' },
    ],
}

const socials = [
    { href: 'https://instagram.com/lideratreinamentos', icon: Instagram, label: 'Instagram' },
    { href: 'https://linkedin.com/company/lideratreinamentos', icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://youtube.com/@lideratreinamentos', icon: Youtube, label: 'YouTube' },
]

export default function SiteFooter() {
    return (
        <footer className="bg-[#0B0F19] border-t border-[#1E293B] pt-24 pb-12">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-12 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-1.5 mb-8 group select-none inline-flex">
                            <span className="font-heading font-extrabold text-3xl tracking-tight text-white">
                                Lidera
                            </span>
                            <span className="font-extrabold text-3xl text-[#1E88E5]">.</span>
                        </Link>
                        <p className="text-[#94A3B8] leading-relaxed max-w-sm font-light text-lg">
                            A ponte definitiva entre os conceitos acadêmicos rasos e a realidade selvagem
                            da linha de frente da gestão brasileira.
                        </p>
                        <div className="flex items-center gap-4 mt-10">
                            {socials.map(({ href, icon: Icon, label }) => (
                                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                                    className="p-3 rounded-xl bg-[#1E293B] text-[#94A3B8] hover:text-white hover:bg-[#1E88E5] transition-all duration-300">
                                    <Icon className="h-5 w-5" />
                                    <span className="sr-only">{label}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    {Object.entries(footerLinks).map(([group, links]) => (
                        <div key={group}>
                            <p className="text-sm font-bold text-white uppercase tracking-wider mb-8">{group}</p>
                            <ul className="space-y-5">
                                {links.map(({ href, label }) => (
                                    <li key={label}>
                                        <Link href={href} className="text-[#64748B] hover:text-[#1E88E5] font-medium transition-colors">
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[#1E293B] flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-sm text-[#64748B]">
                        © {new Date().getFullYear()} Lidera Treinamentos B2B. CNPJ: 00.000.000/0001-00. Contrato SaaS Premium.
                    </p>
                    <div className="flex items-center gap-6">
                        <p className="text-sm font-bold text-[#94A3B8]">
                            suporte@lideratreinamentos.com.br
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
