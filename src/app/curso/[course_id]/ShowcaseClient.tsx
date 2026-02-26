'use client'

import { Button } from "@/components/ui/button"
import { CheckCircle2, Navigation, Clock, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import { createCheckoutSession } from "@/app/curso/[course_id]/actions"
import SiteHeader from "@/components/site/Header"
import SiteFooter from "@/components/site/Footer"

interface CourseProps {
    course: any;
    totalLessons: number;
    totalDuration: number;
}

export default function CourseShowcaseClient({ course, totalLessons, totalDuration }: CourseProps) {

    const handleCheckout = () => {
        createCheckoutSession(course.id)
    }

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }

    // Converter duração em horas
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);

    return (
        <div className="min-h-screen bg-[#F8FAFC] selection:bg-[#1565C0]/20">
            <SiteHeader />

            {/* Hero Section - Dark Corporate */}
            <section className="relative overflow-hidden bg-[#0B0F19] pt-36 pb-32 border-b border-[#1E293B]">
                {/* Abstract Glow Effects */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1E88E5]/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#4CAF35]/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

                <div className="max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 relative z-10">
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-[#E2E8F0] text-sm font-bold tracking-wider mb-8 border border-white/10 uppercase"
                        >
                            <span className="w-2 h-2 rounded-full bg-[#1E88E5]" />
                            Formação Executiva Lidera
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight leading-[1.05] text-white mb-6"
                        >
                            {course.title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="text-xl md:text-2xl text-[#94A3B8] font-light leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0"
                        >
                            {course.description || "O método definitivo para quem precisa estruturar processos, escalar resultados e parar de apagar incêndios diariamente."}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="flex flex-wrap justify-center lg:justify-start gap-4 mb-12"
                        >
                            <div className="flex items-center gap-2.5 text-sm font-bold text-white bg-white/5 px-5 py-3 rounded-xl border border-white/10 shadow-lg">
                                <Navigation className="h-5 w-5 text-[#1E88E5]" />
                                {course.modules.length} Módulos
                            </div>
                            <div className="flex items-center gap-2.5 text-sm font-bold text-white bg-white/5 px-5 py-3 rounded-xl border border-white/10 shadow-lg">
                                <CheckCircle2 className="h-5 w-5 text-[#1E88E5]" />
                                {totalLessons} Aulas Práticas
                            </div>
                            <div className="flex items-center gap-2.5 text-sm font-bold text-white bg-white/5 px-5 py-3 rounded-xl border border-white/10 shadow-lg">
                                <Clock className="h-5 w-5 text-[#1E88E5]" />
                                {hours}h {minutes > 0 ? `${minutes}m` : ''} de Conteúdo
                            </div>
                        </motion.div>
                    </div>

                    {/* Checkout Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.6 }}
                        className="w-full lg:w-[420px] bg-white rounded-3xl p-8 shadow-2xl border border-[#E5E7EB]"
                    >
                        <h3 className="text-2xl font-heading font-extrabold text-[#111827] mb-2">Acesso Imediato</h3>
                        <p className="text-[#64748B] mb-8 font-medium">Garanta sua vaga e comece agora.</p>

                        <div className="flex items-end gap-2 mb-8">
                            <span className="text-sm font-bold text-[#64748B] mb-2">R$</span>
                            <span className="text-6xl font-heading font-extrabold text-[#111827] tracking-tight">{course.price.toString().split('.')[0]}</span>
                            <span className="text-xl font-bold text-[#64748B] mb-2">
                                ,{course.price.toString().includes('.') ? course.price.toString().split('.')[1].padEnd(2, '0') : '00'}
                            </span>
                        </div>

                        <form action={handleCheckout} className="w-full">
                            <Button className="w-full h-14 bg-[#1E88E5] hover:bg-[#1565C0] text-white text-lg font-bold rounded-xl shadow-lg shadow-[#1E88E5]/20 transition-all duration-300">
                                Desbloquear Formação
                            </Button>
                        </form>

                        <div className="mt-6 flex flex-col gap-3">
                            <p className="text-[#64748B] text-sm flex items-center gap-2 font-medium">
                                <ShieldCheck className="h-4 w-4 text-[#4CAF35]" /> Pagamento 100% Seguro (Stripe)
                            </p>
                            <p className="text-[#64748B] text-sm flex items-center gap-2 font-medium">
                                <CheckCircle2 className="h-4 w-4 text-[#4CAF35]" /> 7 dias de garantia incondicional
                            </p>
                            <p className="text-[#64748B] text-sm flex items-center gap-2 font-medium">
                                <CheckCircle2 className="h-4 w-4 text-[#4CAF35]" /> Acesso durante 12 meses
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Curriculum Breakdown - Clean White */}
            <section className="bg-[#F8FAFC] py-32 relative overflow-hidden">
                <div className="max-w-[1000px] mx-auto px-6 relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] mb-6 tracking-tight">Ementa Executiva</h2>
                        <p className="text-[#64748B] text-xl max-w-2xl mx-auto font-light">
                            O programa foi desenhado sem rodeios: 100% focado em frameworks aplicáveis e resolução de gargalos reais.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid gap-6"
                    >
                        {course.modules.sort((a: any, b: any) => a.order_index - b.order_index).map((mod: any, index: number) => (
                            <motion.div
                                key={mod.id}
                                variants={fadeIn}
                                className="group border border-[#E5E7EB] hover:border-[#1E88E5]/50 rounded-3xl p-8 md:p-10 bg-white shadow-xl shadow-[#111827]/[0.02] hover:shadow-2xl hover:shadow-[#111827]/[0.05] transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1.5 h-0 bg-[#1E88E5] group-hover:h-full transition-all duration-300 ease-out" />

                                <div className="flex items-center gap-5 mb-8">
                                    <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] text-[#111827] font-heading font-extrabold text-2xl group-hover:bg-[#1E88E5]/10 group-hover:text-[#1E88E5] group-hover:border-[#1E88E5]/20 transition-colors">
                                        {index + 1}
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-extrabold font-heading text-[#111827]">{mod.title}</h3>
                                </div>

                                <ul className="grid gap-4 ml-[76px]">
                                    {mod.lessons.sort((a: any, b: any) => a.order_index - b.order_index).map((lesson: any) => (
                                        <li key={lesson.id} className="flex items-center justify-between text-[#64748B] group/lesson hover:text-[#111827] transition-colors py-2 border-b border-[#F8FAFC] last:border-0 last:pb-0">
                                            <div className="flex items-center gap-4">
                                                <div className="w-6 h-6 rounded-full bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center group-hover/lesson:border-[#1E88E5] group-hover/lesson:bg-[#1E88E5]/5 transition-all">
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-[#94A3B8] group-hover/lesson:text-[#1E88E5] transition-colors" />
                                                </div>
                                                <span className="font-semibold text-lg">{lesson.title}</span>
                                            </div>
                                            <span className="text-sm font-bold text-[#94A3B8] bg-[#F8FAFC] px-3 py-1 rounded-md">{Math.round(lesson.duration_seconds / 60)} min</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <SiteFooter />
        </div>
    )
}
