'use client'

import Image from 'next/image'

export interface AvatarData {
  id: string
  name: string
  avatarUrl?: string | null
  href?: string
}

interface AvatarStackProps {
  avatars: AvatarData[]
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showMore?: boolean
  className?: string
}

function getSizeClasses(size: 'sm' | 'md' | 'lg') {
  const sizes = {
    sm: {
      avatar: 'h-7 w-7',
      text: 'text-[9px]',
      overlap: '-ml-2',
      container: 'h-7',
    },
    md: {
      avatar: 'h-9 w-9',
      text: 'text-[10px]',
      overlap: '-ml-2.5',
      container: 'h-9',
    },
    lg: {
      avatar: 'h-11 w-11',
      text: 'text-xs',
      overlap: '-ml-3',
      container: 'h-11',
    },
  }
  return sizes[size]
}

export function AvatarStack({
  avatars,
  max = 4,
  size = 'md',
  showMore = true,
  className = '',
}: AvatarStackProps) {
  const sizeClasses = getSizeClasses(size)
  const displayed = avatars.slice(0, max)
  const remaining = avatars.length - max

  if (avatars.length === 0) return null

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center">
        {displayed.map((avatar, index) => (
          <div
            key={avatar.id}
            className={`relative overflow-hidden rounded-full border-2 border-[#0F1729] ${sizeClasses.avatar} ${index > 0 ? sizeClasses.overlap : ''} ${sizeClasses.container} shrink-0`}
            style={{ zIndex: displayed.length - index }}
            title={avatar.name}
          >
            {avatar.avatarUrl ? (
              <Image
                src={avatar.avatarUrl}
                alt={avatar.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/40 to-violet-500/40 text-white/80">
                <span className={`font-bold ${sizeClasses.text}`}>
                  {avatar.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Online indicator */}
            {avatar.href === undefined && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0F1729] bg-emerald-500" />
            )}
          </div>
        ))}

        {/* "+N" indicator */}
        {remaining > 0 && showMore && (
          <div
            className={`relative flex items-center justify-center rounded-full border-2 border-[#0F1729] bg-white/10 ${sizeClasses.avatar} ${sizeClasses.overlap} ${sizeClasses.container} shrink-0`}
            style={{ zIndex: 0 }}
          >
            <span className={`font-semibold text-white/70 ${sizeClasses.text}`}>
              +{remaining}
            </span>
          </div>
        )}
      </div>

      {/* Label next to stack */}
      {remaining > 0 && showMore && (
        <p className="ml-2 text-xs text-white/50">
          <span className="font-medium text-white/70">{displayed.length}</span> de{' '}
          <span className="font-medium text-white/70">{avatars.length}</span> pessoas
        </p>
      )}
    </div>
  )
}

// ── Avatar Group compact ──
interface AvatarGroupCompactProps {
  avatars: AvatarData[]
  label?: string
  className?: string
}

export function AvatarGroupCompact({ avatars, label, className = '' }: AvatarGroupCompactProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <AvatarStack avatars={avatars} max={3} size="sm" />
      {label && (
        <p className="text-xs text-white/50">{label}</p>
      )}
    </div>
  )
}

// ── Single Avatar ──
interface SingleAvatarProps {
  avatar: AvatarData
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showName?: boolean
  isOnline?: boolean
  className?: string
}

export function SingleAvatar({
  avatar,
  size = 'md',
  showName = false,
  isOnline = false,
  className = '',
}: SingleAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20',
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-3xl',
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative">
        <div className={`overflow-hidden rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-500/30 ${sizeClasses[size]}`}>
          {avatar.avatarUrl ? (
            <Image
              src={avatar.avatarUrl}
              alt={avatar.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className={`font-bold text-indigo-300 ${textSizes[size]}`}>
                {avatar.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0F1729] bg-emerald-500" />
        )}
      </div>

      {showName && (
        <div className="text-center">
          <p className="text-sm font-medium text-white">{avatar.name}</p>
          {avatar.href && (
            <a href={avatar.href} className="text-xs text-indigo-400 hover:text-indigo-300">
              Ver perfil
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default AvatarStack