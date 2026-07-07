'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const PALETTE = ['#fb7d2e', '#2eb555', '#5d92f7', '#f5f1ea']

function makeSprite(): THREE.CanvasTexture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.4, 'rgba(255,255,255,0.6)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}

/**
 * Campo de partículas ascendentes (metáfora de crescimento da marca),
 * com parallax de câmera pelo mouse. Pausa fora da viewport e com aba oculta.
 */
export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' })
    } catch {
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      60
    )
    camera.position.set(0, 0, 13)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    const COUNT = window.innerWidth < 768 ? 350 : 850
    const positions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)
    const baseX = new Float32Array(COUNT)
    const speed = new Float32Array(COUNT)
    const phase = new Float32Array(COUNT)
    const color = new THREE.Color()

    for (let i = 0; i < COUNT; i++) {
      baseX[i] = (Math.random() - 0.5) * 30
      positions[i * 3] = baseX[i]
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      speed[i] = 0.008 + Math.random() * 0.02
      phase[i] = Math.random() * Math.PI * 2
      color.set(PALETTE[i % PALETTE.length])
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const sprite = makeSprite()
    const material = new THREE.PointsMaterial({
      size: 0.16,
      map: sprite,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
    scene.add(new THREE.Points(geometry, material))

    let mouseX = 0
    let mouseY = 0
    const onPointerMove = (e: PointerEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onPointerMove)

    let inView = true
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
    })
    io.observe(container)

    const start = performance.now()
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!inView || document.hidden) return
      const t = (performance.now() - start) / 1000
      const pos = geometry.attributes.position.array as Float32Array
      for (let i = 0; i < COUNT; i++) {
        let y = pos[i * 3 + 1] + speed[i]
        if (y > 9) y = -9
        pos[i * 3 + 1] = y
        pos[i * 3] = baseX[i] + Math.sin(t * 0.4 + phase[i]) * 0.6
      }
      geometry.attributes.position.needsUpdate = true
      camera.position.x += (mouseX * 1.4 - camera.position.x) * 0.03
      camera.position.y += (-mouseY * 0.8 - camera.position.y) * 0.03
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
    }
    tick()

    const ro = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = container
      if (!clientWidth || !clientHeight) return
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(clientWidth, clientHeight)
    })
    ro.observe(container)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
      io.disconnect()
      ro.disconnect()
      geometry.dispose()
      material.dispose()
      sprite.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0" aria-hidden="true" />
}
