"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface ImageGalleryProps {
    images: string[]
    className?: string
    aspectRatio?: "video" | "square" | "portrait" | "wide"
}

export function ImageGallery({ images, className, aspectRatio = "video" }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalIndex, setModalIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    const aspectClasses = {
        video: "aspect-video",
        square: "aspect-square",
        portrait: "aspect-[3/4]",
        wide: "aspect-[21/9]",
    }

    const slideVariants = {
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

    const swipeConfidenceThreshold = 10000
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity
    }

    const nextImage = () => {
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setDirection(-1)
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    const nextModalImage = () => {
        setDirection(1)
        setModalIndex((prev) => (prev + 1) % images.length)
    }

    const prevModalImage = () => {
        setDirection(-1)
        setModalIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    const openModal = (index: number) => {
        setModalIndex(index)
        setIsModalOpen(true)
    }

    if (images.length === 0) {
        return null
    }

    return (
        <>
            <div className={cn("w-full", className)}>
                <div className="relative">
                    <div className={cn("relative overflow-hidden rounded-lg", aspectClasses[aspectRatio])}>
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.button
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={1}
                                onDragEnd={(e, { offset, velocity }) => {
                                    const swipe = swipePower(offset.x, velocity.x)

                                    if (swipe < -swipeConfidenceThreshold) {
                                        nextImage()
                                    } else if (swipe > swipeConfidenceThreshold) {
                                        prevImage()
                                    }
                                }}
                                onClick={() => openModal(currentIndex)}
                                className="group absolute inset-0 h-full w-full"
                            >
                                <div className="relative h-full w-full overflow-hidden rounded-lg bg-muted">
                                    <motion.img
                                        src={"/image/" + images[currentIndex] || "/placeholder.svg"}
                                        alt={`Image ${currentIndex + 1}`}
                                        className="h-full w-full object-cover"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </motion.button>
                        </AnimatePresence>

                        {images.length > 1 && (
                            <>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-90"
                                    onClick={prevImage}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-90"
                                    onClick={nextImage}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </>
                        )}

                        {images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-black/40 px-3 py-2 backdrop-blur-sm">
                                {images.map((_, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => {
                                            setDirection(index > currentIndex ? 1 : -1)
                                            setCurrentIndex(index)
                                        }}
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
                        className="fixed inset-0 z-50 bg-black/90"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <div className="relative flex h-full w-full flex-col items-center justify-center p-4">
                            <div className="relative flex flex-1 w-full max-w-7xl items-center justify-center mb-24">
                                <AnimatePresence initial={false} custom={direction}>
                                    <motion.img
                                        key={modalIndex}
                                        custom={direction}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{
                                            x: { type: "spring", stiffness: 300, damping: 30 },
                                            opacity: { duration: 0.2 }
                                        }}
                                        src={"/image/" + images[modalIndex] || "/placeholder.svg"}
                                        alt={`Image ${modalIndex + 1}`}
                                        className="max-h-full max-w-full object-contain absolute"
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={1}
                                        onDragEnd={(e, { offset, velocity }) => {
                                            const swipe = swipePower(offset.x, velocity.x)

                                            if (swipe < -swipeConfidenceThreshold) {
                                                nextModalImage()
                                            } else if (swipe > swipeConfidenceThreshold) {
                                                prevModalImage()
                                            }
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </AnimatePresence>
                            </div>

                            {images.length > 1 && (
                                <>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="fixed left-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg z-10 transition-transform hover:scale-110 active:scale-90"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            prevModalImage()
                                        }}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="fixed right-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg z-10 transition-transform hover:scale-110 active:scale-90"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            nextModalImage()
                                        }}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>

                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="fixed bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-2 overflow-x-auto px-4 py-2 max-w-full"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {images.map((image, index) => (
                                            <motion.button
                                                key={index}
                                                onClick={() => {
                                                    setDirection(index > modalIndex ? 1 : -1)
                                                    setModalIndex(index)
                                                }}
                                                className={cn(
                                                    "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg transition-all",
                                                    index === modalIndex
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
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}