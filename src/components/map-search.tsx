"use client"

import React, { useState, useRef, useEffect, useMemo } from "react"
import { Search, X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchResult {
    id: string
    label: string
    score: number
    exhibitionNames: string
}

interface LinkResult {
    id: string
    label: string
    href: string
}

interface ExtraLink {
    id: string
    label: string
    href: string
    keywords: string[]
    exactOnly?: boolean
}

interface RoomData {
    label: string
    keywords?: string[]
}

interface ExhibitionData {
    roomId: string
    name: string
    organization: string
    description: string
}

interface OtherEventData {
    roomId: string
    name: string
    description: string
}

interface MapSearchProps {
    onSelectRoom: (roomId: string) => void
    onRemoveSelect: () => void
    roomLabels: Record<string, string | RoomData>
    pinnedRoomId: string | null
    exhibitions: (ExhibitionData | OtherEventData)[]
}

export function MapSearch({
                              onSelectRoom,
                              onRemoveSelect,
                              roomLabels,
                              pinnedRoomId,
                              exhibitions
                          }: MapSearchProps) {

    const [query, setQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const extraLinks: ExtraLink[] = [
        {
            id: "tsurusaki",
            label: "鶴崎像",
            href: "/tsurusaki",
            keywords: ["鶴崎", "つるさき"],
            exactOnly: false
        },
        {
            id: "boss",
            label: "EX問題（謎解き）",
            href: "/quiz/dsdfdnjazaerw",
            keywords: ["臨時便"],
            exactOnly: true
        }
    ]

    const toHalfWidth = (str: string): string => {
        return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
        }).replace(/[^\x00-\x7F]/g, (s) => {
            const map: Record<string, string> = {
                '−': '-', '－': '-', '‐': '-', 'ー': '-', '　': ' ',
            }
            return map[s] || s
        })
    }

    const searchTerms = useMemo(() => {
        return toHalfWidth(query.toLowerCase())
            .split(/\s+/)
            .filter(term => term.length > 0)
    }, [query])

    const results: SearchResult[] = useMemo(() => {
        if (searchTerms.length === 0) return []

        const matches: SearchResult[] = []

        Object.entries(roomLabels).forEach(([id, data]) => {
            const label = typeof data === "string" ? data : data.label
            const keywords = typeof data === "string" ? [] : (data.keywords || [])
            const roomExhibitions = exhibitions.filter(e => e.roomId === id)

            const normalizedLabel = toHalfWidth(label.toLowerCase())
            const normalizedId = toHalfWidth(id.toLowerCase())
            const normalizedKeywords = keywords.map(k => toHalfWidth(k.toLowerCase()))
            const normalizedExhNames = roomExhibitions.map(e => toHalfWidth(e.name.toLowerCase()))
            const normalizedDescriptions = roomExhibitions.map(e =>
                toHalfWidth(e.description.toLowerCase())
            )

            const matchesAllTerms = searchTerms.every(term =>
                normalizedLabel.includes(term) ||
                normalizedId.includes(term) ||
                normalizedKeywords.some(k => k.includes(term)) ||
                normalizedExhNames.some(n => n.includes(term)) ||
                normalizedDescriptions.some(d => d.includes(term))
            )

            if (matchesAllTerms) {
                let score = 0

                searchTerms.forEach(term => {
                    if (normalizedLabel === term) score += 100
                    else if (normalizedLabel.startsWith(term)) score += 50
                    else if (normalizedLabel.includes(term)) score += 30
                })

                const exhibitionNames = roomExhibitions.map(e => e.name).join(' · ')
                matches.push({ id, label, score, exhibitionNames })
            }
        })

        return matches.sort((a, b) => b.score - a.score)
    }, [searchTerms, roomLabels, exhibitions])

    const linkResults: LinkResult[] = searchTerms.length === 0
        ? []
        : extraLinks
            .filter(link => {
                const normalizedKeywords = link.keywords.map(k =>
                    toHalfWidth(k.toLowerCase())
                )

                return searchTerms.every(term => {
                    if (link.exactOnly) {
                        return normalizedKeywords.some(k => k === term)
                    }
                    return normalizedKeywords.some(k => k.includes(term))
                })
            })
            .map(link => ({
                id: link.id,
                label: link.label,
                href: link.href
            }))

    const displayQuery = useMemo(() => {
        if (query !== "") return query

        if (!pinnedRoomId) return ""

        const data = roomLabels[pinnedRoomId]
        return typeof data === "string" ? data : data?.label || ""
    }, [query, pinnedRoomId, roomLabels])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (roomId: string) => {
        onSelectRoom(roomId)
        setQuery("")
        setIsOpen(false)
    }

    return (
        <div className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    ref={inputRef}
                    value={displayQuery}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setIsOpen(true)
                    }}
                    className="w-full pl-10 pr-10 py-2 border rounded-md"
                />
                {query && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                        onClick={() => {
                            setQuery("")
                            setIsOpen(false)
                            onRemoveSelect()
                        }}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {isOpen && (results.length > 0 || linkResults.length > 0) && (
                <div ref={dropdownRef} className="absolute w-full bg-card border mt-2 rounded-md z-50">

                    {results.slice(0, 10).map(result => (
                        <button
                            key={result.id}
                            onClick={() => handleSelect(result.id)}
                            className="w-full text-left px-4 py-3 hover:bg-accent-light"
                        >
                            <div>{result.label}</div>
                            <div className="text-sm">{result.exhibitionNames}</div>
                        </button>
                    ))}

                    {linkResults.length > 0 && (
                        <div className="border-t">
                            {linkResults.map(link => (
                                <a
                                    key={link.id}
                                    href={link.href}
                                    className="flex justify-between px-4 py-3 hover:bg-accent-light"
                                >
                                    <span>{link.label}</span>
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}