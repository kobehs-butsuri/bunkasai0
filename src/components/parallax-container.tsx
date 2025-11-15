"use client"

import type React from "react"

interface ParallaxContainerProps {
    children: React.ReactNode
    offset: number
}

export default function ParallaxContainer({ children, offset }: ParallaxContainerProps) {
    return <div style={{ transform: `translateY(${offset * 0.1}px)` }}>{children}</div>
}
