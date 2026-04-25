"use client"

import {useState, useMemo, useEffect} from "react"
import Link from "next/link"
import festivalData from "@/data/festival.json"
import mapDataJson from "@/data/map.json"
import {Performance, Exhibition, UnifiedEvent, Day, Garden} from "@/data/types";
import {useSetPageTitle} from "@/hooks/page-title-context";
import { motion, AnimatePresence } from "framer-motion"

const parseOrganizations = (org: string): string[] =>
    org.split(';').map(o => o.trim()).filter(Boolean)

const formatOrganizations = (org: string): string =>
    parseOrganizations(org).join(' · ')

export default function EventsPage() {
    useSetPageTitle("イベント一覧")

    const performances = festivalData.performances as Performance[]
    const exhibitions = festivalData.exhibitions as Exhibition[]
    const gardens = festivalData.gardens as Garden[]
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
            .filter(e => e.id != "")
        const gardenEvents: UnifiedEvent[] = gardens.map(e => ({
            ...e,
            category: 'garden' as const
        }))
        return [...perfEvents, ...exhEvents, ...gardenEvents]
    }, [performances, exhibitions, gardens])

    const organizations = [...new Set(
        allEvents.flatMap(e => parseOrganizations(e.category === 'garden' ? "園遊会" : e.organization))
    )].sort()

    const mapData = mapDataJson as Record<string, string | { label: string; keywords?: string[] }>;
    const getLabel = (roomId: string): string => {
        const data = mapData[roomId];
        return typeof data === "string" ? data : data.label;
    };
    const [searchTerm, setSearchTerm] = useState("")
    const [filterOrganizations, setFilterOrganizations] = useState<string[]>(organizations)
    const [filterCategories, setFilterCategories] = useState<string[]>(['performance', 'exhibition', 'garden'])
    const [filterDays, setFilterDays] = useState<string[]>(days.map(d => d.id))
    const [openSections, setOpenSections] = useState<{[key: string]: boolean}>({
        organization: false,
        category: false,
        day: false
    })
    const [isExplicitAllOrg, setIsExplicitAllOrg] = useState(true)
    const [isExplicitAllCategory, setIsExplicitAllCategory] = useState(true)
    const [isExplicitAllDay, setIsExplicitAllDay] = useState(true)

    useEffect(() => {
        const isDesktop = window.innerWidth >= 768
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOpenSections({
            organization: isDesktop,
            category: isDesktop,
            day: isDesktop
        })
    }, [])


    const filteredEvents = allEvents.filter((event) => {
        const matchesSearch =
            event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesOrg = parseOrganizations(event.category === 'garden' ? "園遊会" : event.organization)
            .some(org => filterOrganizations.includes(org))

        const matchesCategory = filterCategories.includes(event.category)

        const matchesDay =
            (event.category === 'performance' && event.schedules?.some(s => filterDays.includes(s.dayId))) ||
            event.category === 'exhibition' || event.category === 'garden'

        return matchesSearch && matchesOrg && matchesDay && matchesCategory
    })

    const toggleFilter = (
        value: string,
        currentFilters: string[],
        setter: (val: string[]) => void,
        allValues: string[],
        explicitAllSetter: (val: boolean) => void,
        isExplicitAll: boolean
    ) => {
        if (currentFilters.length === allValues.length && isExplicitAll) {
            setter([value])
            explicitAllSetter(false)
        } else if (currentFilters.includes(value)) {
            const newFilters = currentFilters.filter(f => f !== value)
            if (newFilters.length > 0) {
                setter(newFilters)
                explicitAllSetter(false)
            }
        } else {
            const newFilters = [...currentFilters, value]
            setter(newFilters)
            if (newFilters.length === allValues.length) {
                explicitAllSetter(false)
            }
        }
    }

    const selectAll = (
        allValues: string[],
        currentFilters: string[],
        setter: (val: string[]) => void,
        explicitAllSetter: (val: boolean) => void
    ) => {
        setter(allValues)
        explicitAllSetter(true)
    }

    const isAllSelected = (currentFilters: string[], allValues: string[]) => {
        return currentFilters.length === allValues.length
    }
    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    // スケジュール情報を取得するヘルパー関数
    const getScheduleInfo = (event: UnifiedEvent) => {
        if (event.category === 'exhibition') {
            const data = mapData[event.roomId]
            return <span className="font-bold">常設 @{typeof data === "string" ? data : data.label}</span>
        }

        if (event.category === 'garden') {
            const data = mapData[event.roomId]
            return <span className="font-bold">園遊会販売 @{typeof data === "string" ? data : data.label}</span>
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
                                {idx !== 0 && ", "}{info.startTime} - {info.endTime} <span className="font-bold">@{getLabel(info.location)}</span>
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
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-1">
                {/* 絞り込みサイドバー */}
                <motion.div
                    className="w-full md:w-80 shrink-0 bg-card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="sticky top-28 flex flex-col md:max-h-[calc(100dvh-7rem)]">
                        <div className="p-8 flex-1 md:overflow-y-auto">
                            <h2 className="text-lg font-bold mb-6">絞り込み</h2>
                            <div className="space-y-6">
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
                                        className="w-full bg-input border border-border px-4 py-3 align-middle text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    />
                                </motion.div>

                                {/* 主催団体 */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <button
                                        onClick={() => toggleSection('organization')}
                                        className="w-full flex items-center justify-between text-sm font-bold mb-2 hover:text-primary transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>主催団体</span>
                                            {filterOrganizations.length !== organizations.length && (
                                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                            )}
                                        </div>
                                        <span className="text-lg">{openSections.organization ? '−' : '+'}</span>
                                    </button>
                                    <AnimatePresence>
                                        {openSections.organization && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="space-y-2 pl-2">
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            onClick={() => selectAll(organizations, filterOrganizations, setFilterOrganizations, setIsExplicitAllOrg)}
                                                            className={`px-3 py-1.5 border text-sm rounded transition-all flex items-center justify-start gap-1.5 ${
                                                                isAllSelected(filterOrganizations, organizations) && isExplicitAllOrg
                                                                    ? 'bg-primary text-background'
                                                                    : 'bg-input border-border text-foreground hover:border-primary'
                                                            }`}
                                                        >
                                                            <span className="w-3 h-3 flex items-center justify-center shrink-0">
                                                                {isAllSelected(filterOrganizations, organizations) ? (
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                )}
                                                            </span>
                                                            <span>すべて</span>
                                                        </button>
                                                        {organizations.map((org) => (
                                                            <button
                                                                key={org}
                                                                onClick={() => toggleFilter(org, filterOrganizations, setFilterOrganizations, organizations, setIsExplicitAllOrg, isExplicitAllOrg)}
                                                                className={`px-3 py-1.5 border text-sm rounded transition-all flex items-center justify-start gap-1.5 ${
                                                                    filterOrganizations.includes(org) && !isExplicitAllOrg
                                                                        ? 'bg-primary text-background'
                                                                        : 'bg-input border-border text-foreground hover:border-primary'
                                                                }`}
                                                            >
                                                                <span className="w-3 h-3 flex items-center justify-center shrink-0">
                                                                    {filterOrganizations.includes(org) ? (
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    ) : (
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                    )}
                                                                </span>
                                                                <span>{org}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {/* カテゴリ */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <button
                                        onClick={() => toggleSection('category')}
                                        className="w-full flex items-center justify-between text-sm font-bold mb-2 hover:text-primary transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>カテゴリ</span>
                                            {filterCategories.length !== 3 && (
                                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                            )}
                                        </div>
                                        <span className="text-lg">{openSections.category ? '−' : '+'}</span>
                                    </button>
                                    <AnimatePresence>
                                        {openSections.category && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="space-y-2 pl-2">
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            onClick={() => selectAll(['performance', 'exhibition', 'garden'], filterCategories, setFilterCategories, setIsExplicitAllCategory)}
                                                            className={`px-3 py-1.5 border text-sm rounded transition-all flex items-center gap-1.5 ${
                                                                isAllSelected(filterCategories, ['performance', 'exhibition', 'garden']) && isExplicitAllCategory
                                                                    ? 'bg-primary text-background'
                                                                    : 'bg-input border-border text-foreground hover:border-primary'
                                                            }`}
                                                        >
                                                            <span className="w-3 h-3 flex items-center justify-center shrink-0">
                                                                {isAllSelected(filterCategories, ['performance', 'exhibition', 'garden']) ? (
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                )}
                                                            </span>
                                                            <span>すべて</span>
                                                        </button>
                                                        <button
                                                            onClick={() => toggleFilter('performance', filterCategories, setFilterCategories, ['performance', 'exhibition', 'garden'], setIsExplicitAllCategory, isExplicitAllCategory)}
                                                            className={`px-3 py-1.5 border text-sm rounded transition-all flex items-center gap-1.5 ${
                                                                filterCategories.includes('performance') && !isExplicitAllCategory
                                                                    ? 'bg-primary text-background'
                                                                    : 'bg-input border-border text-foreground hover:border-primary'
                                                            }`}
                                                        >
                                                            <span className="w-3 h-3 flex items-center justify-center shrink-0">
                                                                {filterCategories.includes('performance') ? (
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                )}
                                                            </span>
                                                            <span>舞台</span>
                                                        </button>
                                                        <button
                                                            onClick={() => toggleFilter('exhibition', filterCategories, setFilterCategories, ['performance', 'exhibition', 'garden'], setIsExplicitAllCategory, isExplicitAllCategory)}
                                                            className={`px-3 py-1.5 border text-sm rounded transition-all flex items-center gap-1.5 ${
                                                                filterCategories.includes('exhibition') && !isExplicitAllCategory
                                                                    ? 'bg-primary text-background'
                                                                    : 'bg-input border-border text-foreground hover:border-primary'
                                                            }`}
                                                        >
                                                            <span className="w-3 h-3 flex items-center justify-center shrink-0">
                                                                {filterCategories.includes('exhibition') ? (
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                )}
                                                            </span>
                                                            <span>展示</span>
                                                        </button>
                                                        <button
                                                            onClick={() => toggleFilter('garden', filterCategories, setFilterCategories, ['performance', 'exhibition', 'garden'], setIsExplicitAllCategory, isExplicitAllCategory)}
                                                            className={`px-3 py-1.5 border text-sm rounded transition-all flex items-center gap-1.5 ${
                                                                filterCategories.includes('garden') && !isExplicitAllCategory
                                                                    ? 'bg-primary text-background'
                                                                    : 'bg-input border-border text-foreground hover:border-primary'
                                                            }`}
                                                        >
                                                            <span className="w-3 h-3 flex items-center justify-center shrink-0">
                                                                {filterCategories.includes('garden') ? (
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                )}
                                                            </span>
                                                            <span>園遊会</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {/* 日程 */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <button
                                        onClick={() => toggleSection('day')}
                                        className="w-full flex items-center justify-between text-sm font-bold mb-2 hover:text-primary transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>日程</span>
                                            {filterDays.length !== days.length && (
                                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                            )}
                                        </div>
                                        <span className="text-lg">{openSections.day ? '−' : '+'}</span>
                                    </button>
                                    <AnimatePresence>
                                        {openSections.day && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="space-y-2 pl-2">
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            onClick={() => selectAll(days.map(d => d.id), filterDays, setFilterDays, setIsExplicitAllDay)}
                                                            className={`px-3 py-1.5 border text-sm rounded transition-all flex items-center gap-1.5 ${
                                                                isAllSelected(filterDays, days.map(d => d.id)) && isExplicitAllDay
                                                                    ? 'bg-primary text-background'
                                                                    : 'bg-input border-border text-foreground hover:border-primary'
                                                            }`}
                                                        >
                                                            <span className="w-3 h-3 flex items-center justify-center shrink-0">
                                                                {isAllSelected(filterDays, days.map(d => d.id)) ? (
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                )}
                                                            </span>
                                                            <span>すべて</span>
                                                        </button>
                                                        {days.map((day) => (
                                                            <button
                                                                key={day.id}
                                                                onClick={() => toggleFilter(day.id, filterDays, setFilterDays, days.map(d => d.id), setIsExplicitAllDay, isExplicitAllDay)}
                                                                className={`px-3 py-1.5 border text-sm rounded transition-all flex items-center gap-1.5 ${
                                                                    filterDays.includes(day.id) && !isExplicitAllDay
                                                                        ? 'bg-primary text-background'
                                                                        : 'bg-input border-border text-foreground hover:border-primary'
                                                                }`}
                                                            >
                                                                <span className="w-3 h-3 flex items-center justify-center shrink-0">
                                                                    {filterDays.includes(day.id) ? (
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    ) : (
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                    )}
                                                                </span>
                                                                <span>{day.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
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
                                        key={event.id + index}
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
                                                        {event.category === 'performance' ? '舞台' : event.category === 'garden' ? "園遊会" : '展示'}
                                                    </span>
                                                </div>
                                                <div className="space-y-3 text-sm">
                                                    <p>
                                                        <span className="font-bold">By:</span> {formatOrganizations(event.category === 'garden' ? "園遊会" : event.organization)}
                                                    </p>
                                                    <p>
                                                        {getScheduleInfo(event)}
                                                    </p>
                                                    <p className="text-muted-foreground mt-4">{event.description.split('\n').map((line, index)=>(
                                                        <span key={`${line}-${index}`}>
                                                            {line}
                                                            <br/>
                                                        </span>
                                                    ))}</p>
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