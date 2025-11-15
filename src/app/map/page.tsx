"use client"

import {useState} from "react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {MapSVG} from "@/components/map"
import mapData from "@/data/map.json"
import {useMediaQuery} from "@/hooks/use-mobile"

interface Room {
    id: string
    eventId?: string
}

const ROOM_DESCRIPTIONS: Record<string, { name: string; description: string }> = {
    "class_2-9": {
        name: "2-9",
        description: "AAA",
    },
    "class_1-9": {
        name: "1-9",
        description: "BBB",
    },
    "WC_1F_1": {
        name: "トイレ",
        description: "トイレ",
    },
    "WC_1F_2": {
        name: "トイレ",
        description: "トイレ",
    },
}

export default function Map() {
    const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null)
    const [showPopup, setShowPopup] = useState(false)
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
    const isMobile = useMediaQuery("(max-width: 768px)")

    const rooms = mapData.rooms as Room[]

    const handleRoomClick = (roomId: string) => {
        const room = rooms.find((r) => r.id === roomId)
        if (!room) return

        if (isMobile) {
            setSelectedRoomId(roomId)
            setShowPopup(true)
        } else {
            if (room.eventId) {
                window.location.href = `/event/${room.eventId}`
            }
        }
    }

    const selectedRoom = selectedRoomId ? ROOM_DESCRIPTIONS[selectedRoomId] : null
    const selectedRoomData = selectedRoomId ? rooms.find((r) => r.id === selectedRoomId) : null

    return (
        <div className="bg-background text-foreground">
            <Header />

            <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto">
                <div className="mb-12 pt-8">
                    <h1 className="text-5xl font-bold mb-4 tracking-tight text-balance">校内マップ</h1>
                    <p className="text-lg text-muted-foreground">
                        {isMobile
                            ? "タップで説明を表示"
                            : "ホバーで説明を表示、クリックで詳細ページへ"}
                    </p>
                </div>

                <div className="bg-card border border-accent-light p-8 mb-12 relative">
                    <div
                        className="w-full cursor-pointer"
                        style={{
                            userSelect: 'none',
                        }}
                        onClick={(e) => {
                            // g要素から上に遡ってidを持つ要素を探す
                            let element: Element | null = e.target as SVGElement
                            while (element && element !== (e.currentTarget as Element)) {
                                if (element.id && ROOM_DESCRIPTIONS[element.id]) {
                                    handleRoomClick(element.id)
                                    return
                                }
                                element = element.parentElement
                            }
                        }}
                        onMouseMove={(e) => {
                            if (isMobile) return
                            // g要素から上に遡ってidを持つ要素を探す
                            let element: Element | null = e.target as SVGElement
                            while (element && element !== (e.currentTarget as Element)) {
                                if (element.id && ROOM_DESCRIPTIONS[element.id]) {
                                    setHoveredRoomId(element.id)
                                    return
                                }
                                element = element.parentElement
                            }
                            setHoveredRoomId(null)
                        }}
                        onMouseLeave={() => setHoveredRoomId(null)}
                    >
                        <MapSVG />
                    </div>
                </div>

                {hoveredRoomId && !isMobile && ROOM_DESCRIPTIONS[hoveredRoomId] && (
                    <div className="mb-8 p-6 bg-card border border-accent-light relative">
                        <div className="absolute -top-3 left-8 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-accent-light"></div>
                        <div className="absolute -top-2 left-8 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-card"></div>
                        <h3 className="font-bold text-lg mb-2">{ROOM_DESCRIPTIONS[hoveredRoomId].name}</h3>
                        <p className="text-muted-foreground">{ROOM_DESCRIPTIONS[hoveredRoomId].description}</p>
                    </div>
                )}

                {showPopup && selectedRoom && selectedRoomData && isMobile && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
                        <div className="bg-card border border-accent-light p-8 max-w-md w-full">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold">{selectedRoom.name}</h2>
                                <button
                                    onClick={() => {
                                        setShowPopup(false)
                                        setSelectedRoomId(null)
                                    }}
                                    className="text-2xl font-bold opacity-50 hover:opacity-100"
                                >
                                    ×
                                </button>
                            </div>

                            <p className="text-muted-foreground mb-8">{selectedRoom.description}</p>

                            {selectedRoomData.eventId && (
                                <Link
                                    href={`/event/${selectedRoomData.eventId}`}
                                    className="w-full bg-primary text-background py-3 font-bold hover:opacity-90 transition-opacity text-center block mb-4"
                                >
                                    詳細を見る
                                </Link>
                            )}

                            <button
                                onClick={() => {
                                    setShowPopup(false)
                                    setSelectedRoomId(null)
                                }}
                                className="w-full bg-card border border-accent-light py-3 font-bold hover:bg-accent-light transition-colors text-center"
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}