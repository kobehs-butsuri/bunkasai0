"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import festivalData from "@/data/festival.json"
import mapDataJson from "@/data/map.json"
import {Performance, Exhibition, UnifiedEvent, Day} from "@/data/types";
import {useSetPageTitle} from "@/hooks/page-title-context";

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
        <div className="max-w-7xl mx-auto">

            {/* Search & Filters */}
            <div className="bg-card border border-accent-light p-8 mb-12">
                <div className="space-y-6">
                    {/* Search input */}
                    <div>
                        <label className="block text-sm font-bold mb-2">イベント名で検索</label>
                        <input
                            type="text"
                            placeholder="イベント名を入力..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-input border border-border px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Filter selects */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-bold mb-2">主催団体で絞込</label>
                            <select
                                value={filterOrganization}
                                onChange={(e) => setFilterOrganization(e.target.value)}
                                className="w-full bg-input border border-border px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">全て表示</option>
                                {organizations.map((org) => (
                                    <option key={org} value={org}>
                                        {org}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">カテゴリで絞込</label>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="w-full bg-input border border-border px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">全て表示</option>
                                <option value="performance">舞台</option>
                                <option value="exhibition">展示</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">日程で絞込</label>
                            <select
                                value={filterDay}
                                onChange={(e) => setFilterDay(e.target.value)}
                                className="w-full bg-input border border-border px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">全て表示</option>
                                {days.map((day) => (
                                    <option key={day.id} value={day.id}>
                                        {day.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <Link
                            key={event.id}
                            href={`/event/${event.id}`}
                            className="bg-card border border-accent-light p-8 hover:border-primary transition-colors"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-xl font-bold text-primary">{event.name}</h3>
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
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground">検索条件に合致するイベントが見つかりません</p>
                    </div>
                )}
            </div>

            {/* Result count */}
            <div className="mt-8 text-center text-muted-foreground">
                <p>
                    {filteredEvents.length} 件のイベントが見つかりました
                </p>
            </div>
        </div>
    )
}