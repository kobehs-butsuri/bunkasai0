"use client"

import React, { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchResult {
    id: string
    label: string
    score: number
    exhibitionNames: string
}

interface RoomData {
    label: string
    keywords?: string[]
}

interface ExhibitionData {
    roomId: string
    name: string,
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

export function MapSearch({ onSelectRoom, onRemoveSelect, roomLabels, pinnedRoomId, exhibitions }: MapSearchProps) {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<SearchResult[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const inputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const toHalfWidth = (str: string): string => {
        return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
        }).replace(/[^\x00-\x7F]/g, (s) => {
            const map: Record<string, string> = {
                '−': '-', '－': '-', '‐': '-', 'ー': '-', '　': ' ',
                '！': '!', '＂': '"', '＃': '#', '＄': '$', '％': '%',
                '＆': '&', '＇': "'", '（': '(', '）': ')', '＊': '*',
                '＋': '+', '，': ',', '．': '.', '／': '/', '：': ':',
                '；': ';', '＜': '<', '＝': '=', '＞': '>', '？': '?',
                '＠': '@', '［': '[', '＼': '\\', '］': ']', '＾': '^',
                '＿': '_', '｀': '`', '｛': '{', '｜': '|', '｝': '}', '～': '~'
            }
            return map[s] || s
        })
    }

    const getExhibitionsByRoomId = (roomId: string): (ExhibitionData | OtherEventData)[] =>
        exhibitions.filter(e => e.roomId === roomId)

    useEffect(() => {
        if (query.trim() === "") {
            setResults([])
            setSelectedIndex(-1)
            return
        }

        const searchTerms = toHalfWidth(query.toLowerCase())
            .split(/\s+/)
            .filter(term => term.length > 0)

        const matches: SearchResult[] = []

        Object.entries(roomLabels).forEach(([id, data]) => {
            const label = typeof data === "string" ? data : data.label
            const keywords = typeof data === "string" ? [] : (data.keywords || [])
            const roomExhibitions = getExhibitionsByRoomId(id)

            const normalizedLabel    = toHalfWidth(label.toLowerCase())
            const normalizedId       = toHalfWidth(id.toLowerCase())
            const normalizedKeywords = keywords.map(k => toHalfWidth(k.toLowerCase()))
            const normalizedExhNames = roomExhibitions.map(e => toHalfWidth(e.name.toLowerCase()))
            const normalizedExhOrgs  = roomExhibitions.flatMap(e =>
                "organization" in e && e.organization ? e.organization.split(';').map(o => toHalfWidth(o.trim().toLowerCase())) : ""
            )
            const normalizedDescriptions = roomExhibitions.map(e =>
                toHalfWidth(e.description.toLowerCase())
            )

            const matchesAllTerms = searchTerms.every(term =>
                normalizedLabel.includes(term) ||
                normalizedId.includes(term) ||
                normalizedKeywords.some(k => k.includes(term)) ||
                normalizedExhNames.some(n => n.includes(term)) ||
                normalizedExhOrgs.some(o => o.includes(term)) ||
                normalizedDescriptions.some(d => d.includes(term))
            )

            if (matchesAllTerms) {
                let score = 0

                searchTerms.forEach(term => {
                    // 完全一致
                    if (normalizedLabel === term)                              score += 100
                    else if (normalizedId === term)                           score += 90
                    else if (normalizedKeywords.some(k => k === term))        score += 80
                    else if (normalizedExhNames.some(n => n === term))        score += 80
                    else if (normalizedExhOrgs.some(o => o === term))         score += 75
                    else if (normalizedDescriptions.some(d => d === term))        score += 60
                    // 前方一致
                    else if (normalizedLabel.startsWith(term))                score += 50
                    else if (normalizedId.startsWith(term))                   score += 45
                    else if (normalizedKeywords.some(k => k.startsWith(term))) score += 40
                    else if (normalizedExhNames.some(n => n.startsWith(term))) score += 40
                    else if (normalizedExhOrgs.some(o => o.startsWith(term))) score += 35
                    else if (normalizedDescriptions.some(d => d.startsWith(term))) score += 25
                    // 部分一致
                    else if (normalizedLabel.includes(term))                  score += 30
                    else if (normalizedId.includes(term))                     score += 25
                    else if (normalizedKeywords.some(k => k.includes(term)))  score += 20
                    else if (normalizedExhNames.some(n => n.includes(term)))  score += 20
                    else if (normalizedExhOrgs.some(o => o.includes(term)))   score += 15
                    else if (normalizedDescriptions.some(d => d.includes(term)))   score += 10
                })

                const labelLength = normalizedLabel.length
                const totalSearchLength = searchTerms.join('').length
                if (labelLength > 0) {
                    score += (totalSearchLength / labelLength) * 10
                }

                // 表示用イベント名（複数なら「·」区切り、なければ空文字）
                const exhibitionNames = roomExhibitions.map(e => e.name).join(' · ')

                matches.push({ id, label, score, exhibitionNames })
            }
        })

        matches.sort((a, b) => b.score - a.score)
        setResults(matches)
        setSelectedIndex(-1)
    }, [query, roomLabels, exhibitions])

    useEffect(() => {
        if (pinnedRoomId) {
            const data = roomLabels[pinnedRoomId]
            const label = typeof data === "string" ? data : data?.label
            if (label) setQuery(label)
        } else {
            setQuery("")
        }
    }, [pinnedRoomId, roomLabels])

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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault()
            const maxIndex = Math.min(results.length - 1, 9)
            setSelectedIndex(prev => (prev < maxIndex ? prev + 1 : prev))
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        } else if (e.key === "Enter" && selectedIndex >= 0) {
            e.preventDefault()
            handleSelect(results[selectedIndex].id)
        } else if (e.key === "Escape") {
            setIsOpen(false)
            inputRef.current?.blur()
        }
    }

    const handleSelect = (roomId: string) => {
        onSelectRoom(roomId)
        setQuery("")
        setResults([])
        setIsOpen(false)
        inputRef.current?.blur()
    }

    return (
        <div className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setIsOpen(true) }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="場所を検索..."
                    className="w-full pl-10 pr-10 py-2 bg-card border border-accent-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {query && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => { setQuery(""); setResults([]); setIsOpen(false); onRemoveSelect() }}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {isOpen && results.length > 0 && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full mt-2 w-full bg-card border border-accent-light rounded-md shadow-lg z-50 max-h-80 overflow-y-auto"
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                >
                    {results.slice(0, 10).map((result, index) => (
                        <button
                            key={result.id}
                            onClick={() => handleSelect(result.id)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`w-full text-left px-4 py-3 hover:bg-accent-light transition-colors border-b border-accent-light last:border-b-0 ${
                                index === selectedIndex ? "bg-accent-light" : ""
                            }`}
                        >
                            <div className="font-medium">{result.label}</div>
                            {result.exhibitionNames && (
                                <div className="text-sm text-muted-foreground">{result.exhibitionNames}</div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}