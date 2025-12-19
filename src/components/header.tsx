"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { usePageTitle } from "@/hooks/page-title-context"
import useMobile from "@/hooks/use-mobile"
import Logo from "@/components/logo";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const pathname = usePathname()
    const { title: pageTitle } = usePageTitle()
    const isMobile = useMobile()

    useEffect(() => {
        if (isMenuOpen) {
            document.documentElement.style.overflow = 'hidden'
        } else {
            document.documentElement.style.overflow = ''
        }

        return () => {
            document.documentElement.style.overflow = ''
        }
    }, [isMenuOpen])

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navItems = [
        { href: "/map", label: "マップ" },
        { href: "/timetable", label: "タイムテーブル" },
        { href: "/event", label: "イベント" },
        { href: "/access", label: "アクセス" },
        { href: "/news", label: "ニュース" },
    ]

    const shouldShowTitle = isMobile && isScrolled && pageTitle

    return (
        <>
            <header className="fixed top-0 w-full bg-background border-b border-accent-light z-40 backdrop-blur-sm bg-opacity-95 h-20 select-none overflow-hidden">
                <div className="relative max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">

                    <Link href="/">
                        <div className="flex items-center gap-4 h-8 relative">
                            <div className={`text-2xl font-bold tracking-wider text-foreground transition-all duration-300 ${
                                shouldShowTitle
                                    ? 'opacity-0 -translate-y-4 absolute'
                                    : 'opacity-100 translate-y-0 relative'
                            }`}>
                                <Logo size={20} />
                            </div>

                            {shouldShowTitle && (
                                <div className="text-2xl font-bold tracking-wider text-foreground transition-all duration-300 opacity-100 translate-y-0 animate-fadeInUp whitespace-nowrap">
                                    {pageTitle}
                                </div>
                            )}

                            {!isMobile && pageTitle && (
                                <div className="text-lg font-semibold text-foreground/80 border-l-2 border-foreground/80 pl-4">
                                    {pageTitle}
                                </div>
                            )}
                        </div>
                    </Link>

                    <nav className="hidden md:flex gap-8 items-center">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition-colors ${
                                    pathname === item.href
                                        ? 'text-primary font-bold'
                                        : 'text-foreground hover:text-primary'
                                }`}
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
                            className={`text-base font-medium px-4 py-3 rounded-lg transition-all duration-200 ${
                                pathname === item.href
                                    ? 'text-primary bg-accent-light/70'
                                    : 'text-foreground hover:text-primary hover:bg-accent-light/50'
                            }`}
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

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.3s ease-out;
                }
            `}</style>
        </>
    )
}