"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const TextRevealCard = ({
  text,
  revealText,
  children,
  className,
}: {
  text: string
  revealText: string
  children?: React.ReactNode
  className?: string
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return (
    <div
      className={cn(
        "relative w-full max-w-xl overflow-hidden rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative z-10">
        <div className="text-base text-neutral-600 dark:text-neutral-400">{children}</div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-4 text-4xl font-bold text-neutral-900 dark:text-white"
        >
          {text}
        </motion.div>
      </div>

      <motion.div
        aria-hidden="true"
        initial={{
          y: isMobile ? 0 : 80,
          opacity: isMobile ? 1 : 0,
        }}
        animate={{
          y: isHovered || isMobile ? 0 : 80,
          opacity: isHovered || isMobile ? 1 : 0,
        }}
        transition={{
          duration: 0.4,
          ease: [0.23, 1, 0.32, 1],
        }}
        className="absolute inset-0 z-0 flex items-center justify-center text-5xl font-bold text-[#27E0B3]"
      >
        {revealText}
      </motion.div>
    </div>
  )
}
