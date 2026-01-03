"use client"

import {useState, useMemo, useEffect} from "react"
import newsData from "@/data/news.json"
import { X } from 'lucide-react';
import {useSetPageTitle} from "@/hooks/page-title-context";
import useMobile from "@/hooks/use-mobile";
import { motion, AnimatePresence, PanInfo } from "framer-motion"

interface News {
    title: string
    date: string
    category: string
    content: string
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

export default function NewsPage() {
    useSetPageTitle("ニュース")

    const newsWithId = useMemo(
        () =>
            (newsData.news as News[])
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((item, index) => ({
                    ...item,
                    id: `news-${String(index + 1).padStart(3, "0")}`,
                    formattedDate: formatDate(item.date),
                }))
                .reverse(),
        [],
    )

    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const isMobile = useMobile()

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1)

            if (hash) {
                const validNews = newsWithId.find(item => item.id === hash)
                if (validNews) {
                    setSelectedId(hash)
                    if (isMobile) {
                        setIsDrawerOpen(true)
                    }
                }
            }
        }

        handleHashChange()
        window.addEventListener('hashchange', handleHashChange)
        return () => window.removeEventListener('hashchange', handleHashChange)
    }, [newsWithId, isMobile])

    const handleSelectNews = (id: string) => {
        setSelectedId(id)
        if (!isMobile) {
            window.history.replaceState(null, '', `#${id}`)
        }
    }

    useEffect(() => {
        if (isMobile && isDrawerOpen && selectedId) {
            window.history.replaceState(null, '', `#${selectedId}`)
        } else if (isMobile && !isDrawerOpen) {
            window.history.replaceState(null, '', window.location.pathname)
        }
    }, [isDrawerOpen, selectedId, isMobile])

    const selectedNews = newsWithId.find((item) => item.id === selectedId)

    useEffect(() => {
        if (isDrawerOpen) {
            document.documentElement.style.overflow = 'hidden'
        } else {
            document.documentElement.style.overflow = ''
        }

        return () => {
            document.documentElement.style.overflow = ''
        }
    }, [isDrawerOpen])

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.y > 100) {
            setIsDrawerOpen(false)
        }
    }

    return (
        <>
            <div className="w-full">
                <div className="max-w-7xl mx-auto">
                    {/* Desktop: Two Column Layout */}
                    <div className="hidden md:flex md:gap-1">
                        {/* Left: News List */}
                        <motion.div
                            className="md:w-96 shrink-0 bg-card"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-hidden">
                                <div className="space-y-0">
                                    {newsWithId.map((item, index) => (
                                        <motion.button
                                            key={item.id}
                                            onClick={() => handleSelectNews(item.id)}
                                            className={`w-full text-left p-6 transition-colors relative ${
                                                selectedId === item.id
                                                    ? "bg-primary border-primary text-primary-foreground"
                                                    : "bg-card border-b border-accent-light hover:bg-accent-light"
                                            }`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            {selectedId === item.id && (
                                                <motion.div
                                                    layoutId="activeIndicator"
                                                    className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-foreground"
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                            <div className="flex flex-col gap-2">
                                                <p className="text-xs font-bold opacity-75">{item.formattedDate}</p>
                                                <h3 className="font-bold line-clamp-2">{item.title}</h3>
                                                <span className="text-xs text-background inline-block bg-accent-dark px-2 py-1 w-fit rounded">
                                                    {item.category}
                                                </span>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Right: News Detail */}
                        <div className="flex-1 min-w-0">
                            <AnimatePresence mode="wait">
                                {selectedNews ? (
                                    <motion.article
                                        key={selectedNews.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-card border border-accent-light p-8 md:p-12 h-full"
                                    >
                                        <motion.div
                                            className="mb-8 pb-6 border-b border-accent-light"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <h1 className="text-4xl font-bold mb-4 text-balance leading-tight">
                                                {selectedNews.title}
                                            </h1>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-muted-foreground">
                                                    {selectedNews.formattedDate}
                                                </span>
                                                <span className="inline-block text-background bg-accent-dark px-3 py-1 text-xs font-bold rounded">
                                                    {selectedNews.category}
                                                </span>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="prose prose-sm lg:prose-base text-foreground leading-relaxed max-w-none"
                                            dangerouslySetInnerHTML={{ __html: selectedNews.content }}
                                        />
                                    </motion.article>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-card border border-accent-light p-8 md:p-12 flex items-center justify-center min-h-[400px]"
                                    >
                                        <div className="text-center">
                                            <h2 className="text-2xl font-bold text-muted-foreground mb-2">
                                                ニュースを選択してください
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                左側のリストからニュースを選んで詳細を表示
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Mobile: List with Drawer */}
                    <div className="md:hidden space-y-0">
                        {newsWithId.map((item, index) => (
                            <motion.button
                                key={item.id}
                                onClick={() => {
                                    handleSelectNews(item.id)
                                    setIsDrawerOpen(true)
                                }}
                                className="w-full text-left p-6 bg-card border-b border-accent-light hover:bg-accent-light transition-colors"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex flex-col gap-2">
                                    <p className="text-xs font-bold opacity-75">{item.formattedDate}</p>
                                    <h3 className="font-bold line-clamp-2">{item.title}</h3>
                                    <span className="text-xs text-background inline-block bg-accent-dark px-2 py-1 w-fit rounded">
                                        {item.category}
                                    </span>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobile && selectedNews && isDrawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/50 z-40"
                            onClick={() => setIsDrawerOpen(false)}
                        />

                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            drag="y"
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={{ top: 0, bottom: 0.5 }}
                            onDragEnd={handleDragEnd}
                            className="fixed bottom-0 left-0 right-0 bg-background border-t border-accent-light z-70 max-h-[85vh] w-full overflow-y-auto rounded-t-3xl shadow-2xl"
                        >
                            <div className="sticky top-0 bg-background border-b border-accent-light px-6 py-4 flex items-center justify-center z-10 cursor-grab active:cursor-grabbing">
                                <div className="w-12 h-1 bg-accent-light rounded-full" />
                                <motion.button
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="absolute right-4 text-muted-foreground hover:text-foreground"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X className="w-6 h-6" />
                                </motion.button>
                            </div>

                            <motion.article
                                className="p-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h2 className="text-2xl font-bold mb-4 text-balance leading-tight">
                                    {selectedNews.title}
                                </h2>
                                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-accent-light">
                                    <span className="text-sm text-muted-foreground">
                                        {selectedNews.formattedDate}
                                    </span>
                                    <span className="inline-block bg-accent-dark text-background px-3 py-1 text-xs font-bold rounded">
                                        {selectedNews.category}
                                    </span>
                                </div>
                                <div
                                    className="prose prose-sm text-foreground leading-relaxed max-w-full wrap-break-word"
                                    dangerouslySetInnerHTML={{ __html: selectedNews.content }}
                                />
                            </motion.article>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}