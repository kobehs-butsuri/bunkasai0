"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import Footer from "@/components/footer"
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
        <div className="w-full bg-background">
            <Header />
            <ParallaxContainer offset={scrollY * 0.5}>
                <Hero scrollY={scrollY} />
            </ParallaxContainer>
            <ParallaxContainer offset={scrollY * 0.5}>
                <AccessBanner/>
            </ParallaxContainer>
            <Footer />
        </div>
    )
}
