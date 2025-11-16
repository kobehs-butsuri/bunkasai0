"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import festivalData from "@/data/festival.json"
import {Info, Performance, Day} from "@/data/types"

const HOUR_HEIGHT = 240
const START_HOUR = 9
const END_HOUR = 17

export default function Timetable() {
    const [selectedDay, setSelectedDay] = useState(0)

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

    return (
        <div className="bg-background text-foreground">
            <Header />

            <main className="pt-32 pb-24 px-8 max-w-full mx-auto">
                <div className="mb-12 pt-8 max-w-7xl mx-auto">
                    <h1 className="text-5xl font-bold mb-4 tracking-tight text-balance">タイムテーブル</h1>
                </div>

                {/* Day tabs */}
                <div className="mb-8 max-w-7xl mx-auto">
                    <div className="flex gap-4 border-b border-accent-light pb-4 overflow-x-auto">
                        {days.map((day, index) => (
                            <button
                                key={day.id}
                                onClick={() => setSelectedDay(index)}
                                className={`px-6 py-2 font-bold transition-all flex-shrink-0 ${
                                    selectedDay === index
                                        ? "bg-primary text-background"
                                        : "bg-card border border-accent-light text-foreground hover:bg-accent-light"
                                }`}
                            >
                                {day.name}
                                <br />
                                <span className="text-sm">{day.date}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <div className="max-w-7xl min-w-4xl mx-auto bg-card border border-accent-light">
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
                                        <Link
                                            key={`perf-${performance.id}-${currentDayId}-${idx}`}
                                            href={`/event/${performance.id}`}
                                            className="relative bg-primary bg-opacity-20 border-l-4 border-primary p-2 transition-all hover:bg-opacity-30 cursor-pointer overflow-hidden flex flex-col justify-center items-center text-center text-background z-10"
                                            style={position}
                                            title={performance.name}
                                        >
                                            <div className="font-bold text-xs leading-tight">{performance.name}</div>
                                            <div className="text-xs opacity-75 leading-tight">
                                                {info.startTime} - {info.endTime}
                                            </div>
                                        </Link>
                                    )
                                })
                            }).flat()}

                            {/* 時間ヘッダー */}
                            <div className="sticky left-0 top-0 z-20 bg-card border-r border-b border-accent-light px-4 py-3 font-bold text-sm flex items-center justify-center">
                                時間
                            </div>

                            {/* 場所ヘッダー */}
                            {locations.map((location) => (
                                <div
                                    key={`header-${location}`}
                                    className="top-0 z-10 bg-card border-r border-b border-accent-light px-4 py-3 font-bold text-sm text-center"
                                >
                                    {location}
                                </div>
                            ))}

                            {/* 時間行ラベル */}
                            {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => {
                                const hour = START_HOUR + i
                                return (
                                    <div
                                        key={`time-${hour}`}
                                        className="sticky left-0 z-10 bg-card border-r border-b border-accent-light px-4 font-bold text-sm flex items-center justify-center"
                                        style={{ gridRow: `${i + 2}` }}
                                    >
                                        {String(hour).padStart(2, "0")}:00
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}