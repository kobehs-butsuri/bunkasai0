"use client"

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (isMenuOpen) {
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.documentElement.style.overflow = '';
        }

        return () => {
            document.documentElement.style.overflow = '';
        };
    }, [isMenuOpen]);

    const navItems = [
        { href: "/map", label: "マップ" },
        { href: "/timetable", label: "タイムテーブル" },
        { href: "/event", label: "イベント" },
        { href: "/access", label: "アクセス" },
        { href: "/news", label: "ニュース" },
    ];

    return (
        <>
            <header className="sticky top-0 w-full bg-background border-b border-accent-light z-40 backdrop-blur-sm bg-opacity-95 h-20">
                <div className="relative max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
                    <div className="text-2xl font-bold tracking-wider text-foreground" style={{ letterSpacing: "0.1em" }}>
                        <Link href="/">
                            ロゴ
                        </Link>
                    </div>

                    <nav className="hidden md:flex gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 z-50 relative"
                        aria-label="メニューを開く"
                        aria-expanded={isMenuOpen}
                    >
                        <span
                            className={`h-0.5 w-6 bg-foreground transition-all duration-300 origin-center ${
                                isMenuOpen ? 'rotate-45 translate-y-2' : ''
                            }`}
                        />
                        <span
                            className={`h-0.5 w-6 bg-foreground transition-all duration-300 ${
                                isMenuOpen ? 'opacity-0 scale-0' : ''
                            }`}
                        />
                        <span
                            className={`h-0.5 w-6 bg-foreground transition-all duration-300 origin-center ${
                                isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                            }`}
                        />
                    </button>
                </div>
            </header>

            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                        animation: 'fadeIn 0.3s ease-out'
                    }}
                />
            )}

            <div
                className={`fixed top-20 right-0 w-64 max-w-xs bg-background border-l border-accent-light shadow-2xl z-40 md:hidden transition-all duration-300 ease-out ${
                    isMenuOpen
                        ? 'translate-x-0 opacity-100'
                        : 'translate-x-full opacity-0 pointer-events-none'
                }`}
                style={{
                    minHeight: 'calc(100vh - 80px)',
                    transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
                }}
            >
                <nav className="flex flex-col py-8 px-6 gap-2">
                    {navItems.map((item, index) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-base font-medium text-foreground hover:text-primary hover:bg-accent-light/50 px-4 py-3 rounded-lg transition-all duration-200"
                            style={{
                                animation: isMenuOpen
                                    ? `slideInUp 0.4s ease-out ${index * 0.08}s both`
                                    : 'none'
                            }}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </>
    )
}
