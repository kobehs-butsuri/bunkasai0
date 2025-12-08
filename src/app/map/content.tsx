"use client"

import React, {useCallback, useEffect, useRef, useState} from "react"
import Link from "next/link"
import {MapSVG} from "@/components/map"
import festivalData from "@/data/festival.json"
import useMobile from "@/hooks/use-mobile"
import {useSetPageTitle} from "@/hooks/page-title-context";

interface Exhibition {
    id: string
    name: string
    organization: string
    type: string
    description: string
    roomId: string
}

export default function Map() {
    useSetPageTitle("校内マップ")

    const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [showPopup, setShowPopup] = useState(false)
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
    const isMobile = useMobile()

    // ズーム・パン状態
    const [scale, setScale] = useState(1)
    const [showScrollOverlay, setShowScrollOverlay] = useState(0)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 })
    const [hasMoved, setHasMoved] = useState(false)
    const [possibleToDrag, setPossibleToDrag] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<HTMLDivElement>(null)
    const lastTouchDistance = useRef<number | null>(null)
    const lastTouchCenter = useRef<{ x: number; y: number } | null>(null)
    const initialPinchScale = useRef<number | null>(null)
    const initialPinchPosition = useRef<{ x: number; y: number } | null>(null)
    const [isInitialized, setIsInitialized] = useState(false)

    const exhibitions = festivalData.exhibitions as Exhibition[]

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const runTimeoutOnce = () => {
        // 先に既存 timeout を止める
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // 新しく登録
        timeoutRef.current = setTimeout(() => {
            setShowScrollOverlay(0);
            timeoutRef.current = null;
        }, 1500);
    };


    // roomIdから展示情報を取得
    const getExhibitionByRoomId = useCallback((roomId: string): Exhibition | undefined => {
        return exhibitions.find(exh => exh.roomId === roomId)
    }, [exhibitions])

    // 位置を制限する関数
    const constrainPosition = (x: number, y: number) => {
        if (!containerRef.current || !mapRef.current) return { x, y }

        const container = containerRef.current
        const map = mapRef.current

        const containerRect = container.getBoundingClientRect()
        const mapRect = map.getBoundingClientRect()

        // スケール適用後のマップサイズ
        const mapWidth = mapRect.width
        const mapHeight = mapRect.height

        // 上下左右の端
        const left = containerRect.width / 2
        const top = containerRect.height / 2
        const bottom = -mapHeight + containerRect.height / 2
        const right = -mapWidth + containerRect.width / 2

        const constrainedX = Math.max(right, Math.min(left, x))
        const constrainedY = Math.max(bottom, Math.min(top, y))
        return { x: constrainedX, y: constrainedY }
    }

    // 初期表示時にマップを中央に配置・拡大
    useEffect(() => {
        if (!containerRef.current || !mapRef.current || isInitialized) return

        const container = containerRef.current
        const map = mapRef.current

        const mapRect = map.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()

        // 縦横比を計算して、小さい方に合わせる
        const scaleX = containerRect.width / mapRect.width
        const scaleY = containerRect.height / mapRect.height
        const initialScale = Math.min(scaleX, scaleY) * 0.95 // 少し余白を持たせる

        // 中央に配置
        const scaledWidth = mapRect.width * initialScale
        const scaledHeight = mapRect.height * initialScale
        const centerX = (containerRect.width - scaledWidth) / 2
        const centerY = (containerRect.height - scaledHeight) / 2

        setScale(initialScale)
        setPosition({ x: centerX, y: centerY })
        setIsInitialized(true)
    }, [isMobile, isInitialized])

    // グローバルマウスアップイベントを監視
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isDragging) {
                setIsDragging(false)
                setHasMoved(false)
                setDragStart({ x: 0, y: 0 })
            }
        }

        if (isDragging) {
            window.addEventListener('mouseup', handleGlobalMouseUp)
            return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
        }
    }, [isMobile, isDragging])

    const handleRoomClick = useCallback((roomId: string) => {
        const exhibition = getExhibitionByRoomId(roomId)
        if (!exhibition) return

        if (isMobile) {
            setSelectedRoomId(roomId)
            setShowPopup(true)
        } else {
            window.location.href = `/event/${exhibition.id}`
        }
    }, [getExhibitionByRoomId, isMobile])

    // マウスホイールでズーム
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleWheel = (e: WheelEvent) => {
            if (!e.ctrlKey && !e.metaKey) {
                setShowScrollOverlay(1)
                runTimeoutOnce()
                return
            }

            e.preventDefault()

            const rect = container.getBoundingClientRect()
            const mouseX = e.clientX - rect.left
            const mouseY = e.clientY - rect.top

            const beforeX = (mouseX - position.x) / scale
            const beforeY = (mouseY - position.y) / scale

            const delta = e.deltaY > 0 ? 0.9 : 1.1
            const newScale = Math.max(0.5, Math.min(4, scale * delta))

            const newX = mouseX - beforeX * newScale
            const newY = mouseY - beforeY * newScale

            const constrained = constrainPosition(newX, newY)

            setScale(newScale)
            setPosition(constrained)
        }

        container.addEventListener('wheel', handleWheel, { passive: false })

        return () => {
            container.removeEventListener('wheel', handleWheel)
        }
    }, [scale, position]) // 依存配列に必要な値を追加

    // マウスドラッグ（モバイルモード時）
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault()
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        })
        setTouchStartPos({ x: e.clientX, y: e.clientY })
        setHasMoved(false)
    }

    const handleMouseMove = (e: React.MouseEvent) => {

        if (e.buttons === 0) {
            setIsDragging(false)
            setHasMoved(false)
            setDragStart({ x: 0, y: 0 })
            if (!isMobile) {
                // デスクトップモードのホバー処理
                setMousePos({ x: e.clientX, y: e.clientY })
                let element: Element | null = e.target as SVGElement
                while (element && element !== (e.currentTarget as Element)) {
                    if (element.id && getExhibitionByRoomId(element.id)) {
                        setHoveredRoomId(element.id)
                        return
                    }
                    element = element.parentElement
                }
                setHoveredRoomId(null)
            }
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
                const constrained = constrainPosition(newX, newY)
                setPosition(constrained)
            }
        }
    }

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!hasMoved) {
            // クリック判定 - クリック位置の要素を取得
            let element: Element | null = document.elementFromPoint(e.clientX, e.clientY)
            while (element && element !== containerRef.current) {
                if (element.id && getExhibitionByRoomId(element.id)) {
                    e.preventDefault()
                    e.stopPropagation()
                    handleRoomClick(element.id)
                    break
                }
                element = element.parentElement
            }
        }

        setIsDragging(false)
        setHasMoved(false)
        setDragStart({ x: 0, y: 0 })
    }

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        // 移動平均用の履歴
        let centerHistory: Array<{ x: number; y: number }> = []
        const HISTORY_SIZE = 10

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 1 || e.touches.length === 2) {
                // ドラッグ開始準備
                setDragStart({
                    x: e.touches[0].clientX - position.x,
                    y: e.touches[0].clientY - position.y,
                })
                setTouchStartPos({
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                })
                setIsDragging(false)
                setHasMoved(false)
                setPossibleToDrag(true)

                if (e.touches.length === 1) return
                // ピンチズーム開始
                const touch1 = e.touches[0]
                const touch2 = e.touches[1]
                lastTouchDistance.current = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                )

                const rect = container.getBoundingClientRect()

                // 2本指の中心点（コンテナ内の相対座標）
                const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left
                const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top
                lastTouchCenter.current = {x: centerX, y: centerY}

                // 履歴を初期化
                centerHistory = [{x: centerX, y: centerY}]

                // ピンチ開始時の状態を保存
                initialPinchScale.current = scale
                initialPinchPosition.current = {x: position.x, y: position.y}
            }
        }

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 2 && lastTouchDistance.current !== null && lastTouchCenter.current && initialPinchScale.current !== null && initialPinchPosition.current !== null) {
                // ピンチズーム + パン
                const touch1 = e.touches[0]
                const touch2 = e.touches[1]
                const distance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                )

                const rect = container.getBoundingClientRect()

                // 現在の2本指の中心点
                const currentCenterX = (touch1.clientX + touch2.clientX) / 2 - rect.left
                const currentCenterY = (touch1.clientY + touch2.clientY) / 2 - rect.top

                // 履歴に追加
                centerHistory.push({ x: currentCenterX, y: currentCenterY })
                if (centerHistory.length > HISTORY_SIZE) {
                    centerHistory.shift()
                }

                // 移動平均を計算
                const avgCenterX = centerHistory.reduce((sum, c) => sum + c.x, 0) / centerHistory.length
                const avgCenterY = centerHistory.reduce((sum, c) => sum + c.y, 0) / centerHistory.length

                // ズーム比率を計算
                const scaleRatio = distance / lastTouchDistance.current
                const newScale = Math.max(0.5, Math.min(4, initialPinchScale.current * scaleRatio))

                // 中心点の移動量（移動平均を使用）
                const centerDeltaX = avgCenterX - lastTouchCenter.current.x
                const centerDeltaY = avgCenterY - lastTouchCenter.current.y

                // ズーム前の位置（ピンチ開始時の状態を基準）
                const beforeX = (lastTouchCenter.current.x - initialPinchPosition.current.x) / initialPinchScale.current
                const beforeY = (lastTouchCenter.current.y - initialPinchPosition.current.y) / initialPinchScale.current

                // ズーム後の位置調整 + パン移動
                const newX = lastTouchCenter.current.x - beforeX * newScale + centerDeltaX
                const newY = lastTouchCenter.current.y - beforeY * newScale + centerDeltaY

                // 位置を制限
                const constrained = constrainPosition(newX, newY)

                setIsDragging(true)
                setScale(newScale)
                setPosition(constrained)
                e.preventDefault();
            } else if (e.touches.length === 1 && (dragStart.x !== 0 || dragStart.y !== 0 || isDragging)) {
                // ドラッグ
                const moveDistance = Math.hypot(
                    e.touches[0].clientX - touchStartPos.x,
                    e.touches[0].clientY - touchStartPos.y
                )
                if (moveDistance > 5) {
                    if (!isDragging) {
                        setShowScrollOverlay(2)
                        runTimeoutOnce();
                        return
                    }
                    setHasMoved(true)
                    const newX = e.touches[0].clientX - dragStart.x
                    const newY = e.touches[0].clientY - dragStart.y

                    // 位置を制限
                    const constrained = constrainPosition(newX, newY)
                    setPosition(constrained)
                }
            }
        }

        const handleTouchEnd = (e: TouchEvent) => {
            if (e.touches.length < 2) {
                lastTouchDistance.current = null
                lastTouchCenter.current = null
                initialPinchScale.current = null
                initialPinchPosition.current = null
                centerHistory = []

                if (e.touches.length === 1) {
                    setDragStart({
                        x: e.touches[0].clientX - position.x,
                        y: e.touches[0].clientY - position.y,
                    })
                    setTouchStartPos({
                        x: e.touches[0].clientX,
                        y: e.touches[0].clientY
                    })
                    setIsDragging(true)
                    setHasMoved(true)
                    setPossibleToDrag(true)
                } else {
                    setPossibleToDrag(false)
                }
            }

            if (e.touches.length === 0) {
                if (!hasMoved && possibleToDrag) {
                    const touch = e.changedTouches[0]
                    let current: Element | null = document.elementFromPoint(touch.clientX, touch.clientY)
                    while (current && current !== containerRef.current) {
                        if (current.id && getExhibitionByRoomId(current.id)) {
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
                setPossibleToDrag(false)
            }
        }

        container.addEventListener('touchstart', handleTouchStart, { passive: false })
        container.addEventListener('touchmove', handleTouchMove, { passive: false })
        container.addEventListener('touchend', handleTouchEnd, { passive: false })

        return () => {
            container.removeEventListener('touchstart', handleTouchStart)
            container.removeEventListener('touchmove', handleTouchMove)
            container.removeEventListener('touchend', handleTouchEnd)
        }
    }, [scale, position, isDragging, dragStart, touchStartPos, hasMoved, possibleToDrag, getExhibitionByRoomId, handleRoomClick])

    const selectedExhibition = selectedRoomId ? getExhibitionByRoomId(selectedRoomId) : null
    const hoveredExhibition = hoveredRoomId ? getExhibitionByRoomId(hoveredRoomId) : null

    return (
        <div>
            <div
                className={isMobile
                    ? "w-full h-[60vh] overflow-hidden relative bg-card border-y border-accent-light"
                    : "max-w-7xl mx-auto h-[60vh] overflow-hidden relative bg-card border-y border-accent-light"
                }
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => {
                    setIsDragging(false)
                    setHasMoved(false)
                    if (!isMobile)
                        setHoveredRoomId(null)
                }}
                style={{
                    touchAction: isDragging ? 'none' : 'pan-x pan-y',
                    cursor: !isMobile && hoveredRoomId && hoveredExhibition ? "pointer" : (isDragging ? 'grabbing' : 'default'),
                }}
            >
                <div className="absolute inset-0 bg-background/[.75] bg-opacity-50 flex items-center justify-center z-10 pointer-events-none backdrop-blur-xs transition-opacity"
                     style={{
                         opacity: showScrollOverlay === 0 ? 0 : 1,
                     }}>
                    <div className="flex items-center gap-3">
                        {
                            showScrollOverlay === 1 && (
                                <>
                                    <span className="font-medium">Zoom: </span>
                                    <kbd className="px-3 py-2 border-2 bg-border rounded font-mono text-sm font-semibold">Ctrl</kbd>
                                    <span className="text-lg">+</span>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                </>
                            )
                        }
                        {
                            showScrollOverlay === 2 && (
                                <>
                                    <span className="font-medium">Zoom and Pan: </span>
                                    <span className="text-lg">Use 2 fingers</span>
                                </>
                            )
                        }
                    </div>
                </div>
                <div
                    ref={mapRef}
                    className="w-full transition-all"
                    style={{
                        userSelect: 'none',
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transformOrigin: '0 0',
                        transition: (isDragging ? "None" : "")}}
                >
                    <MapSVG />
                </div>
            </div>

            {!isMobile && hoveredRoomId && hoveredExhibition && (
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
                    <h3 className="font-bold text-lg mb-2 whitespace-nowrap">{hoveredExhibition.name}</h3>
                    <p className="text-muted-foreground whitespace-nowrap">{hoveredExhibition.description}</p>
                </div>
            )}

            {showPopup && selectedExhibition && isMobile && (
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
                            <h2 className="text-2xl font-bold">{selectedExhibition.name}</h2>
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

                        <p className="text-muted-foreground mb-8">{selectedExhibition.description}</p>

                        <Link
                            href={`/event/${selectedExhibition.id}`}
                            className="w-full bg-primary text-background py-3 font-bold hover:opacity-90 transition-opacity text-center block mb-4"
                        >
                            詳細を見る
                        </Link>

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
        </div>
    )
}