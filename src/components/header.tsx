"use client"

import Link from "next/link";

export default function Header() {
    return (
        <header className="fixed top-0 w-full bg-background border-b border-accent-light z-50 backdrop-blur-sm bg-opacity-95">
            <svg className="absolute inset-0 w-full h-full opacity-5" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                    <filter id="noise">
                        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="2" />
                        <feColorMatrix type="saturate" values="0.3" />
                    </filter>
                </defs>
                <rect width="100" height="100" fill="#000" filter="url(#noise)" />
            </svg>

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
