"use client"

import { useState } from "react"
import Link from "next/link"
import festivalData from "@/data/festival.json"
import mapDataJson from "@/data/map.json"
import {Info, Performance, Day} from "@/data/types"
import {useSetPageTitle} from "@/hooks/page-title-context";
import { motion, AnimatePresence } from "framer-motion"

const HOUR_HEIGHT = 240
const START_HOUR = 9
const END_HOUR = 17

export default function Timetable() {
    useSetPageTitle("スケジュール")

    const [selectedDay, setSelectedDay] = useState(0)
    const [direction, setDirection] = useState(0)

    const days = festivalData.festival.days as Day[]
    const performances = festivalData.performances as Performance[]

    // 場所のユニークリストを取得
    const locations = Array.from(
        new Set(
            performances.flatMap(p => p.schedules.map(s => s.info.map(info => info.location)).flat())
        )
    ).sort()

    const timeToMinutes = (timeStr: string): number => {
        const [hours, minutes] = timeStr.split(":").map(Number)
        return hours * 60 + minutes
    }

    const getGridPosition = (locationIndex: number, schedule: Info) => {
        const startMinutes = timeToMinutes(schedule.startTime)
        const endMinutes = timeToMinutes(schedule.endTime)
        const startHourOffset = START_HOUR * 60

        const pixelsFromStart = ((startMinutes - startHourOffset) / 60) * HOUR_HEIGHT
        const durationPixels = ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT

        return {
            gridRow: `2 / span ${END_HOUR - START_HOUR}`,
            gridColumn: `${locationIndex + 2}`,
            margin: "2px",
            marginTop: `${pixelsFromStart+2}px`,
            height: `${durationPixels-4}px`,
        }
    }

    const handleDayChange = (index: number) => {
        setDirection(index > selectedDay ? 1 : -1)
        setSelectedDay(index)
    }

    const mapData = mapDataJson as Record<string, string | { label: string; keywords?: string[] }>;
    const getLabel = (roomId: string): string => {
        const data = mapData[roomId];
        return typeof data === "string" ? data : data.label;
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    }

    return (
        <div>
            {/* Day tabs */}
            <motion.div
                className="mb-8 mx-auto flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex gap-4 border-b border-accent-light pb-4">
                    {days.map((day, index) => (
                        <motion.button
                            key={day.id}
                            onClick={() => handleDayChange(index)}
                            className={`px-6 py-2 font-bold transition-all shrink-0 ${
                                selectedDay === index
                                    ? "bg-primary text-background"
                                    : "bg-card border border-accent-light text-foreground hover:bg-accent-light"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            {day.name}
                            <br />
                            <span className="text-sm">{day.date}</span>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            <div className="overflow-x-auto">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={selectedDay}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="max-w-7xl min-w-4xl mx-auto bg-card border border-accent-light"
                    >
                        <div
                            className="inline-grid min-w-full"
                            style={{
                                gridTemplateColumns: `80px repeat(${locations.length}, 1fr)`,
                                gridTemplateRows: `auto repeat(${END_HOUR - START_HOUR}, ${HOUR_HEIGHT}px)`,
                            }}
                        >

                            {/* グリッド背景(1時間ごとの区切り線) */}
                            {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => {
                                return Array.from({ length: locations.length }).map((_, locIndex) => (
                                    <div
                                        key={`grid-bg-${i}-${locIndex}`}
                                        className="border-b border-r border-accent-light opacity-30"
                                        style={{ gridRow: `${i + 2}`, gridColumn: `${locIndex + 2}` }}
                                    />
                                ))
                            })}

                            {/* イベント */}
                            {performances.map((performance) => {
                                const currentDayId = days[selectedDay].id
                                const schedule = performance.schedules.find(s => s.dayId === currentDayId)
                                if (!schedule) return null

                                return schedule.info.map((info, idx) => {
                                    const locationIndex = locations.indexOf(info.location)
                                    if (locationIndex === -1) return null

                                    const position = getGridPosition(locationIndex, info)

                                    return (
                                        <motion.div
                                            key={`perf-${performance.id}-${currentDayId}-${idx}`}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: (locationIndex * 0.05) + (idx * 0.02)
                                            }}
                                            style={position}
                                        >
                                            <Link
                                                href={`/event/${performance.id}`}
                                                className="relative bg-primary bg-opacity-20 border-l-4 border-primary p-2 transition-all hover:bg-opacity-30 cursor-pointer overflow-hidden flex flex-col justify-center items-center text-center text-background h-full group"
                                                title={performance.name}
                                            >
                                                <div className="font-bold text-xs leading-tight group-hover:scale-105 transition-transform">
                                                    {performance.name}
                                                </div>
                                                <div className="text-xs opacity-75 leading-tight">
                                                    {info.startTime} - {info.endTime}
                                                </div>
                                            </Link>
                                        </motion.div>
                                    )
                                })
                            }).flat()}

                            {/* 時間ヘッダー */}
                            <div className="sticky left-0 top-0 z-20 bg-card border-r border-b border-accent-light px-4 py-3 font-bold text-sm flex items-center justify-center">
                                時間
                            </div>

                            {/* 場所ヘッダー */}
                            {locations.map((location, index) => (
                                <motion.div
                                    key={`header-${location}`}
                                    className="top-0 z-10 bg-card border-r border-b border-accent-light px-4 py-3 font-bold text-sm text-center"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    {getLabel(location)}
                                </motion.div>
                            ))}

                            {/* 時間行ラベル */}
                            {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => {
                                const hour = START_HOUR + i
                                return (
                                    <motion.div
                                        key={`time-${hour}`}
                                        className="sticky left-0 z-10 bg-card border-r border-b border-accent-light px-4 font-bold text-sm flex items-center justify-center"
                                        style={{ gridRow: `${i + 2}` }}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: i * 0.03 }}
                                    >
                                        {String(hour).padStart(2, "0")}:00
                                    </motion.div>
                                )
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}