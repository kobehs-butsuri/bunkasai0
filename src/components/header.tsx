"use client"

import Link from "next/link";

export default function Header() {
    return (
        <header className="sticky top-0 w-full bg-background border-b border-accent-light z-50 backdrop-blur-sm bg-opacity-95 h-20">
            <div className="relative max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
                <div className="text-2xl font-bold tracking-wider text-foreground" style={{ letterSpacing: "0.1em" }}>
                    <Link href="/">
                        ロゴ
                    </Link>
                </div>

                <nav className="hidden md:flex gap-8">
                    <Link href="/map" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                        マップ
                    </Link>
                    <Link href="/timetable" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                        タイムテーブル
                    </Link>
                    <Link href="/event" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                        イベント
                    </Link>
                    <Link href="/access" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                        アクセス
                    </Link>
                    <Link href="/news" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                        ニュース
                    </Link>
                </nav>
            </div>
        </header>
    )
}
