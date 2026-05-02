"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"

function ConvergingLinesMask() {
    // Create lines that converge like the reference image
    // Dense at bottom, sparse at top, creating a reveal effect from top
    const lineCount = 40
    const lines = []

    for (let i = 0; i < lineCount; i++) {
        // Calculate spacing that gets progressively wider toward top
        const progress = i / (lineCount - 1)
        // Exponential spacing - tight at bottom (100%), wide at top (0%)
        const y = 100 - (progress * progress * 100)

        // Line thickness varies - thicker at bottom
        const thickness = Math.max(1, 3 - progress * 2)

        lines.push({ y, thickness, delay: i * 0.02 })
    }

    return (
        <div className="absolute inset-0 pointer-events-none z-25">
            {/* Solid area at bottom */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 bg-background"
                style={{ height: "15%", transformOrigin: "bottom" }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
            />

            {/* Converging horizontal lines - from bottom up */}
            <div className="absolute inset-0" style={{ bottom: "15%", top: 0 }}>
                {lines.map((line, i) => (
                    <motion.div
                        key={i}
                        className="absolute left-0 right-0 bg-background"
                        style={{
                            top: `${line.y}%`,
                            height: `${line.thickness}px`,
                        }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                            duration: 0.8,
                            delay: line.delay,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

function ScanLines() {
    return (
        <motion.div
            className="absolute inset-0 pointer-events-none z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
        >
            <div
                className="absolute inset-0"
                style={{
                    background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.03) 2px,
            rgba(0, 0, 0, 0.03) 4px
          )`
                }}
            />
        </motion.div>
    )
}

function GlitchText({ children, className }: { children: string; className?: string }) {
    const [isGlitching, setIsGlitching] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const interval = setInterval(() => {
            if (Math.random() > 0.95) {
                setIsGlitching(true)
                setTimeout(() => setIsGlitching(false), 150)
            }
        }, 100)
        return () => clearInterval(interval)
    }, [])

    if (!mounted) {
        return <span className={className}>{children}</span>
    }

    return (
        <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
            {isGlitching && (
                <>
          <span
              className="absolute inset-0 text-accent z-0"
              style={{ transform: "translate(-2px, 1px)", clipPath: "inset(20% 0 50% 0)" }}
          >
            {children}
          </span>
                    <span
                        className="absolute inset-0 text-secondary z-0"
                        style={{ transform: "translate(2px, -1px)", clipPath: "inset(50% 0 20% 0)" }}
                    >
            {children}
          </span>
                </>
            )}
    </span>
    )
}

function MorphingLines() {
    // Fixed positions, no randomness
    const lines = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        initialY: (i / 20) * 100,
    }))

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20 mix-blend-overlay">
            {lines.map((line) => (
                <motion.div
                    key={line.id}
                    className="absolute left-0 right-0 bg-foreground/20"
                    style={{
                        top: `${line.initialY}%`,
                        height: "1px",
                    }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{
                        scaleX: [0, 1, 1, 0],
                        opacity: [0, 0.8, 0.8, 0],
                        x: ["0%", "0%", "0%", "100%"]
                    }}
                    transition={{
                        duration: 4,
                        delay: line.id * 0.15,
                        repeat: Infinity,
                        repeatDelay: 5,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                />
            ))}
        </div>
    )
}

function FloatingOrbs() {
    const [mounted, setMounted] = useState(false)
    const [orbData, setOrbData] = useState<Array<{ id: number; size: number; x: number; y: number }>>([])

    useEffect(() => {
        // Generate random values only on client
        const orbs = Array.from({ length: 5 }, (_, i) => ({
            id: i,
            size: 100 + (i * 40), // Deterministic sizes based on index
            x: 10 + (i * 20), // Deterministic positions
            y: 15 + (i * 18),
        }))
        setOrbData(orbs)
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
            {orbData.map((orb) => (
                <motion.div
                    key={orb.id}
                    className="absolute rounded-full"
                    style={{
                        width: orb.size,
                        height: orb.size,
                        left: `${orb.x}%`,
                        top: `${orb.y}%`,
                        background: `radial-gradient(circle, var(--accent) 0%, transparent 70%)`,
                        opacity: 0.05,
                        filter: "blur(40px)",
                    }}
                    animate={{
                        x: [0, 30, -20, 0],
                        y: [0, -40, 20, 0],
                        scale: [1, 1.2, 0.9, 1],
                    }}
                    transition={{
                        duration: 15 + orb.id * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    )
}

function QuoteReveal({ text, delay }: { text: string; delay: number }) {
    const chars = text.split("")

    return (
        <span>
      {chars.map((char, i) => (
          <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                  duration: 0.5,
                  delay: delay + i * 0.03,
                  ease: [0.22, 1, 0.36, 1],
              }}
          >
              {char === " " ? "\u00A0" : char}
          </motion.span>
      ))}
    </span>
    )
}

function CursorTrail() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY })
            setIsHovering(true)
        }
        const handleMouseLeave = () => setIsHovering(false)

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseleave", handleMouseLeave)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseleave", handleMouseLeave)
        }
    }, [])

    return (
        <motion.div
            className="fixed pointer-events-none z-50 hidden md:block"
            style={{
                width: 300,
                height: 300,
                x: mousePos.x - 150,
                y: mousePos.y - 150,
                background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
                opacity: isHovering ? 0.08 : 0,
                filter: "blur(50px)",
            }}
            animate={{
                scale: isHovering ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
        />
    )
}

export default function Content() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    })

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
    const imageScale = useTransform(smoothProgress, [0, 1], [1, 1.15])
    const imageY = useTransform(smoothProgress, [0, 1], [0, 80])
    const imageRotate = useTransform(smoothProgress, [0, 1], [0, 2])

    return (
        <div
            ref={containerRef}
            className="min-h-[calc(100dvh-100px)] md:min-h-[calc(100dvh-84px)] pt-20 relative bg-background"
        >
            <CursorTrail />

            {/* Full-screen image with parallax */}
            <motion.div
                className="absolute inset-0 z-0"
                style={{ scale: imageScale, y: imageY, rotateZ: imageRotate }}
            >
                <Image
                    src="/image/tsurusaki.jpg"
                    alt="鶴崎久米一初代校長の銅像"
                    fill
                    className="object-cover object-center"
                    priority
                />

                {/* Vignette effect only - no gradient overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: "radial-gradient(ellipse at center, transparent 30%, var(--background) 100%)"
                    }}
                />
            </motion.div>

            {/* Converging lines mask - replaces gradient overlay */}
            <ConvergingLinesMask />

            {/* Floating orbs */}
            <FloatingOrbs />

            {/* Morphing horizontal lines */}
            <MorphingLines />

            {/* Scan lines */}
            <ScanLines />

            {/* Content */}
            <div className="relative z-40 h-full flex flex-col justify-center px-6 md:px-12 lg:px-20">
                <div className="max-w-3xl">
                    {/* Location tag with typing effect */}
                    <motion.div
                        className="mb-6 md:mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <motion.span
                            className="inline-flex items-center gap-3 text-xl font-bold tracking-[0.3em] text-primary uppercase"
                            initial={{ letterSpacing: "0.5em", opacity: 0 }}
                            animate={{ letterSpacing: "0.3em", opacity: 1 }}
                            transition={{ duration: 1.2, delay: 0.6 }}
                        >
                            <motion.span
                                className="w-8 md:w-12 h-px bg-secondary"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                                style={{ transformOrigin: "left" }}
                            />
                            正門東付近（雨天時昇降口）
                        </motion.span>
                    </motion.div>

                    {/* Subtitle */}
                    <motion.div
                        className="overflow-hidden mb-2 md:mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        <motion.p
                            className="text-sm md:text-lg text-accent tracking-[0.2em] font-bold"
                            initial={{ y: 30 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            FIRST PRINCIPAL
                        </motion.p>
                    </motion.div>

                    {/* Main title with 3D reveal */}
                    <div className="relative mb-8 md:mb-12" style={{ perspective: "1000px" }}>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[1.1] tracking-tight">
                            <div className="overflow-hidden">
                                <motion.span
                                    className="inline-block text-accent"
                                    initial={{ y: 100, rotateX: -45, opacity: 0 }}
                                    animate={{ y: 0, rotateX: 0, opacity: 1 }}
                                    transition={{ duration: 1, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <GlitchText>鶴崎</GlitchText>
                                </motion.span>
                            </div>
                            <div className="overflow-hidden">
                                <motion.span
                                    className="inline-block"
                                    initial={{ y: 100, rotateX: -45, opacity: 0 }}
                                    animate={{ y: 0, rotateX: 0, opacity: 1 }}
                                    transition={{ duration: 1, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    久米一の像
                                </motion.span>
                            </div>
                        </h1>

                        {/* Shadow text for depth */}
                        <div
                            className="absolute inset-0 text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight -z-10 select-none"
                            aria-hidden
                        >
                            <motion.div
                                className="text-transparent"
                                style={{
                                    WebkitTextStroke: "1px var(--accent)",
                                    opacity: 0.2,
                                }}
                                initial={{ x: 0, y: 0 }}
                                animate={{ x: 4, y: 4 }}
                                transition={{ duration: 1.5, delay: 1.8 }}
                            >
                                <div>鶴崎</div>
                                <div>久米一の像</div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Decorative element */}
                    <motion.div
                        className="flex items-center gap-4 mb-8 md:mb-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 2 }}
                    >
                        <motion.div
                            className="h-px bg-linear-to-r from-accent via-accent to-transparent grow max-w-48 md:max-w-72"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1.2, delay: 2.1, ease: [0.22, 1, 0.36, 1] }}
                            style={{ transformOrigin: "left" }}
                        />
                        <motion.div
                            className="relative"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.6, delay: 2.4, type: "spring" }}
                        >
                            <div className="w-2 h-2 bg-accent" />
                            <motion.div
                                className="absolute inset-0 w-2 h-2 bg-accent"
                                animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.div>
                    </motion.div>

                    {/* Quote with character-by-character reveal */}
                    <motion.blockquote
                        className="relative"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 2.2 }}
                    >
                        <motion.div
                            className="absolute -left-2 md:-left-4 top-0 bottom-0 w-0.5 bg-linear-to-b from-secondary via-secondary to-transparent"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.8, delay: 2.3 }}
                            style={{ transformOrigin: "top" }}
                        />
                        <div className="pl-6 md:pl-10">
                            <p className="text-xl md:text-3xl lg:text-4xl text-primary leading-relaxed font-bold tracking-wide text-pretty">
                                <QuoteReveal text="「行き詰まったら" delay={2.5} />
                                <br className="hidden md:block" />
                                <QuoteReveal text="初心に返ることも" delay={3.0} />
                                <br className="hidden md:block" />
                                <QuoteReveal text="大切である」" delay={3.5} />
                            </p>
                        </div>
                    </motion.blockquote>
                </div>
            </div>
        </div>
    )
        }
