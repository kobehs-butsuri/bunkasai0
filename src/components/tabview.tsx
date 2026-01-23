"use client"

import { useState, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface Tab {
    id: string
    label: string
    subtitle?: string
    content: ReactNode
}

interface TabViewProps {
    tabs: Tab[]
    defaultTabIndex?: number
    className?: string
    contentClassName?: string
    onTabChange?: (index: number) => void
}

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 500 : -500,
        opacity: 0.5,
        transition: {
            duration: 0.15,
            ease: [0, 0, 0.2, 1] as const
        }
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.15,
            ease: [0, 0, 0.2, 1] as const
        }
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 500 : -500,
        opacity: 0.5,
        transition: {
            duration: 0.15,
            ease: [0.4, 0, 1, 1] as const
        }
    })
}

export function TabView({
                            tabs,
                            defaultTabIndex = 0,
                            className = "",
                            contentClassName = "",
                            onTabChange
                        }: TabViewProps) {
    const [selectedTab, setSelectedTab] = useState(defaultTabIndex)
    const [direction, setDirection] = useState(0)

    const handleTabChange = (index: number) => {
        setDirection(index > selectedTab ? 1 : -1)
        setSelectedTab(index)
        onTabChange?.(index)
    }

    return (
        <div className={className}>
            <div className="overflow-x-auto scrollbar-hide mb-0">
                <div className="inline-flex gap-3 px-4 min-w-full justify-center">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(index)}
                            className={`relative px-8 py-3 font-bold transition-all border-t border-l border-r border-accent-light rounded-t-2xl whitespace-nowrap flex-shrink-0 ${
                                selectedTab === index
                                    ? "bg-primary text-background"
                                    : "bg-background text-foreground hover:bg-accent-light"
                            }`}
                        >
                            <div className="absolute bottom-0 left-0 w-3 h-3 overflow-hidden pointer-events-none transition-all" style={{ transform: 'translateX(-100%)' }}>
                                <svg viewBox="0 0 12 12" className="w-3 h-3">
                                    <path
                                        d="M 12 0 Q 12 12 0 12 L 12 12 Z"
                                        className={`transition-all ${selectedTab === index ? "fill-primary" : "fill-background"}`}
                                    />
                                </svg>
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 overflow-hidden pointer-events-none transition-all" style={{ transform: 'translateX(100%)' }}>
                                <svg viewBox="0 0 12 12" className="w-3 h-3">
                                    <path
                                        d="M 0 0 Q 0 12 12 12 L 0 12 Z"
                                        className={`transition-all ${selectedTab === index ? "fill-primary" : "fill-background"}`}
                                    />
                                </svg>
                            </div>
                            {tab.label}
                            {tab.subtitle && (
                                <>
                                    <br />
                                    <span className="text-sm">{tab.subtitle}</span>
                                </>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`bg-card border border-accent-light overflow-hidden border-t-4 border-t-primary ${contentClassName}`}>
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={selectedTab}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                    >
                        {tabs[selectedTab].content}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}