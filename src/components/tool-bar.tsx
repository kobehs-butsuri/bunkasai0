"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Map, CalendarClock, Search } from "lucide-react"

export function Toolbar() {
    const pathname = usePathname()

    const items = [
        { href: "/", label: "Home", icon: Home },
        { href: "/timetable", label: "Schedule", icon: CalendarClock },
        { href: "/map", label: "Map", icon: Map },
        { href: "/event", label: "Find", icon: Search }
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background md:hidden">
            <div className="flex items-stretch">
                {items.map((item) => {
                    const Icon = item.icon
                    const isActive = item.href === "/" ? pathname === item.href : pathname.startsWith(item.href)

                    return (
                        <div key={item.href} className="w-full">
                            <Link
                                href={item.href}
                                className={`flex flex-col items-center justify-center gap-1 px-3 py-3 transition-colors h-full
                                ${
                                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                                }`}>
                                <Icon className="h-5 w-5" />
                                <span className="text-xs font-medium">{item.label}</span>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </nav>
    )
}
