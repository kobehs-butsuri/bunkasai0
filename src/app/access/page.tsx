"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ParallaxContainer from "@/components/parallax-container"

export default function Access() {
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
            <Header/>

            <main className="pt-32 pb-24 px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Title Section */}
                    <ParallaxContainer offset={scrollY * 0.3}>
                        <div className="mb-16">
                            <h1
                                className="text-6xl font-bold tracking-wider text-foreground mb-6"
                                style={{letterSpacing: "0.05em"}}
                            >
                                アクセス
                            </h1>
                            <div className="w-24 h-1 bg-primary"></div>
                        </div>
                    </ParallaxContainer>

                    {/* Location Information */}
                    <div className="grid grid-cols-2 gap-12 mb-24">
                        <ParallaxContainer offset={scrollY * 0.35}>
                            <div>
                                <h2 className="text-3xl font-bold text-foreground mb-6">会場情報</h2>
                                <div className="space-y-6 text-foreground/80 leading-relaxed">
                                    <div>
                                        <p className="font-semibold text-foreground mb-2">会場名</p>
                                        <p>神戸高校</p>
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
                                <div className="space-y-4 text-foreground/80">
                                    <div>
                                        <p className="font-semibold text-foreground mb-1">電車</p>
                                        <p>阪急神戸本線 王子公園駅から徒歩20分</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground mb-1">バス</p>
                                        <p>2系統/18系統/102系統 神戸高校前 停留所より徒歩5分</p>
                                    </div>
                                </div>
                            </div>
                        </ParallaxContainer>
                    </div>

                    {/* Map Placeholder */}
                    <ParallaxContainer offset={scrollY * 0.25}>
                        <div
                            className="border border-accent-light bg-foreground/5 h-96 mb-24 flex items-center justify-center">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3279.571471808744!2d135.2131975!3d34.715987!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60008ebadd1ef657%3A0xe100dc45fc6cdf21!2sHyogo%20Prefectural%20Kobe%20High%20School!5e0!3m2!1sen!2sjp!4v1763188485885!5m2!1sen!2sjp" className="w-full h-full" loading="lazy"></iframe>
                        </div>
                    </ParallaxContainer>

                    {/* Additional Information */}
                    <ParallaxContainer offset={scrollY * 0.2}>
                        <div className="border-l-4 border-primary pl-8 mb-24">
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
            </main>

            <Footer/>
        </div>
    )
}
