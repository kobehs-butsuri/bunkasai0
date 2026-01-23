"use client";

import { motion, animate, useMotionValue } from "framer-motion";
import {ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type SlideshowProps<T> = {
    items: T[];
    renderItem: (item: T, index: number) => ReactNode;
    itemMaxWidth: number;
    gap?: number;
    intervalMs?: number;
    resumeDelayMs?: number;
};

export default function Slideshow<T>({
                                         items,
                                         renderItem,
                                         itemMaxWidth,
                                         gap = 24,
                                         intervalMs = 4000,
                                         resumeDelayMs = 5000,
                                     }: SlideshowProps<T>) {
    const LOOP = 3;
    const baseLen = items.length;
    const loopItems = Array.from({ length: LOOP }, () => items).flat();

    const baseIndex = baseLen;

    const [currentIndex, setCurrentIndex] = useState(baseIndex);
    const [displayIndex, setDisplayIndex] = useState(0);
    const [progressDuration, setProgressDuration] = useState(intervalMs);
    const [progressKey, setProgressKey] = useState(0);
    const [isProgressRunning, setIsProgressRunning] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const nextIntervalRef = useRef(intervalMs);
    const shouldResetProgressRef = useRef(true);

    const x = useMotionValue(0);
    const animatingRef = useRef(false);

    const calcOffset = useCallback((index: number, containerWidth: number) => {
        if (containerWidth >= itemMaxWidth) {
            const unit = itemMaxWidth + gap;
            return containerWidth / 2 - index * unit - itemMaxWidth / 2;
        } else {
            const unit = containerWidth + gap;
            return -index * unit;
        }
    }, [itemMaxWidth, gap]);

    useLayoutEffect(() => {
        const w = containerRef.current?.offsetWidth ?? 0;
        x.set(calcOffset(baseIndex, w));
        setDisplayIndex(0);
    }, [baseIndex, calcOffset, x]);

    useEffect(() => {
        const handleResize = () => {
            if (animatingRef.current) return;
            const w = containerRef.current?.offsetWidth ?? 0;
            x.set(calcOffset(currentIndex, w));
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [currentIndex, calcOffset, x]);

    const moveTo = useCallback((rawNext: number) => {
        if (animatingRef.current) return;

        const w = containerRef.current?.offsetWidth ?? 0;

        const nextDisplay =
            ((rawNext - baseIndex) % baseLen + baseLen) % baseLen;
        setDisplayIndex(nextDisplay);

        animatingRef.current = true;

        animate(x, calcOffset(rawNext, w), {
            type: "spring",
            stiffness: 120,
            damping: 20,
            onComplete: () => {
                let normalized = rawNext;

                if (normalized >= baseLen * 2) {
                    normalized -= baseLen;
                } else if (normalized < baseLen) {
                    normalized += baseLen;
                }

                if (normalized !== rawNext) {
                    x.set(calcOffset(normalized, w));
                }

                setCurrentIndex(normalized);
                animatingRef.current = false;
                setIsProgressRunning(true);
            },
        });
    }, [baseIndex, baseLen, calcOffset, x]);

    useEffect(() => {
        if (shouldResetProgressRef.current) {
            setProgressKey(prev => prev + 1);
            setProgressDuration(nextIntervalRef.current);
        }
        shouldResetProgressRef.current = true;

        const id = window.setTimeout(() => {
            moveTo(currentIndex + 1);
            nextIntervalRef.current = intervalMs;
        }, nextIntervalRef.current);

        return () => clearTimeout(id);
    }, [currentIndex, intervalMs, moveTo]);

    const handleUserAction = (action: () => void) => {
        nextIntervalRef.current = resumeDelayMs + intervalMs;
        setProgressKey(prev => prev + 1);
        setProgressDuration(resumeDelayMs + intervalMs);
        setIsProgressRunning(false);
        shouldResetProgressRef.current = false;
        action();
    };

    return (
        <div ref={containerRef} className="relative w-full overflow-hidden">
            <button
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 hover:bg-black/60 transition-colors"
                onClick={() => handleUserAction(() => moveTo(currentIndex - 1))}
                aria-label="Previous slide"
            >
                <ChevronLeft className="text-white" />
            </button>

            <button
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 hover:bg-black/60 transition-colors"
                onClick={() => handleUserAction(() => moveTo(currentIndex + 1))}
                aria-label="Next slide"
            >
                <ChevronRight className="text-white" />
            </button>

            <motion.div className="flex" style={{ x, gap }}>
                {loopItems.map((item, i) => (
                    <div
                        key={i}
                        className="shrink-0"
                        style={{
                            width: itemMaxWidth,
                            maxWidth: '100%'
                        }}
                    >
                        {renderItem(item, i % baseLen)}
                    </div>
                ))}
            </motion.div>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/40 px-3 py-2 backdrop-blur-sm">
                {items.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => handleUserAction(() => moveTo(baseIndex + i))}
                        className={`h-2 rounded-full transition-all ${
                            i === displayIndex
                                ? "w-4 bg-white"
                                : "w-2 bg-white/60"
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>

            <div className="absolute bottom-0 left-0 h-1 w-full">
                <div
                    key={progressKey}
                    className="h-full bg-accent"
                    style={{
                        animation: `progress ${progressDuration}ms linear`,
                        animationPlayState: isProgressRunning ? 'running' : 'paused',
                        width: '0%'
                    }}
                />
            </div>

            <style jsx>{`
                @keyframes progress {
                    from {
                        width: 0%;
                    }
                    to {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}