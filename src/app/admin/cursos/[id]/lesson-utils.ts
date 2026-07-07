export type VideoInfo =
  | { kind: 'youtube' | 'vimeo' | 'file'; embedUrl: string; label: string }
  | { kind: 'unknown'; embedUrl?: undefined; label: string }
  | null

/** Detecta o provedor do vídeo e gera a URL de embed (mesmas regras do player do aluno). */
export function detectVideo(url: string | null | undefined): VideoInfo {
  if (!url || !url.trim()) return null
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (yt) {
    return {
      kind: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1`,
      label: 'YouTube',
    }
  }
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vm) {
    return {
      kind: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vm[1]}?portrait=0&title=0&byline=0`,
      label: 'Vimeo',
    }
  }
  if (/\.(mp4|webm|mov|m3u8)(\?|#|$)/i.test(url)) {
    return { kind: 'file', embedUrl: url, label: 'Arquivo de vídeo' }
  }
  return { kind: 'unknown', label: 'Formato não reconhecido' }
}

/** Aceita "12:34", "1:02:03" ou segundos puros ("754") e devolve segundos. */
export function parseDurationToSeconds(input: string): number {
  const v = input.trim()
  if (!v) return 0
  if (/^\d+$/.test(v)) return parseInt(v, 10)
  const parts = v.split(':').map((p) => parseInt(p, 10))
  if (parts.length > 3 || parts.some((p) => Number.isNaN(p) || p < 0)) return 0
  return parts.reduce((acc, p) => acc * 60 + p, 0)
}

/** Formata segundos como "mm:ss" ou "h:mm:ss". Vazio para 0. */
export function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return ''
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const ss = String(s).padStart(2, '0')
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${ss}`
  return `${m}:${ss}`
}
