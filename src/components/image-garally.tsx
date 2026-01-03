"use client"

import { useState, useCallback, useEffect } from "react"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface ImageGalleryProps {
    images: string[]
    className?: string
    aspectRatio?: "video" | "square" | "portrait" | "wide"
}

interface ImageState {
    index: number
    direction: number
    key: number
}

const ASPECT_CLASSES = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    wide: "aspect-[21/9]",
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

export function ImageGallery({ images, className, aspectRatio = "video" }: ImageGalleryProps) {
    const [imageState, setImageState] = useState<ImageState>({ index: 0, direction: 0, key: 0 })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalState, setModalState] = useState<ImageState>({ index: 0, direction: 0, key: 0 })
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
    const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set())

    useEffect(() => {
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
            img.src = "/image/" + src
        }

        if (images[imageState.index]) {
            preloadImage(images[imageState.index])
        }

        const nextIndex = (imageState.index + 1) % images.length
        const prevIndex = (imageState.index - 1 + images.length) % images.length

        if (images[nextIndex]) preloadImage(images[nextIndex])
        if (images[prevIndex]) preloadImage(images[prevIndex])
    }, [imageState.index, images, loadedImages, loadingImages])

    useEffect(() => {
        if (!isModalOpen) return

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
            img.src = "/image/" + src
        }

        if (images[modalState.index]) {
            preloadImage(images[modalState.index])
        }

        const nextIndex = (modalState.index + 1) % images.length
        const prevIndex = (modalState.index - 1 + images.length) % images.length

        if (images[nextIndex]) preloadImage(images[nextIndex])
        if (images[prevIndex]) preloadImage(images[prevIndex])
    }, [modalState.index, images, isModalOpen, loadedImages, loadingImages])

    const swipePower = useCallback((offset: number, velocity: number) => {
        return Math.abs(offset) * velocity
    }, [])

    const navigateImage = useCallback((setState: React.Dispatch<React.SetStateAction<ImageState>>, direction: 1 | -1, length: number) => {
        setState((prev) => ({
            index: direction === 1
                ? (prev.index + 1) % length
                : (prev.index - 1 + length) % length,
            direction,
            key: prev.key + 1
        }))
    }, [])

    const jumpToImage = useCallback((setState: React.Dispatch<React.SetStateAction<ImageState>>, targetIndex: number) => {
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

    const nextImage = useCallback(() => navigateImage(setImageState, 1, images.length), [navigateImage, images.length])
    const prevImage = useCallback(() => navigateImage(setImageState, -1, images.length), [navigateImage, images.length])
    const nextModalImage = useCallback(() => navigateImage(setModalState, 1, images.length), [navigateImage, images.length])
    const prevModalImage = useCallback(() => navigateImage(setModalState, -1, images.length), [navigateImage, images.length])

    const openModal = useCallback((index: number) => {
        setModalState({ index, direction: 0, key: 0 })
        setIsModalOpen(true)
    }, [])

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
            {images.map((_, index) => (
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
                    aria-label={`Go to image ${index + 1}`}
                />
            ))}
        </div>
    ), [images])

    const renderThumbnails = useCallback((currentIndex: number, onThumbnailClick: (index: number) => void) => (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-2 overflow-x-auto px-4 py-2"
        >
            {images.map((image, index) => (
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
                    <img
                        src={"/image/" + image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                    />
                </motion.button>
            ))}
        </motion.div>
    ), [images])

    if (images.length === 0) {
        return null
    }

    return (
        <>
            <div className={cn("w-full", className)}>
                <div className="relative">
                    <div className={cn("relative overflow-hidden rounded-lg", ASPECT_CLASSES[aspectRatio])}>
                        <AnimatePresence initial={false} custom={imageState.direction}>
                            <motion.button
                                key={imageState.key}
                                custom={imageState.direction}
                                variants={SLIDE_VARIANTS}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={TRANSITION}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={1}
                                onDragEnd={(e, { offset, velocity }) =>
                                    handleSwipe(offset.x, velocity.x, nextImage, prevImage)
                                }
                                onClick={() => openModal(imageState.index)}
                                className="group absolute inset-0 h-full w-full"
                            >
                                <div className="relative h-full w-full overflow-hidden rounded-lg bg-muted">
                                    <motion.img
                                        src={"/image/" + images[imageState.index] || "/placeholder.svg"}
                                        alt={`Image ${imageState.index + 1}`}
                                        className="h-full w-full object-cover"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                        style={{
                                            opacity: isImageLoading(images[imageState.index]) ? 0 : 1
                                        }}
                                    />
                                    {isImageLoading(images[imageState.index]) && renderLoadingSpinner()}
                                </div>
                            </motion.button>
                        </AnimatePresence>

                        {images.length > 1 && (
                            <>
                                {renderNavigationButtons(prevImage, nextImage)}
                                {renderDots(imageState.index, (index) => jumpToImage(setImageState, index))}
                            </>
                        )}
                    </div>
                </div>
            </div>

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
                            style={{ paddingBottom: images.length > 1 ? '140px' : '16px' }}
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
                                            handleSwipe(offset.x, velocity.x, nextModalImage, prevModalImage)
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="relative">
                                            <img
                                                src={"/image/" + images[modalState.index] || "/placeholder.svg"}
                                                alt={`Image ${modalState.index + 1}`}
                                                className="max-h-[calc(100vh-180px)] max-w-[calc(100vw-32px)] object-contain"
                                                style={{
                                                    opacity: isImageLoading(images[modalState.index]) ? 0 : 1,
                                                    transition: "opacity 0.3s",
                                                    display: isImageLoading(images[modalState.index]) ? 'none' : 'block'
                                                }}
                                            />
                                            {isImageLoading(images[modalState.index]) && (
                                                <div className="flex items-center justify-center" style={{ width: '300px', height: '300px' }}>
                                                    <Loader2 className="h-12 w-12 animate-spin text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {images.length > 1 && renderNavigationButtons(prevModalImage, nextModalImage, true)}

                        {images.length > 1 && (
                            <div
                                className="fixed bottom-4 left-0 right-0 flex justify-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {renderThumbnails(modalState.index, (index) => jumpToImage(setModalState, index))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}