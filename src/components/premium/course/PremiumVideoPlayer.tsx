"use client";

import Link from "next/link";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import VideoPlayer from "@/components/VideoPlayer";

type Lesson = {
  id: string;
  title: string;
  video_url: string | null;
  duration_seconds: number;
};
type Module = { id: string; title: string; lessons: Lesson[] };
interface PremiumVideoPlayerProps {
  videoUrl: string;
  thumbnail?: string | null;
  currentLessonId: string;
  courseId: string;
  modules: Module[];
  progress: { lesson_id: string; is_completed: boolean }[];
}

export function PremiumVideoPlayer({
  videoUrl,
  thumbnail,
  currentLessonId,
  courseId,
  modules,
  progress,
}: PremiumVideoPlayerProps) {
  const currentModule = modules.find((m) =>
    m.lessons.some((l) => l.id === currentLessonId),
  );
  const completed = new Set(
    progress.filter((p) => p.is_completed).map((p) => p.lesson_id),
  );
  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 overflow-hidden rounded-xl border border-learning-border bg-black">
        {videoUrl ? (
          <VideoPlayer
            key={currentLessonId}
            url={videoUrl}
            thumbnail={thumbnail}
          />
        ) : (
          <div className="flex aspect-video flex-col items-center justify-center gap-3 px-6 text-center text-learning-muted">
            <PlayCircle className="size-12" />
            <p className="text-sm">Esta aula não possui vídeo disponível.</p>
            <p className="text-xs">Consulte o conteúdo complementar abaixo.</p>
          </div>
        )}
      </div>
      <aside
        aria-label="Módulos e aulas do treinamento"
        className="overflow-hidden rounded-xl border border-learning-border bg-learning-panel"
      >
        <div className="border-b border-learning-border p-4">
          <h2 className="text-sm font-semibold text-learning-text">
            Conteúdo do treinamento
          </h2>
          <p className="mt-1 text-xs text-learning-muted">
            Selecione um módulo para ver as aulas.
          </p>
        </div>
        <Accordion
          key={currentModule?.id}
          type="multiple"
          defaultValue={currentModule ? [currentModule.id] : []}
          className="max-h-[65dvh] overflow-y-auto"
        >
          {modules.map((module, moduleIndex) => (
            <AccordionItem
              key={module.id}
              value={module.id}
              className="border-learning-border"
            >
              <AccordionTrigger className="min-h-14 px-4 text-learning-text">
                <span>
                  <span className="block text-[11px] text-learning-muted">
                    Módulo {moduleIndex + 1} ·{" "}
                    {module.lessons.filter((l) => completed.has(l.id)).length}/
                    {module.lessons.length} concluídas
                  </span>
                  <span className="mt-1 block text-sm">{module.title}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-2">
                <div className="space-y-1">
                  {module.lessons.map((lesson) => {
                    const done = completed.has(lesson.id);
                    const active = lesson.id === currentLessonId;
                    const Icon = done
                      ? CheckCircle2
                      : active
                        ? PlayCircle
                        : Circle;
                    return (
                      <Link
                        key={lesson.id}
                        href={`/dashboard/cursos/${courseId}/aula/${lesson.id}`}
                        aria-current={active ? "page" : undefined}
                        className={`flex min-h-12 items-start gap-3 rounded-lg p-3 ${active ? "bg-learning-accent-soft text-learning-accent" : "text-learning-muted hover:bg-learning-bg hover:text-learning-text"}`}
                      >
                        <Icon
                          className={`mt-0.5 size-4 shrink-0 ${done ? "text-learning-success" : ""}`}
                        />
                        <span className="min-w-0">
                          <span className="block text-sm leading-snug">
                            {lesson.title}
                          </span>
                          <span className="mt-1 block text-[11px] text-learning-muted">
                            {done
                              ? "Concluída"
                              : active
                                ? "Aula atual"
                                : "Não concluída"}
                            {lesson.duration_seconds > 0
                              ? ` · ${Math.max(1, Math.round(lesson.duration_seconds / 60))} min`
                              : ""}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </aside>
    </div>
  );
}
export default PremiumVideoPlayer;
