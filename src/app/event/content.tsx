"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import festivalData from "@/data/festival.json"
import mapDataJson from "@/data/map.json"
import {Performance, Exhibition, UnifiedEvent, Day} from "@/data/types";
import {useSetPageTitle} from "@/hooks/page-title-context";
import { motion, AnimatePresence } from "framer-motion"

export default function EventsPage() {
    useSetPageTitle("イベント")

    const performances = festivalData.performances as Performance[]
    const exhibitions = festivalData.exhibitions as Exhibition[]
    const days = festivalData.festival.days as Day[]

    // 舞台と展示を統合
    const allEvents: UnifiedEvent[] = useMemo(() => {
        const perfEvents: UnifiedEvent[] = performances.map(p => ({
            ...p,
            category: 'performance' as const
        }))
        const exhEvents: UnifiedEvent[] = exhibitions.map(e => ({
            ...e,
            category: 'exhibition' as const
        }))
        return [...perfEvents, ...exhEvents]
    }, [performances, exhibitions])

    const [searchTerm, setSearchTerm] = useState("")
    const [filterOrganization, setFilterOrganization] = useState("")
    const [filterDay, setFilterDay] = useState("")
    const [filterCategory, setFilterCategory] = useState("")

    const organizations = [...new Set(allEvents.map((e) => e.organization))].sort()
    const mapData = mapDataJson as Record<string, string>;

    const filteredEvents = allEvents.filter((event) => {
        const matchesSearch =
            event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesOrg = !filterOrganization || event.organization === filterOrganization
        const matchesCategory = !filterCategory || event.category === filterCategory

        // 舞台の場合は日程フィルタを適用
        const matchesDay = !filterDay ||
            (event.category === 'performance' && event.schedules?.some(s => s.dayId === filterDay)) ||
            event.category === 'exhibition' // 展示は日程フィルタ無視

        return matchesSearch && matchesOrg && matchesDay && matchesCategory
    })

    // スケジュール情報を取得するヘルパー関数
    const getScheduleInfo = (event: UnifiedEvent) => {
        if (event.category === 'exhibition') {
            return <span className="font-bold">常設展示</span>
        }

        if (!event.schedules || event.schedules.length === 0) {
            return <span className="font-bold">時間未定</span>
        }

        const scheduleTexts = event.schedules.map(schedule => {
            const day = days.find(d => d.id === schedule.dayId);
            return (
                <span key={schedule.dayId}>
                    <span className="font-bold">{day?.name}: </span>
                    {schedule.info.map((info, idx) =>
                        (
                            <span key={`${event.id}-${schedule.dayId}-${idx}-time-pos`}>
                                {idx !== 0 && ", "}{info.startTime} - {info.endTime} <span className="font-bold">@{mapData[info.location]}</span>
                            </span>
                        )
                    )}<br/>
                </span>
            );
        });

        return <>{scheduleTexts}</>;
    }

    return (
        <div className="w-full">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-x-1">
                {/* 絞り込みサイドバー */}
                <motion.div
                    className="w-full md:w-80 shrink-0 bg-card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="sticky top-28 flex flex-col">
                        <div className="p-8 flex-1 overflow-y-auto">
                            <h2 className="text-lg font-bold mb-6">絞り込み</h2>
                            <div className="space-y-6">
                                {/* Search input */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <label className="block text-sm font-bold mb-2">イベント名</label>
                                    <input
                                        type="text"
                                        placeholder="イベント名を入力..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-input border border-border px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    />
                                </motion.div>

                                {/* Filter selects */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <label className="block text-sm font-bold mb-2">主催団体</label>
                                    <select
                                        value={filterOrganization}
                                        onChange={(e) => setFilterOrganization(e.target.value)}
                                        className="w-full bg-input border border-border px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    >
                                        <option value="">全て表示</option>
                                        {organizations.map((org) => (
                                            <option key={org} value={org}>
                                                {org}
                                            </option>
                                        ))}
                                    </select>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <label className="block text-sm font-bold mb-2">カテゴリ</label>
                                    <select
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                        className="w-full bg-input border border-border px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    >
                                        <option value="">全て表示</option>
                                        <option value="performance">舞台</option>
                                        <option value="exhibition">展示</option>
                                    </select>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <label className="block text-sm font-bold mb-2">日程</label>
                                    <select
                                        value={filterDay}
                                        onChange={(e) => setFilterDay(e.target.value)}
                                        className="w-full bg-input border border-border px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    >
                                        <option value="">全て表示</option>
                                        {days.map((day) => (
                                            <option key={day.id} value={day.id}>
                                                {day.name}
                                            </option>
                                        ))}
                                    </select>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div
                            className="p-8 pt-4 border-t border-accent-light shrink-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <p className="text-sm text-muted-foreground text-center">
                                {filteredEvents.length} 件のイベント
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* イベントリスト */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            className="space-y-1"
                            layout
                        >
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((event, index) => (
                                    <motion.div
                                        key={event.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: index * 0.05,
                                            layout: { duration: 0.3 }
                                        }}
                                    >
                                        <Link
                                            href={`/event/${event.id}`}
                                            className="bg-card border border-background hover:border-primary transition-colors relative overflow-hidden block group"
                                        >
                                            {event.images && event.images.length > 0 && (
                                                <div className="absolute top-0 right-0 w-50 h-full overflow-hidden">
                                                    <motion.img
                                                        src={`/image/${event.images[0]}`}
                                                        alt=""
                                                        className="w-full h-full object-cover object-center opacity-30"
                                                        whileHover={{ scale: 1.05 }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                </div>
                                            )}

                                            <div className="p-8 relative z-10">
                                                <div className="flex items-start justify-between mb-4">
                                                    <h3 className="text-xl font-bold text-primary group-hover:translate-x-1 transition-transform">
                                                        {event.name}
                                                    </h3>
                                                    <span className="text-xs text-background bg-primary bg-opacity-20 px-2 py-1 font-bold shrink-0 ml-2">
                                                        {event.category === 'performance' ? '舞台' : '展示'}
                                                    </span>
                                                </div>
                                                <div className="space-y-3 text-sm">
                                                    <p>
                                                        <span className="font-bold">By:</span> {event.organization}
                                                    </p>
                                                    <p>
                                                        {getScheduleInfo(event)}
                                                    </p>
                                                    <p className="text-muted-foreground mt-4">{event.description}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    className="text-center py-12"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p className="text-muted-foreground">検索条件に合致するイベントが見つかりません</p>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}