"use client"

import { useEffect, useState } from "react"
import Hero from "@/components/hero"
import ParallaxContainer from "@/components/parallax-container"
import {AccessBanner} from "@/components/access";
import LatestNews from "@/components/latest-news";
import Footer from "@/components/footer";
import dynamic from 'next/dynamic'

const Countdown = dynamic(() => import('../components/countdown'), { ssr: false })

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
            <Hero scrollY={scrollY} />
            <div className="m-4 bg-muted flex">
                <div className={"mx-auto my-20 w-fit"}>
                    <div className={"w-fit mx-auto"}>
                        <p className="text-right">
                            <span className={"text-5xl text-accent-foreground font-bold"}>創立記念祭</span><br/><span className={"text-2xl text-muted-foreground"}>まで</span>
                        </p>
                    </div>
                    <div className={"w-fit flex items-end"}>
                        <p className="text-center text-muted-foreground align-text-bottom text-4xl p-2">あと</p>
                        <Countdown
                            date={new Date(2026, 4, 2, 9, 0, 0)}
                            className={"font-bold text-accent text-8xl"}
                        />
                        <p className="text-center text-muted-foreground align-text-bottom text-4xl p-2">日</p>
                    </div>
                </div>
            </div>
            <LatestNews />
            <ParallaxContainer offset={scrollY * 0.1}>
                <AccessBanner/>
            </ParallaxContainer>
            <Footer/>
        </div>
    )
}
