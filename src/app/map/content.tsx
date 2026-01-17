"use client"

import React, {Suspense, useCallback, useEffect, useRef, useState} from "react"
import Link from "next/link"
import {MapSVG} from "@/components/map"
import festivalData from "@/data/festival.json"
import useMobile from "@/hooks/use-mobile"
import {ActionMenuButton} from "@/components/action-menu";
import { MapSearch } from "@/components/map-search"
import roomLabelsData from "@/data/map.json"
import { MapPin } from "lucide-react"
import {useSearchParams} from "next/dist/client/components/navigation";

interface Exhibition {
    id: string
    name: string
    organization: string
    type: string
    description: string
    roomId: string
}

export default function Content() {
    return (
        <Suspense>
            <MapContent/>
        </Suspense>
    )
}
function MapContent() {
    const searchParams = useSearchParams()
    const initialRoomId = searchParams.get('id') || undefined
    const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [showPopup, setShowPopup] = useState(false)
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
    const isMobile = useMobile()

    const [scale, setScale] = useState(1)
    const [baseScale, setBaseScale] = useState(1)
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
    const [isScreenModeChanged, setIsScreenModeChanged] = useState(false)

    const [activeLayer, setActiveLayer] = useState(0)

    const exhibitions = festivalData.exhibitions as Exhibition[]

    const [isLoadingCache, setIsLoadingCache] = useState(true)
    const [roomLayerCache, setRoomLayerCache] = useState<Map<string, number>>(new Map())
    const [pinnedRoomId, setPinnedRoomId] = useState<string | null>(null)
    const roomLabels = roomLabelsData as Record<string, string | { label: string; keywords?: string[] }>
    const [pinnedRoomMapPosition, setPinnedRoomMapPosition] = useState<{ x: number; y: number } | null>(null)

    const getExhibitionByRoomId = useCallback((roomId: string): Exhibition | undefined => {
        return exhibitions.find(exh => exh.roomId === roomId)
    }, [exhibitions])

    const constrainPosition = (x: number, y: number) => {
        if (!containerRef.current || !mapRef.current) return { x, y }

        const container = containerRef.current
        const map = mapRef.current

        const containerRect = container.getBoundingClientRect()
        const mapRect = map.getBoundingClientRect()

        const mapWidth = mapRect.width
        const mapHeight = mapRect.height

        const MARGIN_RATIO = 0.1

        const marginX = containerRect.width * MARGIN_RATIO
        const marginY = containerRect.height * MARGIN_RATIO

        const left = marginX
        const top = marginY
        const bottom = -mapHeight + containerRect.height - marginY
        const right = -mapWidth + containerRect.width - marginX

        const constrainedX = Math.max(right, Math.min(left, x))
        const constrainedY = Math.max(bottom, Math.min(top, y))
        return { x: constrainedX, y: constrainedY }
    }

    const zoomToRoomCached = useCallback(async (roomId: string) => {
        if (!mapRef.current || !containerRef.current) return

        const targetLayer = roomLayerCache.get(roomId)
        if (targetLayer === undefined) {
            console.error(`Room ${roomId} not found in cache`)
            return
        }

        if (activeLayer !== targetLayer) {
            setActiveLayer(targetLayer)
        }

        const waitForElement = async (id: string, timeout = 3000): Promise<HTMLElement | null> => {
            const startTime = Date.now()

            let element = document.getElementById(id)
            if (element) return element

            return new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    element = document.getElementById(id)

                    if (element) {
                        clearInterval(checkInterval)
                        resolve(element)
                    } else if (Date.now() - startTime > timeout) {
                        clearInterval(checkInterval)
                        resolve(null)
                    }
                }, 50)
            })
        }

        const roomElement = await waitForElement(roomId)

        if (!roomElement) {
            console.error(`Room element ${roomId} not found in DOM after waiting`)
            return
        }

        const container = containerRef.current
        const containerRect = container.getBoundingClientRect()

        // ピンの位置を取得（コンテナ基準）
        const roomRect = roomElement.getBoundingClientRect()
        const pinX = roomRect.left + roomRect.width / 2 - containerRect.left
        const pinY = roomRect.top + roomRect.height / 2 - containerRect.top

        // ピンの位置のマップ上での座標（スケール1.0基準）
        const pinMapX = (pinX - position.x) / scale
        const pinMapY = (pinY - position.y) / scale

        // ピンの位置を保存
        setPinnedRoomMapPosition({ x: pinMapX, y: pinMapY })

        // 部屋のサイズから目標スケールを計算
        const currentRoomWidth = roomRect.width
        const currentRoomHeight = roomRect.height
        const originalRoomWidth = currentRoomWidth / scale
        const originalRoomHeight = currentRoomHeight / scale

        const targetScale = Math.max(baseScale, Math.min(
            (containerRect.width * 0.4) / originalRoomWidth,
            (containerRect.height * 0.4) / originalRoomHeight,
            baseScale * 3
        ))

        // ピンの位置（部屋の中心）がコンテナの中心に来るように位置を計算
        const newX = containerRect.width / 2 - pinMapX * targetScale
        const newY = containerRect.height / 2 - pinMapY * targetScale

        // 新しいスケールでの制約を計算
        const map = mapRef.current
        const mapRect = map.getBoundingClientRect()

        const mapWidthOriginal = mapRect.width / scale
        const mapHeightOriginal = mapRect.height / scale

        const newMapWidth = mapWidthOriginal * targetScale
        const newMapHeight = mapHeightOriginal * targetScale

        const left = containerRect.width / 2
        const top = containerRect.height / 2
        const bottom = -newMapHeight + containerRect.height / 2
        const right = -newMapWidth + containerRect.width / 2

        const constrainedX = Math.max(right, Math.min(left, newX))
        const constrainedY = Math.max(bottom, Math.min(top, newY))

        const constrained = { x: constrainedX, y: constrainedY }

        // アニメーション付きで移動
        if (mapRef.current) {
            mapRef.current.style.transition = 'transform 0.5s ease-in-out'
        }

        setScale(targetScale)
        setPosition(constrained)

        setTimeout(() => {
            if (mapRef.current) {
                mapRef.current.style.transition = ''
            }
        }, 500)
    }, [roomLayerCache, activeLayer, position.x, position.y, scale, baseScale])


    // handleSearchSelectを定義（zoomToRoomCachedの後）
    const handleSearchSelect = useCallback((roomId: string) => {
        setPinnedRoomId(roomId)
        zoomToRoomCached(roomId)
    }, [zoomToRoomCached])

    const clearUrlParams = useCallback(() => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href)
            url.searchParams.delete('id')
            window.history.replaceState({}, '', url.pathname)
        }
    }, [])

    useEffect(() => {
        if (!pinnedRoomId && hasProcessedInitialRoom.current) {
            clearUrlParams()
        }
    }, [pinnedRoomId, clearUrlParams])

    // キャッシュ構築のuseEffect
    useEffect(() => {
        if (!isInitialized) return
        if (roomLayerCache.size > 0) return

        const buildCache = async () => {

            const cache = new Map<string, number>()

            for (let layer = 0; layer <= 5; layer++) {
                setActiveLayer(layer)
                await new Promise(resolve => setTimeout(resolve, 100))

                const elements = mapRef.current?.querySelectorAll('[id]')
                elements?.forEach(el => {
                    const id = el.id
                    if (id && !cache.has(id)) {
                        cache.set(id, layer)
                    }
                })
            }

            setRoomLayerCache(cache)
            setActiveLayer(0)

            await new Promise(resolve => setTimeout(resolve, 100))
            setIsLoadingCache(false)
        }

        buildCache()
    }, [isInitialized, roomLayerCache.size])

    const hasProcessedInitialRoom = useRef(false)
    // initialRoomIdを処理する新しいuseEffect
    useEffect(() => {
        if (!isInitialized || roomLayerCache.size === 0 || !initialRoomId) return

        // 既に処理済みの場合はスキップ
        if (hasProcessedInitialRoom.current) return

        if (pinnedRoomId === initialRoomId) return

        if (!roomLayerCache.has(initialRoomId)) {
            console.warn(`Initial room ${initialRoomId} not found in cache`)
            return
        }

        console.log('Processing initialRoomId:', initialRoomId)
        hasProcessedInitialRoom.current = true
        handleSearchSelect(initialRoomId)
    }, [isInitialized, roomLayerCache, initialRoomId, getExhibitionByRoomId, handleSearchSelect, pinnedRoomId])

    useEffect(() => {
        constrainPosition(0, 0)
        if (!containerRef.current || !mapRef.current) return

        const container = containerRef.current
        const map = mapRef.current

        const mapRect = map.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()

        if (!isInitialized) {
            const MARGIN_RATIO = 0.1
            const effectiveWidth = containerRect.width * (1 - MARGIN_RATIO * 2)
            const effectiveHeight = containerRect.height * (1 - MARGIN_RATIO * 2)

            const scaleX = effectiveWidth / mapRect.width
            const scaleY = effectiveHeight / mapRect.height
            const newScale = Math.max(scaleX, scaleY)

            setBaseScale(newScale)

            const centerX = (containerRect.width - mapRect.width * newScale) / 2
            const centerY = (containerRect.height - mapRect.height * newScale) / 2
            setScale(newScale)
            setPosition({ x: centerX, y: centerY })
            setIsInitialized(true)
            setIsScreenModeChanged(false)
            return
        }

        if (isScreenModeChanged) {
            const currentZoomRatio = scale / baseScale

            const MARGIN_RATIO = 0.1
            const effectiveWidth = containerRect.width * (1 - MARGIN_RATIO * 2)
            const effectiveHeight = containerRect.height * (1 - MARGIN_RATIO * 2)

            const mapOriginalWidth = mapRect.width / scale
            const mapOriginalHeight = mapRect.height / scale

            const scaleX = effectiveWidth / mapOriginalWidth
            const scaleY = effectiveHeight / mapOriginalHeight
            const newBaseScale = Math.min(scaleX, scaleY)

            const newScale = newBaseScale * currentZoomRatio

            const oldContainerCenterX = containerRect.width / 2
            const oldContainerCenterY = containerRect.height / 2

            const oldMapCenterX = position.x + (mapRect.width / 2)
            const oldMapCenterY = position.y + (mapRect.height / 2)

            const relativeCenterX = oldMapCenterX - oldContainerCenterX
            const relativeCenterY = oldMapCenterY - oldContainerCenterY

            const newMapWidth = mapOriginalWidth * newScale
            const newMapHeight = mapOriginalHeight * newScale

            const newMapCenterX = oldContainerCenterX + relativeCenterX
            const newMapCenterY = oldContainerCenterY + relativeCenterY

            const newX = newMapCenterX - newMapWidth / 2
            const newY = newMapCenterY - newMapHeight / 2

            const MARGIN_X = containerRect.width * MARGIN_RATIO
            const MARGIN_Y = containerRect.height * MARGIN_RATIO

            const left = MARGIN_X
            const top = MARGIN_Y
            const bottom = -newMapHeight + containerRect.height - MARGIN_Y
            const right = -newMapWidth + containerRect.width - MARGIN_X

            const constrainedX = Math.max(right, Math.min(left, newX))
            const constrainedY = Math.max(bottom, Math.min(top, newY))

            setBaseScale(newBaseScale)
            setScale(newScale)
            setPosition({ x: constrainedX, y: constrainedY })
            setIsScreenModeChanged(false)
        }
    }, [handleSearchSelect, initialRoomId, isInitialized, isScreenModeChanged, position.x, position.y, scale, baseScale])

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

    const handleRoomTouch = useCallback((roomId: string) => {
        const exhibition = getExhibitionByRoomId(roomId)
        if (!exhibition) return

        setSelectedRoomId(roomId)
        setShowPopup(true)
    }, [getExhibitionByRoomId])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault()

            const rect = container.getBoundingClientRect()
            const mouseX = e.clientX - rect.left
            const mouseY = e.clientY - rect.top

            const beforeX = (mouseX - position.x) / scale
            const beforeY = (mouseY - position.y) / scale

            const delta = e.deltaY > 0 ? 0.9 : 1.1
            const newScale = Math.max(baseScale, Math.min(baseScale * 4, scale * delta))

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
    }, [scale, position, baseScale])

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

        if (dragStart.x !== 0 || dragStart.y !== 0 || isDragging) {
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

                const constrained = constrainPosition(newX, newY)
                setPosition(constrained)
            }
        }
    }

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!hasMoved) {
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

        let centerHistory: Array<{ x: number; y: number }> = []
        const HISTORY_SIZE = 10

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 1 || e.touches.length === 2) {
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

                const touch1 = e.touches[0]
                const touch2 = e.touches[1]
                lastTouchDistance.current = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                )

                const rect = container.getBoundingClientRect()

                const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left
                const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top
                lastTouchCenter.current = {x: centerX, y: centerY}

                centerHistory = [{x: centerX, y: centerY}]

                initialPinchScale.current = scale
                initialPinchPosition.current = {x: position.x, y: position.y}
            }
        }

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 2 && lastTouchDistance.current !== null && lastTouchCenter.current && initialPinchScale.current !== null && initialPinchPosition.current !== null) {
                const touch1 = e.touches[0]
                const touch2 = e.touches[1]
                const distance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                )

                const rect = container.getBoundingClientRect()

                const currentCenterX = (touch1.clientX + touch2.clientX) / 2 - rect.left
                const currentCenterY = (touch1.clientY + touch2.clientY) / 2 - rect.top

                centerHistory.push({ x: currentCenterX, y: currentCenterY })
                if (centerHistory.length > HISTORY_SIZE) {
                    centerHistory.shift()
                }

                const avgCenterX = centerHistory.reduce((sum, c) => sum + c.x, 0) / centerHistory.length
                const avgCenterY = centerHistory.reduce((sum, c) => sum + c.y, 0) / centerHistory.length

                const scaleRatio = distance / lastTouchDistance.current
                const newScale = Math.max(baseScale, Math.min(baseScale * 4, initialPinchScale.current * scaleRatio))

                const centerDeltaX = avgCenterX - lastTouchCenter.current.x
                const centerDeltaY = avgCenterY - lastTouchCenter.current.y

                const beforeX = (lastTouchCenter.current.x - initialPinchPosition.current.x) / initialPinchScale.current
                const beforeY = (lastTouchCenter.current.y - initialPinchPosition.current.y) / initialPinchScale.current

                const newX = lastTouchCenter.current.x - beforeX * newScale + centerDeltaX
                const newY = lastTouchCenter.current.y - beforeY * newScale + centerDeltaY

                const constrained = constrainPosition(newX, newY)

                setIsDragging(true)
                setScale(newScale)
                setPosition(constrained)
                e.preventDefault();
            } else if (e.touches.length === 1 && (dragStart.x !== 0 || dragStart.y !== 0 || isDragging)) {
                const moveDistance = Math.hypot(
                    e.touches[0].clientX - touchStartPos.x,
                    e.touches[0].clientY - touchStartPos.y
                )
                if (moveDistance > 5) {
                    setIsDragging(true)
                    e.preventDefault();
                    setHasMoved(true)
                    const newX = e.touches[0].clientX - dragStart.x
                    const newY = e.touches[0].clientY - dragStart.y

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
                            handleRoomTouch(current.id)
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
    }, [scale, position, isDragging, dragStart, touchStartPos, hasMoved, possibleToDrag, getExhibitionByRoomId, handleRoomClick, handleRoomTouch, baseScale])

    const selectedExhibition = selectedRoomId ? getExhibitionByRoomId(selectedRoomId) : null
    const hoveredExhibition = hoveredRoomId ? getExhibitionByRoomId(hoveredRoomId) : null

    return (
        <>
            <div className={
                isMobile
                        ? "w-full px-4 py-3 bg-card border-b h-16 border-accent-light"
                        : "max-w-7xl mx-auto px-4 py-3 bg-card border-b h-16 border-accent-light"
            }>
                <MapSearch
                    onSelectRoom={handleSearchSelect}
                    onRemoveSelect={() => {
                        setPinnedRoomId(null)
                        setPinnedRoomMapPosition(null)
                        clearUrlParams()
                    }}
                    roomLabels={roomLabels}
                    pinnedRoomId={pinnedRoomId}
                />
            </div>

            <div
                className={
                        isMobile
                            ? "w-full h-[calc(100vh-128px)] overflow-hidden relative bg-card border-y border-accent-light"
                            : "max-w-7xl mx-auto h-[calc(100vh-144px)] overflow-hidden relative bg-card border-y border-accent-light"
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
                {isLoadingCache && (
                    <div className="absolute inset-0 bg-card/90 backdrop-blur-sm flex items-center justify-center z-30">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-lg font-medium">マップを読み込んでいます...</p>
                        </div>
                    </div>
                )}

                <div
                    ref={mapRef}
                    className="transition-all w-fit h-fit"
                    style={{
                        userSelect: 'none',
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transformOrigin: '0 0',
                        transition: (isDragging ? "None" : ""),
                        opacity: isLoadingCache ? 0.3 : 1,
                    }}
                >
                    <MapSVG layer={activeLayer} />

                    {pinnedRoomId && pinnedRoomMapPosition && (
                        <div
                            className="absolute pointer-events-none z-20"
                            style={{
                                left: `${pinnedRoomMapPosition.x}px`,
                                top: `${pinnedRoomMapPosition.y}px`,
                                transform: `translate(-50%, -100%) scale(${1 / scale})`,
                                transformOrigin: 'center bottom',
                            }}
                        >
                            <MapPin
                                className="h-8 w-8 text-red-500 drop-shadow-lg"
                                fill="currentColor"
                                style={{
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                                }}
                            />
                        </div>
                    )}
                </div>

                <span className={"absolute left-4 top-4 text-4xl text-primary/60 font-bold"}>校内マップ</span>

                <div className={`absolute ${isMobile ? "bottom-24" : "bottom-0"} right-4 z-10`}>
                    <ActionMenuButton index={activeLayer} items={[
                        {
                            label: "本館地階",
                            icon: <><code>G</code></>,
                            onClick: () => {
                                setPinnedRoomId(null)
                                setPinnedRoomMapPosition(null)
                                clearUrlParams()
                                setActiveLayer(0)
                            },
                        },
                        {
                            label: "本館1階",
                            icon: <><code>1</code></>,
                            onClick: () => {
                                setPinnedRoomId(null)
                                setPinnedRoomMapPosition(null)
                                clearUrlParams()
                                setActiveLayer(1)
                            },
                        },
                        {
                            label: "本館2階(別館1階)",
                            icon: <><code>2</code></>,
                            onClick: () => {
                                setPinnedRoomId(null)
                                setPinnedRoomMapPosition(null)
                                clearUrlParams()
                                setActiveLayer(2)
                            },
                        },
                        {
                            label: "本館3階(別館2階)",
                            icon: <><code>3</code></>,
                            onClick: () => {
                                setPinnedRoomId(null)
                                setPinnedRoomMapPosition(null)
                                clearUrlParams()
                                setActiveLayer(3)
                            },
                        },
                        {
                            label: "本館4階(別館3階)",
                            icon: <><code>4</code></>,
                            onClick: () => {
                                setPinnedRoomId(null)
                                setPinnedRoomMapPosition(null)
                                clearUrlParams()
                                setActiveLayer(4)
                            },
                        },
                        {
                            label: "別館4階",
                            icon: <><code>5</code></>,
                            onClick: () => {
                                setPinnedRoomId(null)
                                setPinnedRoomMapPosition(null)
                                clearUrlParams()
                                setActiveLayer(5)
                            },
                        },
                        {
                            label: "立体図",
                            icon: <>3D</>,
                            onClick: () => {
                                setPinnedRoomId(null)
                                setPinnedRoomMapPosition(null)
                                clearUrlParams()
                                setActiveLayer(6)
                            },
                        },
                    ]} buttonLabel={"Layers"}/>
                </div>
            </div>

            {!isMobile && hoveredRoomId && hoveredExhibition && (
                <div
                    className="fixed p-6 bg-card border border-accent-light z-60 pointer-events-none"
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

            <div
                className={`fixed inset-0 backdrop-blur-xs bg-black/75 flex items-center justify-center z-60 p-4 transition-opacity
                ${showPopup && selectedExhibition
                    ? 'opacity-100'
                    : 'opacity-0 pointer-events-none'}`}
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
                    {selectedExhibition && (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </>
    )
}