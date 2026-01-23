"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Map, CalendarClock, Binoculars, Search } from "lucide-react"

export function Toolbar() {
    const pathname = usePathname()

    const items = [
        { href: "/", label: "Home", icon: Home },
        { href: "/schedule", label: "Schedule", icon: CalendarClock },
        { href: "/pickup", label: "Pick Up", icon: Binoculars },
        { href: "/map", label: "Map", icon: Map },
        { href: "/event", label: "Events", icon: Search }
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background md:hidden h-16">
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
                                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                                }`}>
                                <Icon className="h-5 w-5" />
                                <span className="text-[0.7rem] font-medium">{item.label}</span>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </nav>
    )
}
