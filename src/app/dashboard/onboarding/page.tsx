'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, BookOpen, CheckCircle2, Flame, Target, Trophy, Users } from 'lucide-react'

const steps = [
  {
    icon: Target,
    title: 'Bem-vindo à LIDERA',
    subtitle: 'Sua jornada de liderança começa agora',
    description:
      'A LIDERA é uma plataforma de desenvolvimento de líderes e supervisores. Aqui você encontra treinamentos, ferramentas práticas e acompanhamento para evoluir na sua carreira.',
    color: '#1E88E5',
  },
  {
    icon: BookOpen,
    title: 'Como funciona',
    subtitle: 'Aprenda no seu ritmo',
    description:
      'Acesse cursos em vídeo, faça autoavaliações diagnósticas e receba seu Plano de Desenvolvimento Individual (PDI) personalizado. Tudo acessível de qualquer dispositivo.',
    color: '#4CAF50',
  },
  {
    icon: Trophy,
    title: 'Conquistas & XP',
    subtitle: 'Quanto mais você aprende, mais evolui',
    description:
      'Cada aula completa rende XP. Mantenha seu streak diário ativo, suba de nível e desbloqueie conquistas. Acompanhe seu progresso no ranking de líderes.',
    color: '#F57C00',
  },
  {
    icon: Users,
    title: 'Comunidade',
    subtitle: 'Você não está sozinho',
    description:
      'Conecte-se com outros líderes e supervisores. Indique colegas pelo programa de referral e ganhe benefícios. Sua empresa também acompanha o progresso da equipe.',
    color: '#1E88E5',
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()
  const step = steps[currentStep]
  const isLast = currentStep === steps.length - 1

  function handleNext() {
    if (isLast) {
      router.push('/dashboard')
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  function handleSkip() {
    router.push('/dashboard')
  }

  const Icon = step.icon

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050A14] px-6">
      <div className="w-full max-w-[520px]">
        {/* Progress dots */}
        <div className="mb-10 flex items-center justify-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentStep ? 'w-8 bg-[#1E88E5]' : i < currentStep ? 'w-2 bg-[#4CAF50]' : 'w-2 bg-[#1A2E4A]'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-[#22314B] bg-[#0A1324] p-10 text-center">
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${step.color}15` }}
          >
            <Icon className="h-10 w-10" style={{ color: step.color }} />
          </div>

          <h1 className="font-heading text-2xl font-extrabold text-white">{step.title}</h1>
          <p className="mt-2 text-sm font-bold" style={{ color: step.color }}>
            {step.subtitle}
          </p>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-[#A9BDD8]">
            {step.description}
          </p>

          {/* Gamification preview on step 3 */}
          {currentStep === 2 && (
            <div className="mt-6 flex items-center justify-center gap-6 text-[#A9BDD8]">
              <div className="text-center">
                <Flame className="mx-auto h-6 w-6 text-[#F57C00]" />
                <p className="mt-1 text-xs font-bold">Streaks</p>
              </div>
              <div className="text-center">
                <Trophy className="mx-auto h-6 w-6 text-[#4CAF50]" />
                <p className="mt-1 text-xs font-bold">Conquistas</p>
              </div>
              <div className="text-center">
                <Target className="mx-auto h-6 w-6 text-[#1E88E5]" />
                <p className="mt-1 text-xs font-bold">Ranking</p>
              </div>
            </div>
          )}

          {/* Final step: checklist */}
          {isLast && (
            <div className="mt-6 space-y-2 text-left">
              {['Explore seus cursos disponíveis', 'Faça a autoavaliação de liderança', 'Complete sua primeira aula (+50 XP)'].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2 rounded-lg bg-[#0D1B30] px-4 py-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#4CAF50]" />
                    <span className="text-sm text-[#D4E4F6]">{item}</span>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-sm font-semibold text-[#64748B] transition-colors hover:text-white"
          >
            Pular
          </button>

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1E88E5] px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-[#1E88E5]/25 transition-all hover:bg-[#1565C0]"
          >
            {isLast ? 'Ir para o Dashboard' : 'Próximo'}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
