"use client"

import {Logo} from "@/components/logo";

interface HeroProps {
    scrollY: number
}

export default function Hero({ scrollY }: HeroProps) {
    return (
        <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
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
                    第130回創立記念祭
                </p>
            </div>
        </section>
    )
}
