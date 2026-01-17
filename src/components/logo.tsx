import { motion } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import EmblemSVG from "@/components/logos/emblem.svg"
import LogoSVG from "@/components/logos/logo.svg"

interface LogoProps {
    size?: number
    className?: string
}

export function Emblem({ size = 20, className = "" }: LogoProps) {
    return (
        <EmblemSVG className={className} height={size} />
    )
}

export function Logo({ size = 20, className = "" }: LogoProps) {
    return (
        <LogoSVG className={className} height={size} />
    )
}

const SLIDE_DELAY = 0.8
const SLIDE_DURATION = 0.8
const SLIDE_DISTANCE_RATIO = 0.15

interface AnimatedLogoProps {
    className?: string
}

export function AnimatedLogo({ className = "" }: AnimatedLogoProps) {
    const svgRef = useRef<SVGSVGElement>(null)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        if (!svgRef.current) return

        const viewBox = svgRef.current.viewBox.baseVal
        const slideDistance = viewBox.width * SLIDE_DISTANCE_RATIO

        const excludedIds = ['logo-wing-l', 'logo-body', 'logo-wing-r']

        const allPaths = svgRef.current.querySelectorAll('[id^="logo-"]')

        allPaths.forEach((element) => {
            const id = element.getAttribute('id')
            if (id && !excludedIds.includes(id)) {
                const htmlElement = element as HTMLElement

                htmlElement.style.opacity = '0'
                htmlElement.style.transform = `translateX(-${slideDistance}px)`
                htmlElement.style.transformOrigin = 'center'
            }
        })

        setIsReady(true)

        setTimeout(() => {
            allPaths.forEach((element) => {
                const id = element.getAttribute('id')
                if (id && !excludedIds.includes(id)) {
                    const htmlElement = element as HTMLElement

                    htmlElement.style.opacity = '1'
                    htmlElement.style.transition = `transform ${SLIDE_DURATION}s cubic-bezier(0.16, 1, 0.3, 1), opacity ${SLIDE_DURATION}s cubic-bezier(0.16, 1, 0.3, 1)`
                    htmlElement.style.transform = 'translateX(0)'
                }
            })
        }, SLIDE_DELAY * 1000)
    }, [])

    return (
        <LogoSVG
            ref={svgRef}
            className={className}
            style={{ visibility: isReady ? 'visible' : 'hidden' }}
        />
    )
}