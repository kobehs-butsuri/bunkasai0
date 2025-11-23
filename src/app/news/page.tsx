"use client"

import { useEffect, useState } from "react"
import ParallaxContainer from "@/components/parallax-container"

export default function News() {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="pt-28">
            <div className="max-w-7xl mx-auto">
                {/* Title Section */}
                <ParallaxContainer offset={scrollY * 0.3}>
                    <div className="mb-16">
                        <h1
                            className="text-6xl font-bold tracking-wider text-foreground mb-6"
                            style={{ letterSpacing: "0.05em" }}
                        >
                            ページ１
                        </h1>
                        <div className="w-24 h-1 bg-primary"></div>
                    </div>
                </ParallaxContainer>

                {/* Content Grid */}
                <div className="grid grid-cols-2 gap-12 mb-24">
                    <ParallaxContainer offset={scrollY * 0.4}>
                        <div className="border-l-4 border-primary pl-8">
                            <h2 className="text-3xl font-bold text-foreground mb-4">セクション1</h2>
                            <p className="text-foreground/80 leading-relaxed mb-4">
                                このページはサンプルコンテンツです。文化祭のイベント情報や、 実際の内容に置き換えてください。
                            </p>
                            <p className="text-foreground/80 leading-relaxed">
                                テキストテキスト
                            </p>
                        </div>
                    </ParallaxContainer>

                    <ParallaxContainer offset={scrollY * 0.35}>
                        <div className="bg-primary/10 p-8">
                            <h3 className="text-2xl font-bold text-foreground mb-4">ハイライト</h3>
                            <ul className="space-y-3 text-foreground/80">
                                <li>✓ サンプル項目1</li>
                                <li>✓ サンプル項目2</li>
                                <li>✓ サンプル項目3</li>
                                <li>✓ サンプル項目4</li>
                            </ul>
                        </div>
                    </ParallaxContainer>
                </div>

                {/* Info Section */}
                <ParallaxContainer offset={scrollY * 0.25}>
                    <div className="border border-accent-light p-8 mb-24">
                        <h2 className="text-2xl font-bold text-foreground mb-4">詳細情報</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            このエリアに詳細な説明やコンテンツを配置できます。
                            上質なデザインを保ちながら、必要な情報を整理して表示してください。
                        </p>
                    </div>
                </ParallaxContainer>
            </div>
        </div>
    )
}
