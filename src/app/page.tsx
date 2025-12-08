"use client"

import { useEffect, useState } from "react"
import Hero from "@/components/hero"
import ParallaxContainer from "@/components/parallax-container"
import {AccessBanner} from "@/components/access";

export default function Home() {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div>
            <ParallaxContainer offset={scrollY * 0.1}>
                <Hero scrollY={scrollY} />
            </ParallaxContainer>
            <ParallaxContainer offset={scrollY * 0.1}>
                <AccessBanner/>
            </ParallaxContainer>
        </div>
    )
}
