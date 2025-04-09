"use client"

import type React from "react"
import { cn } from "@/lib/utils"

export const MovingBorderButton = ({
  borderRadius = "1.75rem",
  children,
  duration = 2500,
  className,
  containerClassName,
  borderClassName,
  as: Component = "button",
  ...otherProps
}: {
  borderRadius?: string
  children: React.ReactNode
  duration?: number
  className?: string
  containerClassName?: string
  borderClassName?: string
  as?: any
  [key: string]: any
}) => {
  return (
    <Component
      className={cn("relative p-[1px] overflow-hidden", containerClassName)}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div className="absolute inset-0" style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}>
        <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]">
          <div
            className={cn("h-[200%] w-[200%] rounded-full", borderClassName)}
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0 220deg, #27E0B3 250deg 290deg, transparent 290deg 360deg)",
            }}
          />
        </div>
      </div>

      <div
        className={cn("relative flex items-center justify-center w-full h-full bg-black text-white", className)}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  )
}
