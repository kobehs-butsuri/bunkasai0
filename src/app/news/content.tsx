"use client"

import {useState, useMemo, useEffect} from "react"
import newsData from "@/data/news.json"
import { X } from 'lucide-react';
import {useSetPageTitle} from "@/hooks/page-title-context";
import useMobile from "@/hooks/use-mobile";

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
                } else if (!isMobile) {
                    const latestId = newsWithId[0]?.id || null
                    setSelectedId(latestId)
                    if (latestId) {
                        window.history.replaceState(null, '', `#${latestId}`)
                    }
                }
            } else if (!isMobile) {
                const latestId = newsWithId[0]?.id || null
                setSelectedId(latestId)
                if (latestId) {
                    window.history.replaceState(null, '', `#${latestId}`)
                }
            }
        }

        handleHashChange()
        window.addEventListener('hashchange', handleHashChange)
        return () => window.removeEventListener('hashchange', handleHashChange)
    }, [newsWithId, isMobile])

    const handleSelectNews = (id: string) => {
        setSelectedId(id)
    }

    useEffect(() => {
        if (selectedId && !isMobile) {
            window.history.replaceState(null, '', `#${selectedId}`)
        }
    }, [selectedId, isMobile])

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

    return (
        <>
            <div className="max-w-7xl mx-auto">
                {/* Desktop: Two Column Layout */}
                <div className="hidden md:grid md:grid-cols-3 md:gap-8">
                    {/* Left: News List */}
                    <div className="md:col-span-1 space-y-0 overflow-y-auto">
                        {newsWithId.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleSelectNews(item.id)}
                                className={`w-full text-left p-4 border transition-all ${
                                    selectedId === item.id
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-card border-accent-light hover:border-primary"
                                }`}
                            >
                                <div className="flex flex-col gap-2">
                                    <p className="text-xs font-bold opacity-75">{item.formattedDate}</p>
                                    <h3 className="font-bold line-clamp-2">{item.title}</h3>
                                    <span className="text-xs text-background inline-block bg-accent-dark px-2 py-1 w-fit">{item.category}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Right: News Detail */}
                    <div className="md:col-span-2">
                        {selectedNews && (
                            <article className="bg-card border border-accent-light p-8">
                                <div className="mb-6 pb-6 border-b border-accent-light">
                                    <h1 className="text-3xl font-bold mb-4 text-balance">{selectedNews.title}</h1>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-muted-foreground">{selectedNews.formattedDate}</span>
                                        <span className="inline-block text-background bg-accent-dark px-3 py-1 text-xs font-bold">
                                          {selectedNews.category}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className="prose prose-sm text-foreground leading-relaxed max-w-none"
                                    dangerouslySetInnerHTML={{ __html: selectedNews.content }}></div>
                            </article>
                        )}
                    </div>
                </div>

                {/* Mobile: List with Drawer */}
                <div className="md:hidden space-y-0">
                    {newsWithId.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                handleSelectNews(item.id)
                                setIsDrawerOpen(true)
                            }}
                            className="w-full text-left p-4 bg-card border border-accent-light hover:border-primary transition-all"
                        >
                            <div className="flex flex-col gap-2">
                                <p className="text-xs font-bold opacity-75">{item.formattedDate}</p>
                                <h3 className="font-bold line-clamp-2">{item.title}</h3>
                                <span className="text-xs text-background inline-block bg-accent-dark px-2 py-1 w-fit">{item.category}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile Drawer */}
            {isMobile && selectedNews && (
                <>
                    <div
                        className={`fixed inset-0 bg-black/50 z-40 transition-all duration-300 ease-out ${
                            isDrawerOpen
                                ? 'opacity-100'
                                : 'opacity-0 pointer-events-none'}`}
                        onClick={() => setIsDrawerOpen(false)}
                    />

                    <div className={`fixed bottom-0 left-0 right-0 bg-background border-t border-accent-light p-6 z-50 max-h-[80vh] w-full overflow-y-auto
                     transition-all duration-300 ease-out rounded-tl-2xl rounded-tr-2xl ${
                        isDrawerOpen
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-full opacity-0 pointer-events-none'}`}
                         style={{
                             transform: isDrawerOpen ? 'translateY(0)' : 'translateY(100%)',
                         }}>
                        <button
                            onClick={() => setIsDrawerOpen(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-2xl"
                        >
                            <X/>
                        </button>
                        <article className="pt-4">
                            <h2 className="text-2xl font-bold mb-4 text-balance">{selectedNews.title}</h2>
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-accent-light">
                                <span className="text-sm text-muted-foreground">{selectedNews.formattedDate}</span>
                                <span className="inline-block bg-primary text-primary-foreground px-3 py-1 text-xs font-bold">
                          {selectedNews.category}
                        </span>
                            </div>
                            <div
                                className="prose prose-sm text-foreground leading-relaxed max-w-svw wrap-break-word"
                                dangerouslySetInnerHTML={{ __html: selectedNews.content }}
                            ></div>
                        </article>
                    </div>
                </>
            )}
        </>
    )
}