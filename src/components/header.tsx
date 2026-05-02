"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { usePageTitle } from "@/hooks/page-title-context"
import useMobile from "@/hooks/use-mobile"
import { Emblem} from "@/components/logo";
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronLeft } from "lucide-react"

interface SubMenuItem {
    href: string
    label: string
    labelJa: string
}

interface NavItem {
    href: string
    label: string
    labelJa: string
    subItems?: SubMenuItem[]
}

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)
    const pathname = usePathname()
    const { title: pageTitle } = usePageTitle()
    const isMobile = useMobile()

    useEffect(() => {
        if (isMenuOpen) {
            document.documentElement.style.overflow = 'hidden'
        } else {
            document.documentElement.style.overflow = ''
            setOpenSubmenu(null)
            setIsSubmenuOpen(false)
        }

        return () => {
            document.documentElement.style.overflow = ''
        }
    }, [isMenuOpen])

    const navItems: NavItem[] = [
        { href: "/", label: "Home", labelJa: "ホーム" },
        { href: "/map", label: "Map", labelJa: "マップ" },
        { href: "/schedule", label: "Schedule", labelJa: "スケジュール" },
        { href: "/event", label: "Events", labelJa: "イベント", subItems: [
                { href: "/event", label: "Events List", labelJa: "イベント一覧", },
                { href: "/pickup", label: "Pick Up", labelJa: "ピックアップ", },
            ]
        },
        { href: "/access", label: "Access", labelJa: "アクセス" },
        { href: "/quiz", label: "Quiz", labelJa: "謎解き" },
        { href: "#", label: "Others", labelJa: "その他", subItems: [
                { href: "/news", label: "News", labelJa: "ニュース", },
                { href: "/introduce", label: "Theme & Logo & Emblem", labelJa: "テーマ・ロゴ・エンブレム", },
                { href: "/greeting", label: "Greeting", labelJa: "ご挨拶", },
                { href: "/faq", label: "Frequently Asked Question", labelJa: "よくあるご質問", },
                { href: "/contact", label: "Contact", labelJa: "お問い合わせ", },
            ]
        },
    ]

    const toggleSubmenu = (itemHref: string) => {
        setOpenSubmenu(itemHref)
        setIsSubmenuOpen(true)
    }

    const closeSubmenu = () => {
        setIsSubmenuOpen(false)
        setTimeout(() => setOpenSubmenu(null), 300)
    }

    const getAnimationDelay = (currentIndex: number, clickedIndex: number, total: number) => {
        const distance = Math.abs(currentIndex - clickedIndex)
        return distance * 0.05
    }

    return (
        <>
            <motion.header
                className="fixed top-0 w-full bg-background/90 z-40 backdrop-blur-sm bg-opacity-95 h-16 md:h-20 select-none"
            >
                <div className="relative max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
                    <Link href="/">
                        <motion.div
                            className="flex items-center gap-4"
                        >
                            <div className="text-2xl font-bold tracking-wider text-foreground flex items-center gap-2">
                                <Emblem size={40} /> BOth
                            </div>

                            {!isMobile && pageTitle && (
                                <motion.div
                                    className="text-lg font-semibold text-foreground/80 border-l-2 border-foreground/80 pl-4"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {pageTitle}
                                </motion.div>
                            )}
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex gap-3 items-center h-full">
                        {navItems.map((item, index) => (
                            <motion.div
                                key={index}
                                className="relative h-full flex items-center group"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                onMouseEnter={() => item.subItems && setOpenSubmenu(item.href)}
                                onMouseLeave={() => item.subItems && setOpenSubmenu(null)}
                            >
                                {
                                    !item.subItems && (
                                    <Link
                                        href={item.href}
                                        className="h-full flex items-center mr-3"
                                    >
                                        <div className={`flex flex-col items-center justify-center transition-colors ${
                                            pathname.replace(/\/$/, '') === item.href
                                                ? 'text-primary'
                                                : 'text-foreground hover:text-primary'
                                        }`}>
                                            <span className={`text-[1rem] leading-tight flex items-center gap-1 font-bold`}>
                                                {item.label}
                                                {item.subItems && (
                                                    <ChevronDown className="w-3 h-3"/>
                                                )}
                                            </span>
                                            <span
                                                className="text-[0.65rem] text-foreground/60 leading-tight mt-0.5 font-medium">
                                                {item.labelJa}
                                            </span>
                                        </div>
                                    </Link>
                                )
                                }
                                {
                                    item.subItems && (
                                    <div
                                        className="h-full flex items-center"
                                    >
                                        <div className={`flex flex-col items-center justify-center transition-colors ${
                                            pathname.replace(/\/$/, '') === item.href
                                                ? 'text-primary'
                                                : 'text-foreground hover:text-primary'
                                        }`}>
                                            <span className={`text-[1rem] leading-tight flex items-center gap-1 font-bold`}>
                                                {item.label}
                                                {item.subItems && (
                                                    <ChevronDown className="w-3 h-3"/>
                                                )}
                                            </span>
                                            <span
                                                className="text-[0.65rem] text-foreground/60 leading-tight mt-0.5 font-medium">
                                                {item.labelJa}
                                            </span>
                                        </div>
                                    </div>
                                )
                                }

                                {/* Desktop Submenu */}
                                {item.subItems && (
                                    <AnimatePresence>
                                        {openSubmenu === item.href && (
                                            <motion.div
                                                className="absolute top-full right-0 bg-background border border-accent-light shadow-lg rounded-lg overflow-hidden min-w-48"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {item.subItems.map((subItem, subIndex) => (
                                                    <motion.div
                                                        key={subItem.href}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.2, delay: subIndex * 0.05 }}
                                                    >
                                                        <Link
                                                            href={subItem.href}
                                                            className="block px-4 py-3 hover:bg-accent-light transition-colors"
                                                        >
                                                            <div className="flex flex-col gap-0.5">
                                                                <span className="text-sm font-medium">{subItem.label}</span>
                                                                <span className="text-xs text-foreground/60">{subItem.labelJa}</span>
                                                            </div>
                                                        </Link>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                )}
                            </motion.div>
                        ))}
                    </nav>
                </div>
            </motion.header>

            {/* Mobile Menu Backdrop */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setIsMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Menu Button */}
            <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden flex flex-col justify-center items-center w-8 gap-1.5 top-4 right-6 z-70 fixed p-2"
                aria-label="メニューを開く"
                aria-expanded={isMenuOpen}
                whileTap={{ scale: 0.9 }}
            >
                <motion.span
                    className="h-0.5 w-6 bg-foreground"
                    animate={{
                        rotate: isMenuOpen ? 45 : 0,
                        y: isMenuOpen ? 8 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                />
                <motion.span
                    className="h-0.5 w-6 bg-foreground"
                    animate={{
                        opacity: isMenuOpen ? 0 : 1,
                        scale: isMenuOpen ? 0 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                />
                <motion.span
                    className="h-0.5 w-6 bg-foreground"
                    animate={{
                        rotate: isMenuOpen ? -45 : 0,
                        y: isMenuOpen ? -8 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                />
            </motion.button>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="fixed top-0 right-0 w-64 max-w-xs bg-background border-l border-accent-light shadow-2xl z-60 md:hidden h-dvh overflow-screen"
                        initial={{ x: "50%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 100, stiffness: 800 }}
                    >
                        <div className="relative w-full min-h-dvh">
                            {/* Main Menu */}
                            <motion.nav
                                className="flex flex-col py-8 mt-8 px-6 gap-2 absolute inset-0"
                                animate={{ x: isSubmenuOpen ? "-100%" : 0 }}
                                transition={{ type: "spring", damping: 100, stiffness: 600 }}
                            >
                                {navItems.map((item, index) => {
                                    const clickedIndex = navItems.findIndex(i => i.href === openSubmenu)
                                    const delay = isSubmenuOpen ? getAnimationDelay(index, clickedIndex, navItems.length) : index * 0.08

                                    return (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                                transition: { duration: 0.3, delay }
                                            }}
                                            exit={{
                                                opacity: 0,
                                                x: -50,
                                                transition: { duration: 0.3, delay: isSubmenuOpen ? delay : 0 }
                                            }}
                                        >
                                            {item.subItems ? (
                                                <button
                                                    onClick={() => toggleSubmenu(item.href)}
                                                    className={`w-full flex items-center justify-between text-base font-medium px-4 py-3 rounded-lg transition-all duration-200 ${
                                                        pathname === item.href
                                                            ? 'text-primary bg-accent-light/70'
                                                            : 'text-foreground hover:text-primary hover:bg-accent-light/50'
                                                    }`}
                                                >
                                                    <div className="flex flex-col gap-0.5 text-left">
                                                        <span>{item.label}</span>
                                                        <span className="text-xs text-foreground/60">{item.labelJa}</span>
                                                    </div>
                                                    <ChevronDown className="w-4 h-4 -rotate-90" />
                                                </button>
                                            ) : (
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className={`flex items-center justify-between text-base font-medium px-4 py-3 rounded-lg transition-all duration-200 ${
                                                        pathname.replace(/\/$/, '') === item.href
                                                            ? 'text-primary bg-accent-light/70'
                                                            : 'text-foreground hover:text-primary hover:bg-accent-light/50'
                                                    }`}
                                                >
                                                    <div className="flex flex-col gap-0.5">
                                                        <span>{item.label}</span>
                                                        <span className="text-xs text-foreground/60">{item.labelJa}</span>
                                                    </div>
                                                </Link>
                                            )}
                                        </motion.div>
                                    )
                                })}
                            </motion.nav>

                            {/* Submenu */}
                            <AnimatePresence>
                                {openSubmenu && (
                                    <motion.div
                                        className="absolute inset-0 bg-background py-8 mt-8 px-6"
                                        initial={{ x: "100%" }}
                                        animate={{ x: isSubmenuOpen ? 0 : "100%" }}
                                        exit={{ x: "100%" }}
                                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                    >
                                        {/* Back Button */}
                                        <motion.button
                                            onClick={closeSubmenu}
                                            className="flex items-center gap-2 text-foreground hover:text-primary mb-4 px-4 py-2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{
                                                opacity: isSubmenuOpen ? 1 : 0,
                                                x: isSubmenuOpen ? 0 : 20,
                                                transition: { duration: 0.3 }
                                            }}
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                            <span className="font-medium">戻る</span>
                                        </motion.button>

                                        {/* Submenu Title */}
                                        {navItems.find(item => item.href === openSubmenu) && (
                                            <motion.div
                                                className="mb-4 px-4"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{
                                                    opacity: isSubmenuOpen ? 1 : 0,
                                                    x: isSubmenuOpen ? 0 : 20,
                                                    transition: { duration: 0.3, delay: 0.1 }
                                                }}
                                            >
                                                <h3 className="text-xl font-bold">
                                                    {navItems.find(item => item.href === openSubmenu)?.label}
                                                </h3>
                                                <p className="text-sm text-foreground/60">
                                                    {navItems.find(item => item.href === openSubmenu)?.labelJa}
                                                </p>
                                            </motion.div>
                                        )}

                                        {/* Submenu Items */}
                                        <div className="flex flex-col gap-2">
                                            {navItems.find(item => item.href === openSubmenu)?.subItems?.map((subItem, subIndex) => (
                                                <motion.div
                                                    key={subItem.href}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{
                                                        opacity: isSubmenuOpen ? 1 : 0,
                                                        x: isSubmenuOpen ? 0 : 20,
                                                        transition: { duration: 0.3, delay: 0.2 + (subIndex * 0.08) }
                                                    }}
                                                >
                                                    <Link
                                                        href={subItem.href}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="block px-4 py-3 text-base font-medium rounded-lg hover:bg-accent-light/50 transition-colors"
                                                    >
                                                        <div className="flex flex-col gap-0.5">
                                                            <span>{subItem.label}</span>
                                                            <span className="text-xs text-foreground/60">{subItem.labelJa}</span>
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}