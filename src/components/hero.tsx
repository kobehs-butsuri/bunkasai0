"use client"

import {AnimatedLogo, Logo} from "@/components/logo";
import BlueDeco from "@/components/decoration/blue.svg"
import RedDeco from "@/components/decoration/red.svg"
import Title from "@/components/logos/title.svg"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

interface HeroProps {
    scrollY: number
}

const INTRO_DURATION = 5.0
const INTRO_FADE_OUT = 0.6
const ANIMATION_DURATION = 0.5
const BLUE_DELAY = 0.1

export default function Hero({ scrollY }: HeroProps) {
    const [showIntro, setShowIntro] = useState<boolean | null>(null)

    useEffect(() => {
        const hasSeenIntro = sessionStorage.getItem('hasSeenIntro')

        const isExternalReferrer = () => {
            if (!document.referrer) return true

            try {
                const referrerUrl = new URL(document.referrer)
                const currentUrl = new URL(window.location.href)
                return referrerUrl.hostname !== currentUrl.hostname
            } catch {
                return true
            }
        }

        const shouldShowIntro = !hasSeenIntro && isExternalReferrer()
        setShowIntro(shouldShowIntro)

        if (!shouldShowIntro) return

        sessionStorage.setItem('hasSeenIntro', 'true')

        const timer = setTimeout(() => {
            setShowIntro(false)
        }, INTRO_DURATION * 1000)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (showIntro) {
            document.documentElement.style.overflow = 'hidden'
        } else {
            document.documentElement.style.overflow = ''
        }

        return () => {
            document.documentElement.style.overflow = ''
        }
    }, [showIntro])

    return (
        <section
            className="relative w-full h-[calc(100vh-4rem-4rem)] md:h-[calc(100vh-5rem)] flex flex-col items-center justify-center overflow-hidden"
            style={{
                backgroundColor: showIntro === null || showIntro ? '#e94709' : undefined,
                backgroundImage: showIntro === null || showIntro ? undefined : "linear-gradient(45deg, #fdf1db 25%, transparent 25%, transparent 75%, #fdf1db 75%), linear-gradient(45deg, #fdf1db 25%, transparent 25%, transparent 75%, #fdf1db 75%)",
                backgroundPosition: "0 0, 60px 60px",
                backgroundSize: "120px 120px",
                backgroundAttachment: "fixed"
            }}>
            {showIntro !== null && (
                <>
                    <AnimatePresence>
                        {showIntro && (
                            <motion.div
                                className="absolute inset-0 z-50 flex items-center justify-center bg-[#e94709] px-8 py-16"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: INTRO_FADE_OUT }}
                            >
                                <div className="max-w-150 max-h-200 w-full h-full flex items-center justify-center">
                                    <AnimatedLogo className="w-full h-full object-contain" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative z-10 flex items-center justify-center w-full h-full px-8 py-16">
                        <div className="absolute w-full h-full overflow-hidden">
                            <motion.div
                                className="absolute w-full max-w-200 top-0 left-0"
                                initial={{ y: "-100%" }}
                                animate={{ y: showIntro ? "-100%" : 0 }}
                                transition={{
                                    duration: ANIMATION_DURATION,
                                    ease: "easeOut"
                                }}
                            >
                                <RedDeco style={{ transform: "rotate(180deg)" }} />
                            </motion.div>

                            <motion.div
                                className="absolute w-[70vw] max-w-140 top-0 left-0"
                                initial={{ y: "-100%" }}
                                animate={{ y: showIntro ? "-100%" : 0 }}
                                transition={{
                                    duration: ANIMATION_DURATION,
                                    delay: BLUE_DELAY,
                                    ease: "easeOut"
                                }}
                            >
                                <BlueDeco style={{ transform: "rotate(180deg)" }}/>
                            </motion.div>

                            <motion.div
                                className="absolute w-full max-w-200 bottom-0 right-0"
                                initial={{ y: "100%" }}
                                animate={{ y: showIntro ? "100%" : 0 }}
                                transition={{
                                    duration: ANIMATION_DURATION,
                                    ease: "easeOut"
                                }}
                            >
                                <RedDeco/>
                            </motion.div>

                            <motion.div
                                className="absolute w-[70vw] max-w-140 bottom-0 right-0"
                                initial={{ y: "100%" }}
                                animate={{ y: showIntro ? "100%" : 0 }}
                                transition={{
                                    duration: ANIMATION_DURATION,
                                    delay: BLUE_DELAY,
                                    ease: "easeOut"
                                }}
                            >
                                <BlueDeco/>
                            </motion.div>
                        </div>
                        <span
                            className="max-w-150 max-h-200 w-full h-full flex items-center justify-center"
                            style={{
                                transform: `translateY(${scrollY * -0.05}px)`
                            }}
                        >
                            <Logo className="w-full h-full object-contain" />
                        </span>
                        <span className="absolute top-4 left-8 font-bold text-background">
                            <span style={{ fontSize: 'clamp(2rem, 8vw, 4rem)' }}>5 / 3</span> <span className={"text-xl"}>Sun.</span><br/>
                            <span className={"text-12"}>一般祭</span>
                        </span>
                        <span className="select-none absolute bottom-4 left-8 font-bold mb-24 text-secondary min-w-60 w-[40vw] max-w-90 border-l-4 border-secondary pl-4">
                            <span className={"text-xl"}>兵庫県立神戸高等学校</span><br/>
                            <span style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>第130回</span>
                            <Title/>
                        </span>
                    </div>
                </>
            )}
        </section>
    )
}