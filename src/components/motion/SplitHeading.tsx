'use client'

import { CSSProperties, ElementType, ReactNode, useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from './gsapSetup'

type SplitHeadingProps = {
  children: ReactNode
  as?: ElementType
  className?: string
  style?: CSSProperties
  delay?: number
}

/**
 * Revela o título palavra por palavra com máscara (line-mask reveal),
 * preservando a estrutura interna (em, strong, br) e suas cores.
 */
export default function SplitHeading({
  children,
  as: Tag = 'h2',
  className,
  style,
  delay = 0,
}: SplitHeadingProps) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || el.dataset.split) return
    el.dataset.split = 'true'

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    const textNodes: Text[] = []
    while (walker.nextNode()) textNodes.push(walker.currentNode as Text)

    const words: HTMLElement[] = []
    for (const node of textNodes) {
      const content = node.textContent ?? ''
      if (!content.trim()) continue
      const frag = document.createDocumentFragment()
      for (const part of content.split(/(\s+)/)) {
        if (!part) continue
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part))
          continue
        }
        const mask = document.createElement('span')
        mask.style.display = 'inline-block'
        mask.style.overflow = 'hidden'
        mask.style.verticalAlign = 'top'
        const word = document.createElement('span')
        word.style.display = 'inline-block'
        word.textContent = part
        mask.appendChild(word)
        frag.appendChild(mask)
        words.push(word)
      }
      node.parentNode?.replaceChild(frag, node)
    }

    const ctx = gsap.context(() => {
      gsap.set(words, { yPercent: 115 })
      gsap.to(words, {
        yPercent: 0,
        duration: 0.95,
        ease: 'power4.out',
        stagger: 0.04,
        delay,
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      })
    }, el)

    return () => ctx.revert()
  }, [delay])

  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  )
}
