import { getUserCourses } from "@/lib/actions/lms"
import { BookOpen, Target, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function CursosPage() {
    const coursesData = await getUserCourses()

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto p-4 lg:p-8">
            <div>
                <h1 className="text-3xl lg:text-4xl font-heading font-extrabold text-[#111827] tracking-tight mb-3">
                    Meus Programas
                </h1>
                <p className="text-[#64748B] text-lg font-medium">
                    Continue seu desenvolvimento de onde parou.
                </p>
            </div>

            {coursesData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 px-6 mt-4 border border-[#E5E7EB] bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow text-center">
                    <div className="w-20 h-20 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl flex items-center justify-center mb-6">
                        <BookOpen className="h-10 w-10 text-[#1E88E5]" />
                    </div>
                    <h3 className="text-2xl font-heading font-extrabold text-[#111827] mb-3">Nenhum programa ativo</h3>
                    <p className="text-[#64748B] max-w-md mb-8 font-medium">
                        Você ainda não está matriculado em nenhuma formação. Descubra como estruturar sua liderança e acelerar resultados.
                    </p>
                    <Link
                        href="/cursos"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-[#1E88E5] hover:bg-[#1565C0] text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-[#1E88E5]/20"
                    >
                        Ver Catálogo de Formações
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {coursesData.map(({ course }) => (
                        <Link
                            key={course.id}
                            href={`/dashboard/cursos/${course.id}`}
                            className="group flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-300 border border-[#E5E7EB] hover:border-[#1E88E5]/30 hover:shadow-2xl hover:shadow-[#111827]/[0.05] hover:-translate-y-1 block"
                        >
                            {/* Thumbnail */}
                            <div className="relative h-56 bg-gradient-to-br from-[#0B0F19] to-[#1E293B] overflow-hidden">
                                {course.thumbnail_url ? (
                                    <img
                                        src={course.thumbnail_url}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-40">
                                        <Target className="h-16 w-16 text-white" />
                                    </div>
                                )}
                                {/* Overlay Grade */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/80 via-[#0B0F19]/20 to-transparent" />
                                <div className="absolute bottom-4 left-4 inline-flex items-center px-3 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
                                    Acesso Liberado
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col flex-grow">
                                <h3 className="text-2xl font-heading font-extrabold text-[#111827] mb-3 leading-tight group-hover:text-[#1E88E5] transition-colors line-clamp-2">
                                    {course.title}
                                </h3>

                                <p className="text-base text-[#64748B] leading-relaxed mb-8 line-clamp-2 flex-grow font-medium">
                                    {course.description || "Nenhuma descrição disponível."}
                                </p>

                                <div className="mt-auto pt-6 border-t border-[#F8FAFC]">
                                    <div className="w-full py-3.5 bg-[#F8FAFC] border border-[#E5E7EB] text-[#111827] font-bold text-sm rounded-xl text-center group-hover:bg-[#1E88E5] group-hover:border-[#1E88E5] group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                                        Continuar Aprendizado
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

