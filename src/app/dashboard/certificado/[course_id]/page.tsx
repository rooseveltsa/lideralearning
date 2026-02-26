import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { Award, CheckCircle, QrCode, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PrintButton } from './PrintButton'

export default async function CertificadoPage({ params }: { params: Promise<{ course_id: string }> }) {
    const { course_id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    // Buscar perfil do aluno
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

    // Buscar dados do curso
    const { data: course } = await supabase
        .from('courses')
        .select(`id, title, description, modules(id, lessons(id))`)
        .eq('id', course_id)
        .single()

    if (!course) notFound()

    // Buscar matrícula
    const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id, enrolled_at')
        .eq('user_id', user.id)
        .eq('course_id', course_id)
        .single()

    if (!enrollment) redirect(`/dashboard`)

    // Calcular progresso
    const allLessons = course.modules.flatMap((m: any) => m.lessons)
    const totalLessons = allLessons.length

    const { data: progressData } = await supabase
        .from('progress')
        .select('lesson_id, is_completed')
        .eq('enrollment_id', enrollment.id)
        .eq('is_completed', true)

    const completedCount = progressData?.length ?? 0
    const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
    const isCertified = progressPercent === 100

    const completionDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    const certId = `LIDERA-${enrollment.id.slice(0, 8).toUpperCase()}`
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/certificado/verificar/${certId}`

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-4 lg:p-8">
            <div>
                <Link href={`/dashboard/cursos/${course_id}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#64748B] hover:text-[#1E88E5] transition-colors w-fit bg-white px-4 py-2 rounded-lg border border-[#E5E7EB] shadow-sm">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para o Curso
                </Link>
            </div>

            {!isCertified ? (
                /* Bloqueado */
                <div className="bg-white border border-[#E5E7EB] rounded-3xl p-12 text-center shadow-sm">
                    <div className="w-24 h-24 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Award className="h-12 w-12 text-[#94A3B8]" />
                    </div>
                    <h2 className="text-3xl font-heading font-extrabold text-[#111827] mb-3">Certificado Indisponível</h2>
                    <p className="text-[#64748B] font-medium text-lg mb-8 max-w-lg mx-auto">
                        Você completou <strong className="text-[#1E88E5]">{completedCount} de {totalLessons}</strong> aulas.
                        Conclua toda a trilha de aprendizado para desbloquear seu certificado oficial.
                    </p>
                    <div className="w-full max-w-md mx-auto bg-[#EEF2F6] rounded-full h-4 mb-3 border border-[#E5E7EB]">
                        <div className="bg-[#4CAF35] h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <p className="text-sm font-bold text-[#94A3B8] uppercase tracking-wider mb-8">{progressPercent}% do trajeto concluído</p>
                    <Link href={`/dashboard/cursos/${course_id}`}
                        className="inline-flex py-4 px-8 bg-[#1E88E5] text-white rounded-xl font-bold shadow-lg shadow-[#1E88E5]/20 hover:bg-[#1565C0] transition-colors">
                        Continuar Aprendizado
                    </Link>
                </div>
            ) : (
                <>
                    {/* Certificado visual */}
                    <div id="certificado"
                        className="relative bg-[#0B0F19] border border-[#1E293B] rounded-3xl p-10 md:p-16 overflow-hidden shadow-2xl">
                        {/* Ornamentos de fundo */}
                        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#1E88E5]/5 rounded-full blur-[100px]" />
                        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[100px]" />
                        <div className="absolute top-4 right-4 bottom-4 left-4 border border-white/10 rounded-2xl pointer-events-none" />
                        <div className="absolute top-5 right-5 bottom-5 left-5 border border-white/5 rounded-xl pointer-events-none" />

                        <div className="relative z-10 text-center space-y-6">
                            {/* Logo / Badge */}
                            <div className="flex justify-center mb-8">
                                <div className="p-5 bg-gradient-to-br from-[#1E88E5]/20 to-transparent border border-[#1E88E5]/30 rounded-2xl">
                                    <Award className="h-14 w-14 text-[#1E88E5]" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-[0.3em]">
                                    Lidera Treinamentos • Certificado de Conclusão
                                </p>
                                <p className="text-lg text-[#cbd5e1] font-medium pt-4">Certificamos que</p>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-heading tracking-tight mt-2 mb-2">
                                    {profile?.full_name ?? 'Aluno'}
                                </h1>
                                <p className="text-[#94A3B8] text-lg font-medium pb-2">
                                    concluiu com êxito todos os requisitos do programa
                                </p>
                                <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#1E88E5] max-w-2xl mx-auto leading-tight">
                                    {course.title}
                                </h2>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-[#4CAF35] text-sm font-bold pt-6">
                                <CheckCircle className="h-5 w-5" />
                                {completedCount} aulas concluídas • Carga Horária Completa
                            </div>

                            <div className="border-t border-white/10 mt-12 pt-8 flex items-center justify-between text-left">
                                <div>
                                    <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Data de Emissão</p>
                                    <p className="text-base text-white font-medium mb-4">{completionDate}</p>
                                    <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Licença / Autenticação</p>
                                    <p className="text-sm text-[#94A3B8] font-mono">{certId}</p>
                                </div>

                                {/* QR Code de verificação */}
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner">
                                        {/* QR code SVG simples com link de verificação */}
                                        <QrCode className="h-full w-full text-[#0B0F19]" />
                                    </div>
                                    <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Escaneie para validar</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#E5E7EB]">
                        <PrintButton />

                        <a href={verifyUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-white text-[#64748B] border border-[#E5E7EB] rounded-xl font-bold text-sm hover:bg-[#F8FAFC] hover:text-[#111827] shadow-sm transition-all">
                            Copiar Link de Validação
                        </a>
                    </div>
                </>
            )}
        </div>
    )
}
