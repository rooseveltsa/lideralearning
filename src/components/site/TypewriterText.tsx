'use client'

import { useEffect, useState } from 'react'

type Props = {
  text: string
  speed?: number
  delay?: number
  className?: string
  cursorColor?: string
}

export default function TypewriterText({
  text,
  speed = 55,
  delay = 400,
  className = '',
  cursorColor = '#4CAF50',
}: Props) {
  const [displayed, setDisplayed] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1))
        i++
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, speed, delay])

  useEffect(() => {
    if (!done) return
    const blink = setInterval(() => setShowCursor((v) => !v), 530)
    const hide = setTimeout(() => {
      clearInterval(blink)
      setShowCursor(false)
    }, 3000)
    return () => {
      clearInterval(blink)
      clearTimeout(hide)
    }
  }, [done])

  return (
    <span className={className}>
      {displayed}
      <span
        className="inline-block w-[3px] translate-y-[2px] rounded-sm"
        style={{
          height: '0.85em',
          backgroundColor: showCursor ? cursorColor : 'transparent',
          transition: 'background-color 0.1s',
          marginLeft: '2px',
        }}
      />
    </span>
  )
}
