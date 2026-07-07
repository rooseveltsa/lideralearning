'use client'

import { useState } from 'react'
import { CheckCircle2, Eye, EyeOff, Loader2, TriangleAlert } from 'lucide-react'
import { detectVideo, formatDuration, parseDurationToSeconds } from './lesson-utils'

export type LessonFormValues = {
  title?: string
  video_url?: string | null
  content_text?: string | null
  duration_seconds?: number
}

type LessonEditorProps = {
  defaultValues?: LessonFormValues
  submitLabel: string
  isPending: boolean
  onSubmit: (formData: FormData) => void
  onCancel: () => void
}

const inputClass =
  'w-full px-4 h-11 bg-white border border-[#E5E7EB] rounded-lg text-[#111827] text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#ec6411]/25 focus:border-[#ec6411] font-medium transition-all'

/**
 * Formulário completo de aula (criação e edição): título, vídeo com
 * detecção de provedor + preview, duração em mm:ss e conteúdo de apoio.
 */
export default function LessonEditor({ defaultValues, submitLabel, isPending, onSubmit, onCancel }: LessonEditorProps) {
  const [videoUrl, setVideoUrl] = useState(defaultValues?.video_url ?? '')
  const [durationText, setDurationText] = useState(formatDuration(defaultValues?.duration_seconds ?? 0))
  const [showPreview, setShowPreview] = useState(false)

  const video = detectVideo(videoUrl)
  const durationSeconds = parseDurationToSeconds(durationText)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('duration_seconds', String(durationSeconds))
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-5 shadow-inner">
      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wide text-[#475569]">
          Título da aula <span className="text-red-500">*</span>
        </label>
        <input name="title" required defaultValue={defaultValues?.title ?? ''} placeholder="Ex: Como conduzir a primeira reunião 1:1" className={inputClass} />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wide text-[#475569]">Vídeo da aula</label>
        <input
          name="video_url"
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Cole o link do YouTube, Vimeo ou arquivo .mp4"
          className={inputClass}
        />

        {video && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {video.kind === 'unknown' ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
                <TriangleAlert className="h-3.5 w-3.5" />
                URL não reconhecida — o player do aluno pode não reproduzir
              </span>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {video.label} detectado
                </span>
                <button
                  type="button"
                  onClick={() => setShowPreview((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-bold text-[#475569] ring-1 ring-[#E5E7EB] transition-colors hover:text-[#ec6411] hover:ring-[#ec6411]/40"
                >
                  {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  {showPreview ? 'Ocultar preview' : 'Pré-visualizar vídeo'}
                </button>
              </>
            )}
          </div>
        )}

        {showPreview && video && video.kind !== 'unknown' && (
          <div className="mt-2 overflow-hidden rounded-lg border border-[#E5E7EB] bg-black">
            {video.kind === 'file' ? (
              <video src={video.embedUrl} controls className="aspect-video w-full" />
            ) : (
              <iframe
                src={video.embedUrl}
                title="Preview do vídeo da aula"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="aspect-video w-full"
              />
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wide text-[#475569]">Duração</label>
          <input
            value={durationText}
            onChange={(e) => setDurationText(e.target.value)}
            placeholder="mm:ss — ex: 12:34"
            inputMode="numeric"
            className={inputClass}
          />
          <p className="text-[11px] font-medium text-[#94A3B8]">
            {durationSeconds > 0 ? `Será exibida como ${formatDuration(durationSeconds)} para o aluno` : 'Aceita 12:34, 1:02:03 ou segundos'}
          </p>
          <input type="hidden" name="duration_seconds" value={durationSeconds} />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wide text-[#475569]">Conteúdo da aula (material de apoio)</label>
        <textarea
          name="content_text"
          rows={5}
          defaultValue={defaultValues?.content_text ?? ''}
          placeholder="Resumo, pontos-chave, exercícios ou instruções. O aluno vê este texto logo abaixo do vídeo."
          className="w-full resize-y rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-medium text-[#111827] transition-all placeholder:text-[#94A3B8] focus:border-[#ec6411] focus:outline-none focus:ring-2 focus:ring-[#ec6411]/25"
        />
      </div>

      <div className="flex flex-wrap gap-3 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#ec6411] px-6 text-sm font-bold text-white shadow-md shadow-[#ec6411]/20 transition-all hover:bg-[#cc4f06] disabled:opacity-50"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-lg border border-[#E5E7EB] bg-white px-5 text-sm font-bold text-[#64748B] shadow-sm transition-all hover:bg-[#F8FAFC] hover:text-[#111827]"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
