"use client";

import { motion, AnimatePresence } from "framer-motion";
import useCurrentTime from "@/hooks/use-current-time";
import React from "react";

type CountdownProps = {
    date: Date;

    className?: string;
};

function splitTime(diffMs: number) {
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const days = Math.floor(totalSeconds / 86400);
    return { days };
}

function pad(num: number, length: number): string[] {
    return num.toString().padStart(length, "0").split("");
}

type AnimatedDigitProps = {
    value: string;
    className?: string;
};

function AnimatedDigit({
                           value,
                           className,
                       }: AnimatedDigitProps) {
    return (
        <div className="relative inline-block overflow-hidden">
            {/* 高さ確保用ダミー */}
            <span className={`invisible inline-block ${className}`}>
                0
            </span>

            <AnimatePresence initial={false}>
                <motion.div
                    key={value}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-100%" }}
                    transition={{
                        duration: 0.25,
                        ease: "easeInOut",
                    }}
                    className={`absolute inset-0 flex items-end justify-center ${className}`}
                >
                    {value}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

type AnimatedNumberProps = {
    value: number;
    digits: number;
    className?: string;
};

function AnimatedNumber({
                            value,
                            digits,
                            className,
                        }: AnimatedNumberProps) {
    return (
        <div className="flex">
            {pad(value, digits).map((d, i) => (
                <AnimatedDigit
                    key={i}
                    value={d}
                    className={className}
                />
            ))}
        </div>
    );
}

function TimeBlock({
                       value,
                       digits,
                       className,
                   }: {
    value: number;
    digits: number;
    className?: string;
}) {
    return (
        <div className="flex items-baseline gap-[0.25em]">
            <AnimatedNumber
                value={value}
                digits={digits}
                className={className}
            />
        </div>
    );
}

export default function Countdown({
                                      date,
                                      className
                                  }: CountdownProps) {
    const now = useCurrentTime();
    const diff = date.getTime() - now.getTime();

    const { days } = splitTime(diff);

    return (
        <div className="flex font-tabular-nums">
            <TimeBlock
                value={days}
                digits={2}
                className={className}
            />
        </div>
    );
}
