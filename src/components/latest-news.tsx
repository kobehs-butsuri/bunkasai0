"use client"

import Link from "next/link"
import { useMemo } from "react"
import newsData from "@/data/news.json"

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

export default function LatestNews() {
    const latestNews = useMemo(
        () =>
            (newsData.news as News[])
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((item, index) => ({
                    ...item,
                    id: `news-${String(index + 1).padStart(3, "0")}`,
                    formattedDate: formatDate(item.date),
                }))
                .reverse()
                .slice(0, 3),
        [],
    )

    return (
        <section className="py-20 px-8 max-w-7xl mx-auto">
            <div className="mb-12">
                <h2 className="text-4xl font-bold mb-4 tracking-tight text-balance">ニュース</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {latestNews.map((item) => (
                    <Link key={item.id} href={`/news#${item.id}`}>
                        <article
                            className="bg-card border border-accent-light p-6 hover:border-primary transition-all hover:shadow-lg"
                        >
                            <div className="mb-4">
                                <p className="text-xs font-bold opacity-75 mb-2">{item.formattedDate}</p>
                                <h3 className="text-lg font-bold mb-3 line-clamp-2 text-balance">{item.title}</h3>
                                <span className="text-xs inline-block text-background bg-accent-dark px-2 py-1">{item.category}</span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{item.content.replace(/<[^>]*>/g, "")}</p>
                            <span className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                                詳細を見る →
                            </span>
                        </article>
                    </Link>
                ))}
            </div>

            <div className="text-center">
                <Link
                    href="/news"
                    className="inline-block bg-primary text-primary-foreground px-8 py-3 font-bold hover:opacity-90 transition-opacity"
                >
                    すべてのニュースを見る
                </Link>
            </div>
        </section>
    )
}