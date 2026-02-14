import { useRef, useEffect, useState } from "react"
import EmblemSVG from "@/components/logos/emblem.svg"
import LogoSVG from "@/components/logos/logo.svg"

interface LogoProps {
    size?: number
    className?: string
}

export function Emblem({ size = 20, className = "" }: LogoProps) {
    return <EmblemSVG className={className} height={size} />
}

export function Logo({ size = 20, className = "" }: LogoProps) {
    return <LogoSVG className={className} height={size} />
}

type LogoAnimationSpec = {
    delay: number
    duration: number
    easing?: string
    fromX?: number
    toX?: number
    fromY?: number
    toY?: number
    fromOpacity?: number
    toOpacity?: number
    fromRotate?: number
    toRotate?: number
    fromScale?: number
    toScale?: number
    style?: Partial<CSSStyleDeclaration>
}

const LOGO_ANIMATIONS: Record<string, LogoAnimationSpec> = {
    "logo-B1": {
        delay: 1.8,
        duration: 0.8,
        fromY: 100,
        toY: 0,
        fromOpacity: 0,
        toOpacity: 1,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        style: { fill: "#fcfaed" },
    },
    "logo-B2": {
        delay: 1.9,
        duration: 0.8,
        fromY: 100,
        toY: 0,
        fromOpacity: 0,
        toOpacity: 1,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        style: { fill: "#fcfaed" },
    },
    "logo-O": {
        delay: 2.0,
        duration: 0.8,
        fromY: 100,
        toY: 0,
        fromOpacity: 0,
        toOpacity: 1,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        style: { fill: "#fcfaed" },
    },
    "logo-t": {
        delay: 2.1,
        duration: 0.7,
        fromY: 80,
        toY: 0,
        fromOpacity: 0,
        toOpacity: 1,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        style: { fill: "#fcfaed" },
    },
    "logo-h": {
        delay: 2.2,
        duration: 0.7,
        fromY: 80,
        toY: 0,
        fromOpacity: 0,
        toOpacity: 1,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        style: { fill: "#fcfaed" },
    },
    "logo-wing-l": {
        delay: 1.2,
        duration: 0.4,
        fromOpacity: 0,
        toOpacity: 1,
        style: { fill: "#001a43" },
    },
    "logo-body": {
        delay: 1.2,
        duration: 0.4,
        fromOpacity: 0,
        toOpacity: 1,
        style: { fill: "#001a43" },
    },
    "logo-wing-r": {
        delay: 1.2,
        duration: 0.4,
        fromOpacity: 0,
        toOpacity: 1,
        style: { fill: "#001a43" },
    },
}

export function AnimatedLogo({ className = "" }) {
    const svgRef = useRef<SVGSVGElement>(null)
    const loadingRef = useRef<HTMLDivElement>(null)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const svg = svgRef.current
        if (!svg) return

        const animations: Animation[] = []

        Object.entries(LOGO_ANIMATIONS).forEach(([id, spec]) => {
            const el = svg.getElementById(id) as SVGGraphicsElement | null
            if (!el) return

            if (spec.style) {
                Object.assign(el.style, spec.style)
            }

            el.style.transformBox = "fill-box"
            el.style.transformOrigin = "center"

            const total = spec.delay + spec.duration
            const holdOffset = spec.delay / total

            const fromX = spec.fromX ?? 0
            const toX = spec.toX ?? fromX
            const fromY = spec.fromY ?? 0
            const toY = spec.toY ?? fromY
            const fromOpacity = spec.fromOpacity ?? 1
            const toOpacity = spec.toOpacity ?? fromOpacity
            const fromRotate = spec.fromRotate ?? 0
            const toRotate = spec.toRotate ?? fromRotate
            const fromScale = spec.fromScale ?? 1
            const toScale = spec.toScale ?? fromScale

            const anim = el.animate(
                [
                    {
                        offset: 0,
                        transform: `translate(${fromX}px, ${fromY}px) rotate(${fromRotate}deg) scale(${fromScale})`,
                        opacity: fromOpacity,
                    },
                    {
                        offset: holdOffset,
                        transform: `translate(${fromX}px, ${fromY}px) rotate(${fromRotate}deg) scale(${fromScale})`,
                        opacity: fromOpacity,
                    },
                    {
                        offset: 1,
                        transform: `translate(${toX}px, ${toY}px) rotate(${toRotate}deg) scale(${toScale})`,
                        opacity: toOpacity,
                    },
                ],
                {
                    duration: total * 1000,
                    easing: spec.easing ?? "linear",
                    fill: "forwards",
                }
            )

            anim.pause()
            animations.push(anim)
        })

        setIsReady(true)

        requestAnimationFrame(() => {
            animations.forEach(a => a.play())
        })

        const dots = loadingRef.current?.querySelectorAll(".dot")
        if (!dots || dots.length === 0) return

        const ACTIVE = 600
        const STAGGER = 300
        const WAIT = 800

        const TOTAL =
            STAGGER * (dots.length - 1) +
            ACTIVE +
            WAIT

        dots.forEach((dot, index) => {
            const el = dot as HTMLElement

            el.animate(
                [
                    { offset: 0, transform: "translateY(0px)" },
                    { offset: (index * STAGGER) / TOTAL, transform: "translateY(0px)" },

                    { offset: (index * STAGGER + ACTIVE * 0.25) / TOTAL, transform: "translateY(-6px)" },
                    { offset: (index * STAGGER + ACTIVE * 0.5) / TOTAL, transform: "translateY(0px)" },
                    { offset: (index * STAGGER + ACTIVE * 0.75) / TOTAL, transform: "translateY(6px)" },
                    { offset: (index * STAGGER + ACTIVE) / TOTAL, transform: "translateY(0px)" },

                    { offset: 1, transform: "translateY(0px)" },
                ],
                {
                    duration: TOTAL,
                    easing: "ease-in-out",
                    iterations: Infinity,
                }
            )
        })
    }, [])

    return (
        <div
            className={className}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <LogoSVG
                ref={svgRef}
                style={{
                    visibility: isReady ? "visible" : "hidden",
                }}
            />

            <div
                ref={loadingRef}
                style={{
                    marginTop: 16,
                    fontSize: 18,
                    letterSpacing: 1,
                    color: "#fcfaed",
                    fontFamily: "sans-serif",
                    display: isReady ? "block" : "none",
                }}
            >
                Now loading
                <span className="dot" style={{ display: "inline-block" }}>.</span>
                <span className="dot" style={{ display: "inline-block" }}>.</span>
                <span className="dot" style={{ display: "inline-block" }}>.</span>
            </div>
        </div>
    )
}
