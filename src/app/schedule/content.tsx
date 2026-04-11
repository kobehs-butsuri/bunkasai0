"use client"

import Link from "next/link"
import festivalData from "@/data/festival.json"
import mapDataJson from "@/data/map.json"
import { Performance, Day } from "@/data/types"
import { useSetPageTitle } from "@/hooks/page-title-context"
import { motion } from "framer-motion"
import { TabView, Tab } from "@/components/tabview"

const START_HOUR      = 9
const END_HOUR        = 16
const BASE_PX_PER_MIN = 4
const MIN_ITEM_HEIGHT = 52
const MIN_GAP_PX      = 6

const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60  // 表示範囲の総分数

export default function Timetable() {
    useSetPageTitle("スケジュール")

    const days         = festivalData.festival.days as Day[]
    const performances = festivalData.performances as Performance[]

    const locations = Array.from(
        new Set(
            performances.flatMap(p =>
                p.schedules.flatMap(s => s.info.map(info => info.location))
            )
        )
    ).sort()

    const timeToMinutes = (t: string): number => {
        const [h, m] = t.split(":").map(Number)
        return h * 60 + m
    }

    const buildTimeScale = (dayId: string): {
        pxPerMin: Float32Array
        totalPx: number
        minuteToPx: (min: number) => number
    } => {
        const pxPerMin = new Float32Array(TOTAL_MINUTES).fill(BASE_PX_PER_MIN)
        const offset   = START_HOUR * 60

        // 全イベントを収集
        performances.forEach(perf => {
            const sched = perf.schedules.find(s => s.dayId === dayId)
            if (!sched) return
            sched.info.forEach(info => {
                const startMin = timeToMinutes(info.startTime) - offset
                const endMin   = timeToMinutes(info.endTime)   - offset
                if (startMin < 0 || endMin > TOTAL_MINUTES || startMin >= endMin) return

                const durationMin = endMin - startMin
                // この区間を均等描画した場合に必要な 1分あたりpx
                const requiredPxPerMin = (MIN_ITEM_HEIGHT + MIN_GAP_PX) / durationMin

                if (requiredPxPerMin > BASE_PX_PER_MIN) {
                    // 必要な区間を引き伸ばす
                    for (let m = startMin; m < endMin; m++) {
                        if (requiredPxPerMin > pxPerMin[m]) {
                            pxPerMin[m] = requiredPxPerMin
                        }
                    }
                }
            })
        })

        // 累積px配列を作る: cumPx[i] = 分 (offset + i) の px 位置
        const cumPx = new Float32Array(TOTAL_MINUTES + 1)
        cumPx[0] = 0
        for (let i = 0; i < TOTAL_MINUTES; i++) {
            cumPx[i + 1] = cumPx[i] + pxPerMin[i]
        }

        const minuteToPx = (absoluteMin: number): number => {
            const rel = absoluteMin - offset
            const clamped = Math.max(0, Math.min(TOTAL_MINUTES, rel))
            const flr = Math.floor(clamped)
            const frac = clamped - flr
            if (flr >= TOTAL_MINUTES) return cumPx[TOTAL_MINUTES]
            return cumPx[flr] + frac * pxPerMin[flr]
        }

        return {
            pxPerMin,
            totalPx: cumPx[TOTAL_MINUTES],
            minuteToPx,
        }
    }

    const mapData = mapDataJson as Record<string, string | { label: string; keywords?: string[] }>
    const getLabel = (roomId: string): string => {
        const d = mapData[roomId]
        return typeof d === "string" ? d : d.label
    }

    const renderTimetableContent = (dayId: string) => {
        const { totalPx, minuteToPx } = buildTimeScale(dayId)

        // XX:00 の時刻ラベルのpx位置
        const hourPositions = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => ({
            hour: START_HOUR + i,
            px:   minuteToPx((START_HOUR + i) * 60),
        }))

        return (
            <div className="overflow-x-auto overflow-y-clip">
                <div className="min-w-4xl">
                    <div
                        className="inline-grid min-w-full"
                        style={{
                            gridTemplateColumns: `80px repeat(${locations.length}, 1fr)`,
                        }}
                    >
                        {/* ── ヘッダー行 ── */}
                        <div className="sticky left-0 top-0 z-20 bg-card border-r border-b border-accent-light px-4 py-3 font-bold text-sm flex items-center justify-center">
                            時間
                        </div>
                        {locations.map((loc, idx) => (
                            <motion.div
                                key={`header-${loc}`}
                                className="top-0 z-10 bg-card border-r border-b border-accent-light px-4 py-3 font-bold text-sm text-center"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.15, delay: idx * 0.01 }}
                            >
                                {getLabel(loc)}
                            </motion.div>
                        ))}

                        {/* ── タイムライン本体 ── */}

                        {/* 時間ラベル列 */}
                        <div
                            className="sticky left-0 z-10 bg-card border-r border-accent-light"
                            style={{ height: `${totalPx}px` }}
                        >
                            {hourPositions.slice(0, -1).map(({ hour, px }) => (
                                <motion.div
                                    key={`time-${hour}`}
                                    className="absolute w-full border-b border-accent-light opacity-30 pointer-events-none"
                                    style={{ top: `${px}px`, height: `1px` }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.3 }}
                                    transition={{ duration: 0.3 }}
                                />
                            ))}
                            {hourPositions.map(({ hour, px }) => (
                                <motion.div
                                    key={`label-${hour}`}
                                    className="absolute w-full px-4 font-bold text-sm flex items-center justify-center"
                                    style={{ top: `${px}px`, transform: "translateY(-50%)" }}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {String(hour).padStart(2, "0")}:00
                                </motion.div>
                            ))}
                        </div>

                        {/* イベント列 */}
                        {locations.map((loc, locIdx) => (
                            <div
                                key={`col-${loc}`}
                                className="border-r border-accent-light relative"
                                style={{ height: `${totalPx}px` }}
                            >
                                {/* 時間グリッド線 */}
                                {hourPositions.slice(0, -1).map(({ hour, px }) => (
                                    <div
                                        key={`grid-${loc}-${hour}`}
                                        className="absolute w-full border-b border-accent-light opacity-30 pointer-events-none"
                                        style={{ top: `${px}px` }}
                                    />
                                ))}

                                {/* この列のイベント */}
                                {performances.map(perf => {
                                    const sched = perf.schedules.find(s => s.dayId === dayId)
                                    if (!sched) return null

                                    return sched.info.map((info, idx) => {
                                        if (info.location !== loc) return null

                                        const topPx    = minuteToPx(timeToMinutes(info.startTime))
                                        const bottomPx = minuteToPx(timeToMinutes(info.endTime))
                                        const heightPx = Math.max(bottomPx - topPx, MIN_ITEM_HEIGHT)

                                        return (
                                            <motion.div
                                                key={`${perf.id}-${dayId}-${idx}`}
                                                className="absolute left-1 right-1"
                                                style={{
                                                    top:    `${topPx}px`,
                                                    height: `${heightPx}px`,
                                                }}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.15, delay: locIdx * 0.01 }}
                                            >
                                                {perf.id!="" && (
                                                    <Link
                                                        href={`/event/${perf.id}`}
                                                        className="absolute inset-0 bg-primary bg-opacity-20 border-l-4 border-primary p-2 transition-all hover:bg-opacity-30 cursor-pointer overflow-hidden flex flex-col justify-center items-center text-center text-background group"
                                                        title={perf.name}
                                                    >
                                                        <div
                                                            className="font-bold text-xs leading-tight group-hover:scale-105 transition-transform">
                                                            {perf.name}
                                                        </div>
                                                        <div className="text-xs opacity-75 leading-tight">
                                                            {info.startTime} - {info.endTime}
                                                        </div>
                                                    </Link>
                                                )
                                                }
                                                {perf.id=="" && (
                                                    <div
                                                        className="absolute inset-0 bg-primary bg-opacity-20 border-l-4 border-primary p-2 transition-all hover:bg-opacity-30 cursor-pointer overflow-hidden flex flex-col justify-center items-center text-center text-background group"
                                                    >
                                                        <div
                                                            className="font-bold text-xs leading-tight group-hover:scale-105 transition-transform">
                                                            {perf.name}
                                                        </div>
                                                        <div className="text-xs opacity-75 leading-tight">
                                                            {info.startTime} - {info.endTime}
                                                        </div>
                                                    </div>
                                                )
                                                }
                                            </motion.div>
                                        )
                                    })
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    const tabs: Tab[] = days.map((day) => ({
        id:       day.id,
        label:    day.name,
        subtitle: day.date,
        content:  renderTimetableContent(day.id),
    }))

    return (
        <div className="max-w-7xl mx-auto">
            <TabView tabs={tabs} defaultTabIndex={0} />
        </div>
    )
}