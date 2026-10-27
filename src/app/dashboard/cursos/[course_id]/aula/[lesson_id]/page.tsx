"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  RotateCcw,
} from "lucide-react";

import {
  checkAndIssueCertificate,
  getCourseDetails,
  markLessonAccess,
  markLessonCompleted,
} from "@/lib/actions/lms";
import type { CourseDetails } from "@/lib/actions/lms";
import { Progress } from "@/types/database";
import PremiumVideoPlayer from "@/components/premium/course/PremiumVideoPlayer";

type CourseModule = CourseDetails["course"]["modules"][number];
type CourseLesson = CourseModule["lessons"][number];

type LessonEntry = CourseLesson & {
  moduleId: string;
  moduleTitle: string;
};

function formatMinutes(seconds: number) {
  return `${Math.max(1, Math.round(seconds / 60))} min`;
}

export default function AulaPage({
  params,
}: {
  params: Promise<{ course_id: string; lesson_id: string }>;
}) {
  const { course_id, lesson_id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [notFoundState, setNotFoundState] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<CourseDetails | null>(null);
  const [certificateCode, setCertificateCode] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    setNotFoundState(false);

    try {
      const data = await getCourseDetails(course_id);
      if (!data) {
        setNotFoundState(true);
        return;
      }

      const { getInitialAssessment } = await import("@/lib/actions/assessment");
      const assessment = await getInitialAssessment(data.enrollmentId);

      if (!assessment) {
        router.replace(`/dashboard/cursos/${course_id}/avaliacao-inicial`);
        return;
      }

      setCertificateCode(null);
      setCourseData(data);
      if (
        data.course.modules.some((module) =>
          module.lessons.some((lesson) => lesson.id === lesson_id),
        )
      ) {
        void markLessonAccess(data.enrollmentId, lesson_id);
      }
    } catch (error) {
      console.error("Error loading lesson page:", error);
      setLoadError("Não foi possível carregar a aula. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [course_id, lesson_id, router]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  if (notFoundState) return notFound();

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1320px] space-y-6 p-4 lg:p-8">
        <div className="h-16 animate-pulse rounded-2xl border border-learning-border bg-learning-panel" />
        <div className="h-40 animate-pulse rounded-3xl border border-learning-border bg-learning-panel" />
        <div className="grid gap-6 grid-cols-1">
          <div className="space-y-5">
            <div className="aspect-video animate-pulse rounded-2xl border border-learning-border bg-learning-panel" />
            <div className="h-28 animate-pulse rounded-2xl border border-learning-border bg-learning-panel" />
          </div>
          <div className="h-[560px] animate-pulse rounded-2xl border border-learning-border bg-learning-panel" />
        </div>
      </div>
    );
  }

  if (!courseData && loadError) {
    return (
      <div className="mx-auto flex min-h-[55vh] w-full max-w-[860px] items-center p-4 lg:p-8">
        <div className="w-full rounded-2xl border border-red-500/30 bg-red-500/10 p-7">
          <p className="text-lg font-bold text-red-200">
            Falha ao carregar esta aula
          </p>
          <p className="mt-2 text-sm text-red-300/70">{loadError}</p>
          <button
            type="button"
            onClick={() => void loadData()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700"
          >
            <RotateCcw className="h-4 w-4" />
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!courseData) return null;

  const { course, progress, enrollmentId } = courseData;

  const sortedModules = [...course.modules]
    .sort((a, b) => a.order_index - b.order_index)
    .map((moduleItem) => ({
      ...moduleItem,
      lessons: [...moduleItem.lessons].sort(
        (a, b) => a.order_index - b.order_index,
      ),
    }));

  const lessons: LessonEntry[] = sortedModules.flatMap((moduleItem) =>
    moduleItem.lessons.map((lessonItem) => ({
      ...lessonItem,
      moduleId: moduleItem.id,
      moduleTitle: moduleItem.title,
    })),
  );

  const currentIndex = lessons.findIndex((item) => item.id === lesson_id);
  if (currentIndex < 0) return notFound();

  const currentLesson = lessons[currentIndex];
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const isCompleted = progress.some(
    (item: Progress) => item.lesson_id === lesson_id && item.is_completed,
  );
  const completedLessons = lessons.filter((item) =>
    progress.some(
      (progressItem: Progress) =>
        progressItem.lesson_id === item.id && progressItem.is_completed,
    ),
  ).length;
  const startedLessons = lessons.filter((item) =>
    progress.some(
      (progressItem: Progress) => progressItem.lesson_id === item.id,
    ),
  ).length;
  const progressPercent =
    lessons.length > 0
      ? Math.round((completedLessons / lessons.length) * 100)
      : 0;

  const handleMarkComplete = async () => {
    setMarking(true);
    setLoadError(null);

    try {
      const result = await markLessonCompleted(
        enrollmentId,
        lesson_id,
        !isCompleted,
      );
      if (!result.success) {
        setLoadError(result.error || "Falha ao atualizar o progresso da aula.");
        setMarking(false);
        return;
      }

      const updated = await getCourseDetails(course_id);
      if (!updated) {
        setNotFoundState(true);
        setMarking(false);
        return;
      }

      setCourseData(updated);
      void markLessonAccess(updated.enrollmentId, lesson_id);

      // Auto-issue certificate if all lessons are now complete
      if (!isCompleted) {
        try {
          const certResult = await checkAndIssueCertificate(
            updated.enrollmentId,
            course_id,
          );
          if (certResult.verificationCode) {
            setCertificateCode(certResult.verificationCode);
          }
        } catch {
          // Certificate check is non-blocking
        }
      }
    } catch {
      setLoadError("Não foi possível salvar sua conclusão. Tente novamente.");
    } finally {
      setMarking(false);
    }
  };

  const moduleCompletedCount = sortedModules.filter((moduleItem) => {
    const moduleCompleted = moduleItem.lessons.filter((lessonItem) =>
      progress.some(
        (progressItem: Progress) =>
          progressItem.lesson_id === lessonItem.id && progressItem.is_completed,
      ),
    ).length;
    return (
      moduleCompleted === moduleItem.lessons.length &&
      moduleItem.lessons.length > 0
    );
  }).length;

  const progressData = progress.map((p: Progress) => ({
    lesson_id: p.lesson_id,
    is_completed: p.is_completed,
  }));

  const premiumModules = sortedModules.map((m) => ({
    id: m.id,
    title: m.title,
    lessons: m.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      video_url: l.video_url,
      duration_seconds: l.duration_seconds,
    })),
  }));

  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-6 p-4 lg:p-8">
      {/* Top navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/dashboard/cursos/${course_id}`}
          className="inline-flex items-center gap-2 rounded-xl border border-learning-border bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-learning-muted transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar ao treinamento
        </Link>

        <div className="flex items-center gap-2">
          {previousLesson ? (
            <Link
              href={`/dashboard/cursos/${course.id}/aula/${previousLesson.id}`}
              className="inline-flex items-center gap-1 rounded-xl border border-learning-border bg-white/[0.03] px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-learning-muted transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Anterior
            </Link>
          ) : null}
          {nextLesson ? (
            <Link
              href={`/dashboard/cursos/${course.id}/aula/${nextLesson.id}`}
              className="inline-flex items-center gap-1 rounded-xl border border-learning-border bg-white/[0.03] px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-learning-muted transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            >
              Próxima
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </div>
      </div>

      {/* Lesson header */}
      <section className="relative overflow-hidden rounded-3xl border border-learning-border bg-learning-panel p-7 text-white">
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-learning-accent">
            Aula {currentIndex + 1} de {lessons.length} •{" "}
            {currentLesson.moduleTitle}
          </p>
          <h1 className="mt-2 max-w-4xl text-3xl font-extrabold leading-tight">
            {currentLesson.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-learning-muted">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {formatMinutes(currentLesson.duration_seconds)}
            </span>
            <span className="rounded-full border border-learning-border bg-white/5 px-2.5 py-1">
              {isCompleted ? "Concluída" : "Em andamento"}
            </span>
          </div>
        </div>
      </section>

      {loadError ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
          {loadError}
        </div>
      ) : null}

      {certificateCode ? (
        <section className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-yellow-500/10 p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-200">
                  Parabéns! Certificado emitido automaticamente!
                </p>
                <p className="text-xs text-emerald-400/70">
                  Código:{" "}
                  <span className="font-semibold">{certificateCode}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/certificado/${certificateCode}`}
                target="_blank"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-500 px-4 text-xs font-bold text-white transition-colors hover:bg-emerald-600"
              >
                <Award className="h-3.5 w-3.5" />
                Ver certificado
              </Link>
              <Link
                href={`/dashboard/certificado/${course_id}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-learning-border bg-white/5 px-4 text-xs font-bold text-learning-muted transition-colors hover:bg-white/10"
              >
                Página do certificado
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* Main content: video player (with sidebar) + supplementary */}
      <div className="grid gap-6 grid-cols-1">
        {/* Left column */}
        <section className="space-y-5">
          {/* Video Player with integrated sidebar */}
          <PremiumVideoPlayer
            videoUrl={currentLesson.video_url || ""}
            thumbnail={course.thumbnail_url}
            currentLessonId={lesson_id}
            courseId={course_id}
            modules={premiumModules}
            progress={progressData}
          />

          {/* Mark complete + next action */}
          <div className="rounded-2xl border border-learning-border bg-learning-panel p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-learning-muted">
                  Status da aula
                </p>
                <p
                  className={`mt-1 text-sm font-bold ${isCompleted ? "text-emerald-400" : "text-learning-accent"}`}
                >
                  {isCompleted
                    ? "Aula marcada como concluída"
                    : "Aula em andamento"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleMarkComplete}
                  disabled={marking}
                  className={`inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
                    isCompleted
                      ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                      : "bg-learning-action text-white hover:bg-learning-action/80"
                  }`}
                >
                  {marking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {isCompleted
                    ? "Desmarcar conclusão"
                    : "Marcar como concluída"}
                </button>

                {nextLesson ? (
                  <Link
                    href={`/dashboard/cursos/${course.id}/aula/${nextLesson.id}`}
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-learning-border bg-white/5 px-5 text-sm font-bold text-learning-muted transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Próxima aula
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </div>
          </div>

          {/* Supplementary material */}
          <article className="rounded-2xl border border-learning-border bg-learning-panel p-6">
            <h2 className="text-xl font-extrabold text-white">
              Material complementar
            </h2>
            {currentLesson.content_text ? (
              <div className="prose prose-invert mt-4 max-w-none text-sm leading-relaxed text-learning-muted">
                <p className="whitespace-pre-wrap">
                  {currentLesson.content_text}
                </p>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-learning-border bg-learning-panel px-4 py-4 text-sm text-learning-muted">
                Esta aula ainda não possui material complementar cadastrado.
              </div>
            )}
          </article>

          {/* Compact progress stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Módulos",
                value: `${moduleCompletedCount}/${sortedModules.length}`,
                color: "text-learning-accent",
              },
              {
                label: "Concluídas",
                value: `${completedLessons}/${lessons.length}`,
                color: "text-emerald-400",
              },
              {
                label: "Iniciadas",
                value: `${startedLessons}/${lessons.length}`,
                color: "text-amber-400",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-learning-border bg-learning-panel px-3 py-3 text-center"
              >
                <p className={`text-sm font-extrabold ${item.color}`}>
                  {item.value}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wide text-learning-muted">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Right column: sticky progress card only */}
        <aside className="space-y-5">
          <article className="rounded-2xl border border-learning-border bg-learning-panel p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-learning-accent">
              Painel de progresso
            </p>
            <p className="mt-2 text-2xl font-extrabold text-white">
              {progressPercent}% concluído
            </p>
            <p className="mt-1 text-xs text-learning-muted">
              {completedLessons} de {lessons.length} aulas concluídas •{" "}
              {startedLessons} iniciadas
            </p>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-learning-accent to-learning-accent transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </article>
        </aside>
      </div>
    </div>
  );
}
