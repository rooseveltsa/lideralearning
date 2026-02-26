'use client'

type VideoPlayerProps = {
    url: string
    thumbnail?: string | null
}

function getYouTubeId(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    return match ? match[1] : null
}

function getVimeoId(url: string): string | null {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
    return match ? match[1] : null
}

export default function VideoPlayer({ url, thumbnail }: VideoPlayerProps) {
    const ytId = getYouTubeId(url)
    const vimeoId = getVimeoId(url)

    if (ytId) {
        return (
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
                <iframe
                    src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
                    title="Aula em vídeo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                />
            </div>
        )
    }

    if (vimeoId) {
        return (
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
                <iframe
                    src={`https://player.vimeo.com/video/${vimeoId}?color=3b82f6&portrait=0&title=0&byline=0`}
                    title="Aula em vídeo"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                />
            </div>
        )
    }

    // URL direta de vídeo (mp4, etc.)
    return (
        <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
            <video
                src={url}
                controls
                poster={thumbnail ?? undefined}
                className="w-full h-full"
                preload="metadata"
            >
                Seu navegador não suporta este formato de vídeo.
            </video>
        </div>
    )
}
