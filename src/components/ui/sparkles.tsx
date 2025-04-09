"use client"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function SparklesCore({
  id,
  background,
  minSize,
  maxSize,
  speed,
  particleColor,
  className,
  particleDensity,
}: {
  id: string
  background?: string
  minSize?: number
  maxSize?: number
  speed?: number
  particleColor?: string
  className?: string
  particleDensity?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setDimensions({ width, height })
        canvas.width = width
        canvas.height = height
      }
    })

    resizeObserver.observe(canvas.parentElement as Element)

    const getOrCreateParticle = () => {
      return {
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * (maxSize || 3 - (minSize || 1)) + (minSize || 1),
        speedX: (Math.random() - 0.5) * (speed || 0.1),
        speedY: (Math.random() - 0.5) * (speed || 0.1),
      }
    }

    const particleCount = Math.min(
      Math.max(Math.floor((dimensions.width * dimensions.height) / (particleDensity || 10000)), 50),
      500,
    )

    const particles = Array.from({ length: particleCount }, getOrCreateParticle)

    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      particles.forEach((particle) => {
        if (!ctx) return

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particleColor || "#27E0B3"
        ctx.fill()

        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x > dimensions.width) particle.x = 0
        if (particle.x < 0) particle.x = dimensions.width
        if (particle.y > dimensions.height) particle.y = 0
        if (particle.y < 0) particle.y = dimensions.height
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      resizeObserver.disconnect()
    }
  }, [dimensions, minSize, maxSize, speed, particleColor, particleDensity])

  return (
    <div className={cn("h-full w-full", className)}>
      <canvas
        ref={canvasRef}
        id={id}
        className="h-full w-full"
        style={{
          background: background || "transparent",
        }}
      />
    </div>
  )
}
