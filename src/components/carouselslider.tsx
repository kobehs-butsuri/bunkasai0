"use client"

import { useState, useCallback, useEffect, ReactNode } from "react"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface CarouselSliderProps<T = any> {
    items: T[]
    className?: string
    aspectRatio?: "video" | "square" | "portrait" | "wide" | "auto"
    showDots?: boolean
    showThumbnails?: boolean
    enableModal?: boolean
    imagePrefix?: string
    renderItem?: (item: T, index: number) => ReactNode
    onItemChange?: (index: number) => void
}

interface SlideState {
    index: number
    direction: number
    key: number
}

const ASPECT_CLASSES = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    wide: "aspect-[21/9]",
    auto: "",
} as const

const SLIDE_VARIANTS = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
    })
}

const TRANSITION = {
    x: { type: "spring" as const, stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 }
}

const SWIPE_CONFIDENCE_THRESHOLD = 10000

export function CarouselSlider<T = any>({
                                            items,
                                            className,
                                            aspectRatio = "video",
                                            showDots = true,
                                            showThumbnails = false,
                                            enableModal = false,
                                            imagePrefix = "/image/",
                                            renderItem,
                                            onItemChange
                                        }: CarouselSliderProps<T>) {
    const [slideState, setSlideState] = useState<SlideState>({ index: 0, direction: 0, key: 0 })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalState, setModalState] = useState<SlideState>({ index: 0, direction: 0, key: 0 })
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
    const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set())

    const isStringArray = items.length > 0 && typeof items[0] === 'string'

    useEffect(() => {
        if (!isStringArray) return

        const preloadImage = (src: string) => {
            if (loadedImages.has(src) || loadingImages.has(src)) return

            setLoadingImages(prev => new Set(prev).add(src))

            const img = new Image()
            img.onload = () => {
                setLoadedImages(prev => new Set(prev).add(src))
                setLoadingImages(prev => {
                    const next = new Set(prev)
                    next.delete(src)
                    return next
                })
            }
            img.onerror = () => {
                setLoadingImages(prev => {
                    const next = new Set(prev)
                    next.delete(src)
                    return next
                })
            }
            img.src = imagePrefix + src
        }

        if (items[slideState.index]) {
            preloadImage(items[slideState.index] as string)
        }

        const nextIndex = (slideState.index + 1) % items.length
        const prevIndex = (slideState.index - 1 + items.length) % items.length

        if (items[nextIndex]) preloadImage(items[nextIndex] as string)
        if (items[prevIndex]) preloadImage(items[prevIndex] as string)
    }, [slideState.index, items, loadedImages, loadingImages, isStringArray, imagePrefix])

    useEffect(() => {
        if (!isModalOpen || !isStringArray) return

        const preloadImage = (src: string) => {
            if (loadedImages.has(src) || loadingImages.has(src)) return

            setLoadingImages(prev => new Set(prev).add(src))

            const img = new Image()
            img.onload = () => {
                setLoadedImages(prev => new Set(prev).add(src))
                setLoadingImages(prev => {
                    const next = new Set(prev)
                    next.delete(src)
                    return next
                })
            }
            img.onerror = () => {
                setLoadingImages(prev => {
                    const next = new Set(prev)
                    next.delete(src)
                    return next
                })
            }
            img.src = imagePrefix + src
        }

        if (items[modalState.index]) {
            preloadImage(items[modalState.index] as string)
        }

        const nextIndex = (modalState.index + 1) % items.length
        const prevIndex = (modalState.index - 1 + items.length) % items.length

        if (items[nextIndex]) preloadImage(items[nextIndex] as string)
        if (items[prevIndex]) preloadImage(items[prevIndex] as string)
    }, [modalState.index, items, isModalOpen, loadedImages, loadingImages, isStringArray, imagePrefix])

    const swipePower = useCallback((offset: number, velocity: number) => {
        return Math.abs(offset) * velocity
    }, [])

    const navigateSlide = useCallback((setState: React.Dispatch<React.SetStateAction<SlideState>>, direction: 1 | -1, length: number) => {
        setState((prev) => {
            const newIndex = direction === 1
                ? (prev.index + 1) % length
                : (prev.index - 1 + length) % length
            return {
                index: newIndex,
                direction,
                key: prev.key + 1
            }
        })
    }, [])

    const jumpToSlide = useCallback((setState: React.Dispatch<React.SetStateAction<SlideState>>, targetIndex: number) => {
        setState((prev) => {
            if (prev.index === targetIndex) {
                return prev
            }
            return {
                index: targetIndex,
                direction: targetIndex > prev.index ? 1 : -1,
                key: prev.key + 1
            }
        })
    }, [])

    const nextSlide = useCallback(() => {
        navigateSlide(setSlideState, 1, items.length)
        onItemChange?.(slideState.index + 1 < items.length ? slideState.index + 1 : 0)
    }, [navigateSlide, items.length, onItemChange, slideState.index])

    const prevSlide = useCallback(() => {
        navigateSlide(setSlideState, -1, items.length)
        onItemChange?.(slideState.index - 1 >= 0 ? slideState.index - 1 : items.length - 1)
    }, [navigateSlide, items.length, onItemChange, slideState.index])

    const nextModalSlide = useCallback(() => navigateSlide(setModalState, 1, items.length), [navigateSlide, items.length])
    const prevModalSlide = useCallback(() => navigateSlide(setModalState, -1, items.length), [navigateSlide, items.length])

    const openModal = useCallback((index: number) => {
        if (!enableModal) return
        setModalState({ index, direction: 0, key: 0 })
        setIsModalOpen(true)
    }, [enableModal])

    const closeModal = useCallback(() => setIsModalOpen(false), [])

    const handleSwipe = useCallback((
        offset: number,
        velocity: number,
        onNext: () => void,
        onPrev: () => void
    ) => {
        const swipe = swipePower(offset, velocity)
        if (swipe < -SWIPE_CONFIDENCE_THRESHOLD) {
            onNext()
        } else if (swipe > SWIPE_CONFIDENCE_THRESHOLD) {
            onPrev()
        }
    }, [swipePower])

    const isImageLoading = useCallback((imageSrc: string) => {
        return !loadedImages.has(imageSrc) || loadingImages.has(imageSrc)
    }, [loadedImages, loadingImages])

    const renderLoadingSpinner = () => (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )

    const renderNavigationButtons = useCallback((onPrev: () => void, onNext: () => void, isFixed = false) => (
        <>
            <Button
                variant="secondary"
                size="icon"
                className={cn(
                    "rounded-full shadow-lg z-10 transition-transform hover:scale-110 active:scale-90",
                    isFixed ? "fixed left-4 top-1/2 -translate-y-1/2" : "absolute left-2 top-1/2 -translate-y-1/2"
                )}
                onClick={(e) => {
                    if (isFixed) e.stopPropagation()
                    onPrev()
                }}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
                variant="secondary"
                size="icon"
                className={cn(
                    "rounded-full shadow-lg z-10 transition-transform hover:scale-110 active:scale-90",
                    isFixed ? "fixed right-4 top-1/2 -translate-y-1/2" : "absolute right-2 top-1/2 -translate-y-1/2"
                )}
                onClick={(e) => {
                    if (isFixed) e.stopPropagation()
                    onNext()
                }}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </>
    ), [])

    const renderDots = useCallback((currentIndex: number, onDotClick: (index: number) => void) => (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-black/40 px-3 py-2 backdrop-blur-sm">
            {items.map((_, index) => (
                <motion.button
                    key={index}
                    onClick={() => onDotClick(index)}
                    className={cn(
                        "h-2 rounded-full transition-all",
                        index === currentIndex ? "bg-white" : "bg-white/60 hover:bg-white/80",
                    )}
                    animate={{
                        width: index === currentIndex ? 16 : 8
                    }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.2 }}
                    aria-label={`Go to item ${index + 1}`}
                />
            ))}
        </div>
    ), [items])

    const renderThumbnails = useCallback((currentIndex: number, onThumbnailClick: (index: number) => void) => (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-2 overflow-x-auto px-4 py-2"
        >
            {items.map((item, index) => (
                <motion.button
                    key={index}
                    onClick={() => onThumbnailClick(index)}
                    className={cn(
                        "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg transition-all",
                        index === currentIndex
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-black"
                            : "opacity-60 hover:opacity-100",
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isStringArray ? (
                        <img
                            src={imagePrefix + (item as string) || "/placeholder.svg"}
                            alt={`Thumbnail ${index + 1}`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-muted">
                            {index + 1}
                        </div>
                    )}
                </motion.button>
            ))}
        </motion.div>
    ), [items, isStringArray, imagePrefix])

    const renderContent = useCallback((item: T, index: number, isModal = false): ReactNode => {
        if (renderItem) {
            return renderItem(item, index)
        }

        if (isStringArray) {
            return (
                <div className="relative h-full w-full overflow-hidden rounded-lg bg-muted">
                    <motion.img
                        src={imagePrefix + (item as string) || "/placeholder.svg"}
                        alt={`Image ${index + 1}`}
                        className={cn(
                            "h-full w-full object-cover",
                            isModal && "object-contain max-h-[calc(100vh-180px)] max-w-[calc(100vw-32px)]"
                        )}
                        whileHover={!isModal ? { scale: 1.05 } : {}}
                        transition={{ duration: 0.3 }}
                        style={{
                            opacity: isImageLoading(item as string) ? 0 : 1,
                            display: isModal && isImageLoading(item as string) ? 'none' : 'block'
                        }}
                    />
                    {isImageLoading(item as string) && renderLoadingSpinner()}
                </div>
            )
        }

        return <>{item as ReactNode}</>
    }, [renderItem, isStringArray, imagePrefix, isImageLoading])

    if (items.length === 0) {
        return null
    }

    return (
        <>
            <div className={cn("w-full", className)}>
                <div className="relative">
                    <div className={cn(
                        "relative rounded-lg",
                        aspectRatio !== "auto" ? cn("overflow-hidden", ASPECT_CLASSES[aspectRatio]) : "overflow-x-hidden grid"
                    )}>
                        <AnimatePresence initial={false} custom={slideState.direction}>
                            <motion.div
                                key={slideState.key}
                                custom={slideState.direction}
                                variants={SLIDE_VARIANTS}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={TRANSITION}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={1}
                                onDragEnd={(e, { offset, velocity }) =>
                                    handleSwipe(offset.x, velocity.x, nextSlide, prevSlide)
                                }
                                onClick={() => enableModal && openModal(slideState.index)}
                                className={cn(
                                    aspectRatio === "auto" ? "col-start-1 row-start-1 w-full overflow-hidden" : "absolute inset-0 h-full w-full overflow-hidden",
                                    enableModal && "cursor-pointer group"
                                )}
                            >
                                {renderContent(items[slideState.index], slideState.index)}
                            </motion.div>
                        </AnimatePresence>

                        {items.length > 1 && (
                            <>
                                {renderNavigationButtons(prevSlide, nextSlide)}
                                {showDots && renderDots(slideState.index, (index) => jumpToSlide(setSlideState, index))}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {enableModal && (
                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-70 bg-black/90"
                            onClick={closeModal}
                        >
                            <div
                                className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none"
                                style={{ paddingBottom: items.length > 1 && showThumbnails ? '140px' : '16px' }}
                            >
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <AnimatePresence initial={false} custom={modalState.direction}>
                                        <motion.div
                                            key={modalState.key}
                                            custom={modalState.direction}
                                            variants={SLIDE_VARIANTS}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            transition={TRANSITION}
                                            className="absolute flex items-center justify-center pointer-events-auto"
                                            drag="x"
                                            dragConstraints={{ left: 0, right: 0 }}
                                            dragElastic={1}
                                            onDragEnd={(e, { offset, velocity }) =>
                                                handleSwipe(offset.x, velocity.x, nextModalSlide, prevModalSlide)
                                            }
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="relative">
                                                {renderContent(items[modalState.index], modalState.index, true)}
                                                {isStringArray && isImageLoading(items[modalState.index] as string) && (
                                                    <div className="flex items-center justify-center" style={{ width: '300px', height: '300px' }}>
                                                        <Loader2 className="h-12 w-12 animate-spin text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>

                            {items.length > 1 && renderNavigationButtons(prevModalSlide, nextModalSlide, true)}

                            {items.length > 1 && showThumbnails && (
                                <div
                                    className="fixed bottom-4 left-0 right-0 flex justify-center"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {renderThumbnails(modalState.index, (index) => jumpToSlide(setModalState, index))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </>
    )
}