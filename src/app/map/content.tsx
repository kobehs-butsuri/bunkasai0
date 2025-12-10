"use client"

import React, {useCallback, useEffect, useRef, useState} from "react"
import Link from "next/link"
import {MapSVG} from "@/components/map"
import festivalData from "@/data/festival.json"
import useMobile from "@/hooks/use-mobile"
import {useSetPageTitle} from "@/hooks/page-title-context";
import {Maximize, Minimize} from "lucide-react";

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

    const [isFullscreen, setIsFullscreen] = useState(false)

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
    const [isScreenModeChanged, setIsScreenModeChanged] = useState(false)

    const exhibitions = festivalData.exhibitions as Exhibition[]

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const runTimeoutOnce = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setShowScrollOverlay(0);
            timeoutRef.current = null;
        }, 1500);
    };

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

        const left = containerRect.width / 2
        const top = containerRect.height / 2
        const bottom = -mapHeight + containerRect.height / 2
        const right = -mapWidth + containerRect.width / 2

        const constrainedX = Math.max(right, Math.min(left, x))
        const constrainedY = Math.max(bottom, Math.min(top, y))
        return { x: constrainedX, y: constrainedY }
    }

    useEffect(() => {
        constrainPosition(0, 0)
        if (!containerRef.current || !mapRef.current || isInitialized || isScreenModeChanged) return

        const container = containerRef.current
        const map = mapRef.current

        const mapRect = map.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()

        const scaledWidth = containerRect.width * scale
        const scaledHeight = containerRect.height * scale

        const scaleX = scaledWidth / mapRect.width * scale
        const scaleY = scaledHeight / mapRect.height * scale
        const newScale = Math.min(scaleX, scaleY) * 0.95

        if (!isInitialized){
            const centerX = (containerRect.width - mapRect.width / scale * newScale) / 2
            const centerY = (containerRect.height - mapRect.height / scale * newScale) / 2
            setScale(newScale)
            setPosition({ x: centerX, y: centerY })
            setIsInitialized(true)
            setIsScreenModeChanged(false)
            return
        }

        const left = containerRect.width / 2
        const top = containerRect.height / 2
        const bottom = -scaledHeight + containerRect.height / 2
        const right = -scaledWidth + containerRect.width / 2


        const constrainedX = Math.max(right, Math.min(left, position.x / scale * newScale))
        const constrainedY = Math.max(bottom, Math.min(top, position.y / scale * newScale))

        setScale(newScale)
        setPosition({ x: constrainedX, y: constrainedY })
        setIsInitialized(true)
    }, [isFullscreen, isInitialized, isScreenModeChanged, isMobile, position.x, position.y, scale])

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
        if (showScrollOverlay !== 0) return
        const exhibition = getExhibitionByRoomId(roomId)
        if (!exhibition) return

        if (isMobile) {
            setSelectedRoomId(roomId)
            setShowPopup(true)
        } else {
            window.location.href = `/event/${exhibition.id}`
        }
    }, [showScrollOverlay, getExhibitionByRoomId, isMobile])

    const handleRoomTouch = useCallback((roomId: string) => {
        if (showScrollOverlay !== 0) return
        const exhibition = getExhibitionByRoomId(roomId)
        if (!exhibition) return

        setSelectedRoomId(roomId)
        setShowPopup(true)
    }, [showScrollOverlay, getExhibitionByRoomId])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleWheel = (e: WheelEvent) => {
            if (!e.ctrlKey && !e.metaKey && !isFullscreen) {
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
    }, [scale, position, isFullscreen])

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
                const newScale = Math.max(0.5, Math.min(4, initialPinchScale.current * scaleRatio))

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
                    if (!isDragging && !isFullscreen) {
                        setShowScrollOverlay(2)
                        runTimeoutOnce();
                        return
                    }
                    if (isFullscreen) {
                        setIsDragging(true)
                        e.preventDefault();
                    }
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
    }, [scale, position, isDragging, isFullscreen, dragStart, touchStartPos, hasMoved, possibleToDrag, getExhibitionByRoomId, handleRoomClick, handleRoomTouch])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFullscreen) {
                setIsScreenModeChanged(true)
                setIsFullscreen(false)
            }
        }

        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [isFullscreen])

    const selectedExhibition = selectedRoomId ? getExhibitionByRoomId(selectedRoomId) : null
    const hoveredExhibition = hoveredRoomId ? getExhibitionByRoomId(hoveredRoomId) : null

    return (
        <div>
            <div
                className={
                    isFullscreen
                        ? "fixed inset-0 z-50 overflow-hidden bg-card"
                        : (isMobile
                            ? "w-full h-[60vh] overflow-hidden relative bg-card border-y border-accent-light"
                            : "max-w-7xl mx-auto h-[60vh] overflow-hidden relative bg-card border-y border-accent-light")
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

                <button
                    onClick={() => {
                        setIsScreenModeChanged(true)
                        setIsFullscreen(!isFullscreen)
                    }}
                    className="absolute top-4 right-4 z-10 bg-card border border-accent-light p-3 hover:bg-accent-light transition-colors shadow-lg cursor-pointer"
                    title={isFullscreen ? "通常表示" : "全画面表示"}
                >
                    {isFullscreen ? (
                        <Minimize className={"h-5 w-5"}/>
                    ) : (
                        <Maximize className={"h-5 w-5"}/>
                    )}
                </button>

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

            <div
                className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity
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
        </div>
    )
}