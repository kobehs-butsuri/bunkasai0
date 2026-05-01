"use client"

import { useEffect, useState } from "react"
import Hero from "@/components/hero"
import { AccessBanner } from "@/components/access"
import LatestNews from "@/components/latest-news"
import Footer from "@/components/footer"
import dynamic from "next/dynamic"
import festivalData from "@/data/festival.json"
import { Day } from "@/data/types"

const Countdown = dynamic(() => import("../components/countdown"), { ssr: false })

export default function Home() {
    const [scrollY, setScrollY] = useState(0)
    const [label, setLabel] = useState<string | null>(null)
    const [targetDate, setTargetDate] = useState<Date | null>(null)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        const days = festivalData.festival.days as Day[]
        const now = new Date()

        // ローカル日付で比較（UTCズレ回避）
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`

        const today = days.find(d => d.date === todayStr)
        if (today) {
            setLabel(`きょうは${today.name}`)
            setTargetDate(null)
            setReady(true)
            return
        }

        const futureDays = days
            .map(d => ({
                ...d,
                dateObj: new Date(d.date + "T00:00:00"),
            }))
            .filter(d => d.dateObj > now)
            .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())

        if (futureDays.length > 0) {
            setLabel(null)
            setTargetDate(futureDays[0].dateObj)
            setReady(true)
            return
        }

        setLabel("創立記念祭は終了しました。")
        setTargetDate(null)
        setReady(true)
    }, [])

    return (
        <div>
            <Hero scrollY={scrollY} />

            <div className="m-4 bg-muted flex">
                <div className="mx-auto my-20 w-fit">

                    {ready && label && (
                        <p className="text-center text-xl text-accent-foreground font-bold mb-4">
                            {label}
                        </p>
                    )}

                    {ready && !label && targetDate && (
                        <>
                            <div className="w-fit mx-auto">
                                <p className="text-right">
                                    <span className="text-5xl text-accent-foreground font-bold">
                                        創立記念祭
                                    </span>
                                    <br />
                                    <span className="text-2xl text-muted-foreground">
                                        まで
                                    </span>
                                </p>
                            </div>

                            <div className="w-fit flex items-end">
                                <p className="text-center text-muted-foreground text-4xl p-2">
                                    あと
                                </p>
                                <Countdown
                                    date={targetDate}
                                    className="font-bold text-accent text-8xl"
                                />
                                <p className="text-center text-muted-foreground text-4xl p-2">
                                    日
                                </p>
                            </div>
                        </>
                    )}

                </div>
            </div>

            <LatestNews />
            <AccessBanner />
            <Footer />
        </div>
    )
}