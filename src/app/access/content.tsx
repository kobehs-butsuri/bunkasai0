"use client"

import { useEffect, useState } from "react"
import ParallaxContainer from "@/components/parallax-container"
import GoogleMap from "@/components/google-map";
import {AccessTransportation} from "@/components/access";
import {useSetPageTitle} from "@/hooks/page-title-context";

export default function Access() {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useSetPageTitle("アクセス")

    return (
        <div className="max-w-7xl mx-auto">
            <title>アクセス</title>
            {/* Location Information */}
            <div className="grid md:grid-cols-2 grid-rows-1 gap-12 mb-24 mx-10">
                <ParallaxContainer offset={scrollY * 0.35}>
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-6">会場情報</h2>
                        <div className="space-y-6 text-foreground/80 leading-relaxed">
                            <div>
                                <p className="font-semibold text-foreground mb-2">会場名</p>
                                <p>兵庫県立神戸高等学校</p>
                            </div>
                            <div>
                                <p className="font-semibold text-foreground mb-2">住所</p>
                                <p>兵庫県神戸市灘区城の下通1丁目5-1</p>
                            </div>
                            <div>
                                <p className="font-semibold text-foreground mb-2">開催日時</p>
                                <p>2026/XX/XX</p>
                            </div>
                        </div>
                    </div>
                </ParallaxContainer>

                <ParallaxContainer offset={scrollY * 0.3}>
                    <div className="border border-accent-light p-8 bg-primary/5">
                        <h3 className="text-2xl font-bold text-foreground mb-6">交通アクセス</h3>
                        <AccessTransportation/>
                    </div>
                </ParallaxContainer>
            </div>

            {/* Map Placeholder */}
            <ParallaxContainer offset={scrollY * 0.25}>
                <GoogleMap/>
            </ParallaxContainer>

            {/* Additional Information */}
            <ParallaxContainer offset={scrollY * 0.2}>
                <div className="border-l-4 border-primary mt-20 pl-8 mx-10">
                    <h2 className="text-2xl font-bold text-foreground mb-4">注意事項</h2>
                    <ul className="space-y-3 text-foreground/80">
                        <li>注意書き1</li>
                        <li>注意書き2</li>
                        <li>注意書き3</li>
                        <li>注意書き4</li>
                    </ul>
                </div>
            </ParallaxContainer>
        </div>
    )
}
