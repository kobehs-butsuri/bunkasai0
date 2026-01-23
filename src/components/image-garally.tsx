"use client"

import { CarouselSlider } from "@/components/carouselslider"

interface ImageGalleryProps {
    images: string[]
    className?: string
    aspectRatio?: "video" | "square" | "portrait" | "wide"
}

export function ImageGallery({ images, className, aspectRatio = "video" }: ImageGalleryProps) {
    return (
        <CarouselSlider
            items={images}
            className={className}
            aspectRatio={aspectRatio}
            showDots={true}
            showThumbnails={true}
            enableModal={true}
            imagePrefix="/image/"
        />
    )
}