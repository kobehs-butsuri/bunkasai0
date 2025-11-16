"use client"

import React, {useEffect, useRef, useState} from "react"
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
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [showPopup, setShowPopup] = useState(false)
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
    const isMobile = useMediaQuery("(max-width: 768px)")

    // モバイル用のズーム・パン状態
    const [scale, setScale] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 })
    const [hasMoved, setHasMoved] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<HTMLDivElement>(null)
    const lastTouchDistance = useRef<number | null>(null)
    const lastTouchCenter = useRef<{ x: number; y: number } | null>(null)
    const initialPinchScale = useRef<number | null>(null)
    const initialPinchPosition = useRef<{ x: number; y: number } | null>(null)
    const [isInitialized, setIsInitialized] = useState(false)

    const rooms = mapData.rooms as Room[]

    // 初期表示時にマップを中央に配置・拡大
    useEffect(() => {
        if (!isMobile || !containerRef.current || !mapRef.current || isInitialized) return

        const container = containerRef.current
        const map = mapRef.current

        // SVGのサイズを取得
        const svg = map.querySelector('svg')
        if (!svg) return

        const svgRect = svg.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()

        // 縦横比を計算して、小さい方に合わせる
        const scaleX = containerRect.width / svgRect.width
        const scaleY = containerRect.height / svgRect.height
        const initialScale = Math.min(scaleX, scaleY) * 0.95 // 少し余白を持たせる

        // 中央に配置
        const scaledWidth = svgRect.width * initialScale
        const scaledHeight = svgRect.height * initialScale
        const centerX = (containerRect.width - scaledWidth) / 2
        const centerY = (containerRect.height - scaledHeight) / 2

        setScale(initialScale)
        setPosition({ x: centerX, y: centerY })
        setIsInitialized(true)
    }, [isMobile, isInitialized])

    // モバイルモード切り替え時にリセット
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setScale(1)
        setPosition({ x: 0, y: 0 })
        setIsInitialized(false)
    }, [isMobile])

    // グローバルマウスアップイベントを監視
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isDragging) {
                setIsDragging(false)
                setHasMoved(false)
                setDragStart({ x: 0, y: 0 })
            }
        }

        if (isMobile && isDragging) {
            window.addEventListener('mouseup', handleGlobalMouseUp)
            return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
        }
    }, [isMobile, isDragging])

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

    // マウスホイールでズーム（モバイルモード時）
    const handleWheel = (e: React.WheelEvent) => {
        if (!isMobile) return
        e.preventDefault()

        const container = containerRef.current
        if (!container) return

        const rect = container.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        // ズーム前のマウス位置（変換座標系での位置）
        const beforeX = (mouseX - position.x) / scale
        const beforeY = (mouseY - position.y) / scale

        // ズーム
        const delta = e.deltaY > 0 ? 0.9 : 1.1
        const newScale = Math.max(0.5, Math.min(4, scale * delta))

        // ズーム後のマウス位置が同じ場所を指すように位置を調整
        const newX = mouseX - beforeX * newScale
        const newY = mouseY - beforeY * newScale

        // 位置を制限
        const constrained = constrainPosition(newX, newY, newScale)

        setScale(newScale)
        setPosition(constrained)
    }

    // マウスドラッグ（モバイルモード時）
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isMobile) return
        e.preventDefault()
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        })
        setTouchStartPos({ x: e.clientX, y: e.clientY })
        setHasMoved(false)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isMobile) {
            // デスクトップモードのホバー処理
            setMousePos({ x: e.clientX, y: e.clientY })
            let element: Element | null = e.target as SVGElement
            while (element && element !== (e.currentTarget as Element)) {
                if (element.id && ROOM_DESCRIPTIONS[element.id]) {
                    setHoveredRoomId(element.id)
                    return
                }
                element = element.parentElement
            }
            setHoveredRoomId(null)
            return
        }

        // マウスダウン後の処理
        if (dragStart.x !== 0 || dragStart.y !== 0 || isDragging) {
            // 移動量が5px以上ならドラッグ開始
            const moveDistance = Math.hypot(
                e.clientX - touchStartPos.x,
                e.clientY - touchStartPos.y
            )
            if (moveDistance > 5) {
                if (!isDragging) {
                    setIsDragging(true)
                }
                setHasMoved(true)
                const newX = e.clientX - dragStart.x
                const newY = e.clientY - dragStart.y

                // 位置を制限
                const constrained = constrainPosition(newX, newY, scale)
                setPosition(constrained)
            }
        }
    }

    const handleMouseUp = (e: React.MouseEvent) => {

        if (!hasMoved) {
            // クリック判定 - クリック位置の要素を取得
            let element: Element | null = document.elementFromPoint(e.clientX, e.clientY)
            while (element && element !== containerRef.current) {
                if (element.id && ROOM_DESCRIPTIONS[element.id]) {
                    e.preventDefault()
                    e.stopPropagation()
                    handleRoomClick(element.id)
                    break
                }
                element = element.parentElement
            }
        }

        if (!isMobile) return
        setIsDragging(false)
        setHasMoved(false)
        setDragStart({ x: 0, y: 0 })
    }

    // タッチイベントハンドラー（モバイル用）
    const handleTouchStart = (e: React.TouchEvent) => {
        if (!isMobile) return

        // すべてのタッチイベントの伝搬を防ぐ
        e.preventDefault()

        if (e.touches.length === 2) {
            // ピンチズーム開始
            const touch1 = e.touches[0]
            const touch2 = e.touches[1]
            lastTouchDistance.current = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            )

            const container = containerRef.current
            if (!container) return
            const rect = container.getBoundingClientRect()

            // 2本指の中心点（コンテナ内の相対座標）
            const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left
            const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top
            lastTouchCenter.current = { x: centerX, y: centerY }

            // ピンチ開始時の状態を保存
            initialPinchScale.current = scale
            initialPinchPosition.current = { x: position.x, y: position.y }

            // ドラッグ状態をリセット
            setIsDragging(false)
            setHasMoved(false)
            setDragStart({ x: 0, y: 0 })
        } else if (e.touches.length === 1) {
            // ドラッグ開始準備
            setDragStart({
                x: e.touches[0].clientX - position.x,
                y: e.touches[0].clientY - position.y,
            })
            setTouchStartPos({
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            })
            setHasMoved(false)
        }
    }

    // 位置を制限する関数
    const constrainPosition = (x: number, y: number, currentScale: number) => {
        if (!containerRef.current || !mapRef.current) return { x, y }

        const container = containerRef.current
        const map = mapRef.current
        const svg = map.querySelector('svg')
        if (!svg) return { x, y }

        const containerRect = container.getBoundingClientRect()

        // SVGの元のサイズを取得（scale=1の時のサイズ）
        const svgWidth = svg.viewBox.baseVal.width || svg.width.baseVal.value
        const svgHeight = svg.viewBox.baseVal.height || svg.height.baseVal.value

        // スケール適用後のマップサイズ
        const scaledWidth = svgWidth * currentScale
        const scaledHeight = svgHeight * currentScale

        // 最小・最大位置を計算（マップが画面から出ないように）
        const minX = (containerRect.width - scaledWidth) / 2
        const maxX = -(containerRect.width - scaledWidth) / 2
        const minY = (containerRect.height - scaledHeight) / 2
        const maxY = -(containerRect.height - scaledHeight) / 2

        // マップがコンテナより小さい場合は中央に配置、大きい場合は制限
        let constrainedX: number
        let constrainedY: number

        if (scaledWidth <= containerRect.width) {
            constrainedX = (containerRect.width - scaledWidth) / 2
        } else {
            constrainedX = Math.max(minX, Math.min(maxX, x))
        }

        if (scaledHeight <= containerRect.height) {
            constrainedY = (containerRect.height - scaledHeight) / 2
        } else {
            constrainedY = Math.max(minY, Math.min(maxY, y))
        }

        return { x: constrainedX, y: constrainedY }
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isMobile) return

        // すべてのタッチイベントの伝搬を防ぐ
        e.preventDefault()

        if (e.touches.length === 2 && lastTouchDistance.current !== null && lastTouchCenter.current && initialPinchScale.current !== null && initialPinchPosition.current !== null) {
            // ピンチズーム
            const touch1 = e.touches[0]
            const touch2 = e.touches[1]
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            )

            const container = containerRef.current
            if (!container) return

            // ズーム中心は最初にタッチした位置を維持
            const centerX = lastTouchCenter.current.x
            const centerY = lastTouchCenter.current.y

            // ズーム比率を計算（初期距離からの累積比率）
            const scaleRatio = distance / lastTouchDistance.current
            const newScale = Math.max(0.5, Math.min(4, initialPinchScale.current * scaleRatio))

            // ズーム前の位置（ピンチ開始時の状態を基準）
            const beforeX = (centerX - initialPinchPosition.current.x) / initialPinchScale.current
            const beforeY = (centerY - initialPinchPosition.current.y) / initialPinchScale.current

            // ズーム後の位置調整
            const newX = centerX - beforeX * newScale
            const newY = centerY - beforeY * newScale

            // 位置を制限
            const constrained = constrainPosition(newX, newY, newScale)

            setScale(newScale)
            setPosition(constrained)
        } else if (e.touches.length === 1 && (dragStart.x !== 0 || dragStart.y !== 0 || isDragging)) {
            // ドラッグ
            const moveDistance = Math.hypot(
                e.touches[0].clientX - touchStartPos.x,
                e.touches[0].clientY - touchStartPos.y
            )
            if (moveDistance > 5) {
                if (!isDragging) {
                    setIsDragging(true)
                }
                setHasMoved(true)
                const newX = e.touches[0].clientX - dragStart.x
                const newY = e.touches[0].clientY - dragStart.y

                // 位置を制限
                const constrained = constrainPosition(newX, newY, scale)
                setPosition(constrained)
            }
        }
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!isMobile) return

        if (e.touches.length < 2) {
            lastTouchDistance.current = null
            lastTouchCenter.current = null
            initialPinchScale.current = null
            initialPinchPosition.current = null
        }

        if (e.touches.length === 0) {
            // タップ判定（ドラッグしていない場合）
            if (!hasMoved) {
                const touch = e.changedTouches[0]
                let current: Element | null = document.elementFromPoint(touch.clientX, touch.clientY)
                while (current && current !== containerRef.current) {
                    if (current.id && ROOM_DESCRIPTIONS[current.id]) {
                        e.preventDefault()
                        e.stopPropagation()
                        handleRoomClick(current.id)
                        break
                    }
                    current = current.parentElement
                }
            }
            setIsDragging(false)
            setHasMoved(false)
            setDragStart({ x: 0, y: 0 })
        }
    }

    const selectedRoom = selectedRoomId ? ROOM_DESCRIPTIONS[selectedRoomId] : null
    const selectedRoomData = selectedRoomId ? rooms.find((r) => r.id === selectedRoomId) : null

    return (
        <div className="bg-background text-foreground">
            <Header />

            <main className={isMobile ? "" : "pt-32 pb-24 px-8 max-w-7xl mx-auto"}>
                <div className={isMobile ? "px-4 pt-24 pb-4" : "mb-12 pt-8"}>
                    <h1 className={isMobile ? "text-3xl font-bold mb-2 tracking-tight" : "text-5xl font-bold mb-4 tracking-tight text-balance"}>
                        校内マップ
                    </h1>
                    <p className={isMobile ? "text-sm text-muted-foreground" : "text-lg text-muted-foreground"}>
                        {isMobile
                            ? "ピンチでズーム、スワイプで移動、タップで説明を表示"
                            : "ホバーで説明を表示、クリックで詳細ページへ"}
                    </p>
                </div>

                <div
                    className={isMobile
                        ? "w-full h-[60vh] overflow-hidden relative bg-card border-y border-accent-light"
                        : "bg-card border border-accent-light p-8 mb-12 relative"
                    }
                    ref={containerRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={() => {
                        if (isMobile) {
                            setIsDragging(false)
                            setHasMoved(false)
                        } else {
                            setHoveredRoomId(null)
                        }
                    }}
                    style={isMobile ? {
                        touchAction: 'none',
                        cursor: isDragging ? 'grabbing' : 'default',
                    } : undefined}
                >
                    <div
                        ref={mapRef}
                        className="w-full"
                        style={isMobile ? {
                            userSelect: 'none',
                            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                            transformOrigin: '0 0',
                            transition: 'none',
                        } : {
                            userSelect: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <MapSVG />
                    </div>
                </div>

                {!isMobile && hoveredRoomId && ROOM_DESCRIPTIONS[hoveredRoomId] && (
                    <div
                        className="fixed p-6 bg-card border border-accent-light z-50 pointer-events-none"
                        style={{
                            left: `${mousePos.x}px`,
                            top: `${mousePos.y - 20}px`,
                            transform: 'translate(-50%, -100%)',
                        }}
                    >
                        <div
                            className="absolute w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-accent-light"
                            style={{
                                bottom: '-8px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                            }}
                        ></div>
                        <div
                            className="absolute w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-card"
                            style={{
                                bottom: '-7px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                            }}
                        ></div>
                        <h3 className="font-bold text-lg mb-2 whitespace-nowrap">{ROOM_DESCRIPTIONS[hoveredRoomId].name}</h3>
                        <p className="text-muted-foreground whitespace-nowrap">{ROOM_DESCRIPTIONS[hoveredRoomId].description}</p>
                    </div>
                )}

                {showPopup && selectedRoom && selectedRoomData && isMobile && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setShowPopup(false)
                                setSelectedRoomId(null)
                            }
                        }}
                        onTouchEnd={(e) => {
                            e.stopPropagation()
                        }}
                    >
                        <div
                            className="bg-card border border-accent-light p-8 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
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

            {!isMobile && <Footer />}
        </div>
    )
}