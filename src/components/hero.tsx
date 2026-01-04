"use client"

import {Logo} from "@/components/logo";
import Link from "next/link";

interface HeroProps {
    scrollY: number
}

export default function Hero({ scrollY }: HeroProps) {
    return (
        <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
            {/* Parallax layer - back */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    transform: `translateY(${scrollY * 0.3}px)`,
                    opacity: 0.3,
                }}
            >
                <div
                    className="absolute top-20 left-10 w-96 h-96 bg-accent-light"
                    style={{ clipPath: "polygon(0% 0%, 100% 0%, 80% 100%, 0% 100%)" }}
                />
                <div
                    className="absolute bottom-20 right-10 w-72 h-72 bg-primary opacity-5"
                    style={{ clipPath: "polygon(0% 20%, 100% 0%, 100% 100%, 0% 80%)" }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-4xl mx-auto px-8">
                <h1
                    className="text-6xl md:text-8xl font-bold text-foreground mb-6 tracking-tighter justify-center"
                    style={{ letterSpacing: "-0.02em" }}
                >
                  <span
                      style={{
                          transform: `translateY(${scrollY * -0.05}px)`,
                          display: "block",
                      }}
                  >
                    <Logo className="w-full h-full" />
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-accent-dark leading-relaxed mb-12 max-w-2xl mx-auto">
                    創立記念祭
                </p>

                <Link href="/event">
                    <button
                        className="relative px-12 py-4 bg-primary text-background font-medium uppercase tracking-wider hover:scale-105 transition-transform"
                        style={{
                            clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
                        }}
                    >
                        プログラムを見る
                    </button>
                </Link>
            </div>

            {/* Parallax layer - front */}
            <div
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                    transform: `translateY(${scrollY * 0.2}px)`,
                }}
            >
                <div
                    className="absolute top-1/4 right-20 w-64 h-64 border-4 border-primary opacity-10"
                    style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" }}
                />
            </div>
        </section>
    )
}
