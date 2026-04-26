"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ImageGallery } from "@/components/image-garally"
import {Performance, UnifiedEvent, Day} from "@/data/types"

const parseOrganizations = (org: string): string[] =>
    org.split(';').map(o => o.trim()).filter(Boolean)

const formatOrganizations = (org: string): string =>
    parseOrganizations(org).join(' · ')

interface EventDetailContentProps {
    event: UnifiedEvent
    schedules?: Performance['schedules']
    roomId?: string
    mapData: Record<string, string | { label: string; keywords?: string[] }>
    festivalDays: Day[]
}

export function Content({
                            event,
                            schedules,
                            roomId,
                            mapData,
                            festivalDays
                        }: EventDetailContentProps) {
    const getLabel = (roomId: string): string => {
        const data = mapData[roomId];
        return typeof data === "string" ? data : data.label;
    };

    const getScheduleInfo = () => {
        if (!schedules || schedules.length === 0) return null

        const times = schedules.map(s => s.info.map(info => `${info.startTime} - ${info.endTime}`).flat().join(', '))
        const allSame = times.every(t => t === times[0])

        if (allSame && festivalDays.length === schedules.length) {
            return <p className="text-lg">{times[0]}</p>
        }

        return schedules.map(schedule => {
            const day = festivalDays.find(d => d.id === schedule.dayId)
            if (!day) return null
            return (
                <p className="text-lg my-4" key={schedule.dayId}>
                    <span className="font-bold text-2xl">{day.name}<br/></span>
                    {schedule.info.map((info, idx) =>
                        (
                            <span key={`${event.id}-${schedule.dayId}-${idx}-time-pos`}>
                                {idx !== 0 && (<br/>)}{info.startTime} - {info.endTime}
                                <Link href={`/map?id=${info.location}`} className="ml-4 text-primary underline">
                                    <span className="font-bold">@{getLabel(info.location)}</span>
                                </Link>
                            </span>
                        )
                    )}
                </p>
            )
        }).flat()
    }

    return (
        <div className="pt-28 pb-28 max-w-3xl md:max-w-7xl mx-auto">
            {/* Back link */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Link href="/event" className="text-primary underline mb-8 inline-block hover:opacity-75 mx-10">
                    ← イベント一覧
                </Link>
            </motion.div>

            {/* Event header */}
            <div className="mb-12 mx-10">
                <motion.div
                    className="flex items-start gap-4 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <h1 className="text-5xl font-bold tracking-tight text-balance flex-1">{event.name}</h1>
                    <div>
                        <p className="text-lg">{formatOrganizations(event.category === 'garden' || event.category === 'volunteer' ? "" : event.organization)}</p>
                    </div>
                    <span className="text-sm bg-primary bg-opacity-20 text-background px-3 py-1 font-bold shrink-0">
                        {event.category === "performance" ? '舞台' : event.category === "exhibition" ? '展示' : event.category === "garden" ? '園遊会' : '３年有志'}
                    </span>
                </motion.div>

                <motion.div
                    className="md:px-8 py-8 space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    {event.category === "performance" && schedules && schedules.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                        >
                            {getScheduleInfo()}
                        </motion.div>
                    )}

                    {event.category !== "performance" && roomId && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                        >
                            <h3 className="font-bold text-lg mb-2">場所</h3>
                            <p className="text-lg">{getLabel(roomId)}</p>
                            <p className="text-sm text-muted-foreground font-bold mt-1">{event.category === "exhibition" ? '常設展示' : event.category === "garden" ? '園遊会販売' : '３年有志'}</p>
                        </motion.div>
                    )}

                    <div className="flex flex-col md:flex-row gap-6">
                        <motion.div
                            className="flex-1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                        >
                            <p className="text-lg leading-relaxed">{event.description.split('\n').map((line, index)=>(
                                <span key={`${line}-${index}`}>
                                    {line}
                                    <br/>
                                </span>
                            ))}</p>
                        </motion.div>
                        {event.images && event.images.length > 0 && (
                            <motion.div
                                className="w-full md:w-80 rounded-2xl overflow-hidden shrink-0"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.5 }}
                            >
                                <ImageGallery
                                    images={event.images}
                                    aspectRatio="square"
                                    className="md:hidden"
                                />
                                <ImageGallery
                                    images={event.images}
                                    aspectRatio="portrait"
                                    className="hidden md:block"
                                />
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Navigation */}
            <motion.div
                className="flex gap-4 mx-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
            >
                {event.category !== "performance" && roomId && (
                    <Link
                        href={`/map?id=${roomId}`}
                        className="flex-1 bg-primary text-background py-3 font-bold hover:opacity-90 transition-opacity text-center"
                    >
                        マップを見る
                    </Link>
                )}
                {event.category === "performance" && (
                    <Link
                        href="/schedule"
                        className="flex-1 bg-card border border-accent-light py-3 font-bold hover:bg-accent-light transition-colors text-center"
                    >
                        スケジュールを見る
                    </Link>
                )}
            </motion.div>
        </div>
    )
}