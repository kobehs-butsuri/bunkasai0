"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface QAItem {
    id: string
    question: string
    answer: string
}

interface Category {
    id: string
    title: string
    items: QAItem[]
}

interface QAData {
    categories: Category[]
}

interface QAPageProps {
    data: QAData
}

export function Content({ data }: QAPageProps) {
    const [mobileActiveId, setMobileActiveId] = useState<string | null>(null)
    const [desktopActiveId, setDesktopActiveId] = useState<string | null>(null)
    const answerRefs = useRef<Record<string, HTMLDivElement | null>>({})

    const handleMobileClick = (id: string) => {
        setMobileActiveId(mobileActiveId === id ? null : id)
    }

    const handleDesktopClick = (id: string) => {
        setDesktopActiveId(id)
        const element = answerRefs.current[id]
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }

    return (
        <div className="w-full">
            {/* Mobile View - hidden on lg and up */}
            <div className="lg:hidden">
                <MobileView
                    data={data}
                    activeId={mobileActiveId}
                    onQuestionClick={handleMobileClick}
                />
            </div>

            {/* Desktop View - hidden below lg */}
            <div className="hidden lg:block">
                <DesktopView
                    data={data}
                    activeId={desktopActiveId}
                    onQuestionClick={handleDesktopClick}
                    answerRefs={answerRefs}
                />
            </div>
        </div>
    )
}

function MobileView({
                        data,
                        activeId,
                        onQuestionClick,
                    }: {
    data: QAData
    activeId: string | null
    onQuestionClick: (id: string) => void
}) {
    return (
        <div className="w-full">
            <main className="px-6 py-8">
                {data.categories.map((category, categoryIndex) => (
                    <motion.section
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
                        className="mb-10"
                    >
                        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
                            {category.title}
                        </h2>

                        <div className="border-t border-border">
                            {category.items.map((item) => (
                                <div key={item.id} className="border-b border-border">
                                    <button
                                        onClick={() => onQuestionClick(item.id)}
                                        className="w-full py-5 flex items-start justify-between gap-4 text-left transition-colors hover:bg-muted/30"
                                    >
                    <span className="text-sm text-foreground leading-relaxed">
                      {item.question}
                    </span>
                                        <motion.span
                                            animate={{ rotate: activeId === item.id ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="shrink-0 mt-0.5"
                                        >
                                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                        </motion.span>
                                    </button>

                                    <AnimatePresence>
                                        {activeId === item.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pb-5 pr-8">
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {item.answer}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                ))}
            </main>
        </div>
    )
}

function DesktopView({
                         data,
                         activeId,
                         onQuestionClick,
                         answerRefs,
                     }: {
    data: QAData
    activeId: string | null
    onQuestionClick: (id: string) => void
    answerRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
}) {
    return (
        <div className="w-full">
            <div className="max-w-7xl mx-auto">
                <div className="flex">
                    {/* Left sidebar - Questions */}
                    <aside className="w-100 shrink-0 border-r border-border">
                        <div className="sticky top-32 md:top-20 h-[calc(100dvh-8rem)] md:h-[calc(100dvh-5rem)] overflow-y-auto py-8 px-8">
                            {data.categories.map((category, categoryIndex) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
                                    className="mb-8"
                                >
                                    <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
                                        {category.title}
                                    </h2>

                                    <ul className="space-y-1">
                                        {category.items.map((item) => (
                                            <li key={item.id}>
                                                <button
                                                    onClick={() => onQuestionClick(item.id)}
                                                    className={`
                            w-full text-left py-3 px-4 text-sm transition-all duration-200
                            border-l-2
                            ${
                                                        activeId === item.id
                                                            ? "border-l-foreground bg-muted/50 text-foreground"
                                                            : "border-l-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                                    }
                          `}
                                                >
                                                    {item.question}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </aside>

                    {/* Right content - Answers */}
                    <main className="flex-1 py-8 px-12 overflow-y-auto">
                        {data.categories.map((category, categoryIndex) => (
                            <motion.section
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: categoryIndex * 0.15 }}
                                className="mb-16"
                            >
                                <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-8 pb-4 border-b border-border">
                                    {category.title}
                                </h2>

                                <div className="space-y-12">
                                    {category.items.map((item) => (
                                        <div
                                            key={item.id}
                                            ref={(el) => {
                                                answerRefs.current[item.id] = el
                                            }}
                                            className="scroll-mt-40 md:scroll-mt-28"
                                        >
                                            <motion.div
                                                animate={{
                                                    opacity: activeId === item.id || activeId === null ? 1 : 0.4,
                                                }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <h3 className="text-base font-medium text-foreground mb-3">
                                                    {item.question}
                                                </h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                                                    {item.answer}
                                                </p>
                                            </motion.div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        ))}
                    </main>
                </div>
            </div>
        </div>
    )
}
