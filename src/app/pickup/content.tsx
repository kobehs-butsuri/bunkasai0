"use client"

import {useSetPageTitle} from "@/hooks/page-title-context";
import {Tab, TabView} from "@/components/tabview";
import Slideshow from "@/components/slideshow";
import {motion} from "framer-motion";
import Link from "next/link";
import {Day, Exhibition, Garden, Performance, UnifiedEvent} from "@/data/types";
import {useMemo} from "react";
import festivalData from "@/data/festival.json";
import mapDataJson from "@/data/map.json";
import {Button} from "@/components/ui/button";
import {ArrowRight} from "lucide-react";

export default function Policy() {
    useSetPageTitle("Pick Up")

    const ad_ids: string[] = ["perf-001", "perf-004", "exh-002"]
    const performances = festivalData.performances as Performance[]
    const exhibitions = festivalData.exhibitions as Exhibition[]
    const gardens = festivalData.gardens as Garden[]
    const allEvents: UnifiedEvent[] = useMemo(() => {
        const perfEvents: UnifiedEvent[] = performances.map(p => ({
            ...p,
            category: 'performance' as const
        }))
        const exhEvents: UnifiedEvent[] = exhibitions.map(e => ({
            ...e,
            category: 'exhibition' as const
        }))
        const gardenEvents: UnifiedEvent[] = gardens.map(e => ({
            ...e,
            category: 'garden' as const
        }))
        return [...perfEvents, ...exhEvents, ...gardenEvents]
    }, [performances, exhibitions, gardens])
    const days = festivalData.festival.days as Day[]
    const ad_event: UnifiedEvent[] = allEvents.filter(item => ad_ids.includes(item.id))

    const tabs: Tab[] = [
        {
            id: "stage",
            label: "舞台編",
            content: <div className={"h-60 bg-accent-light"}></div>
        },
        {
            id: "exhibition",
            label: "展示編",
            content: <div className={"h-60 bg-muted"}></div>
        },
        {
            id: "challenge",
            label: "チャレンジコーナー編",
            content: <div className={"h-60 bg-secondary-foreground"}></div>
        }
    ]

    const mapData = mapDataJson as Record<string, string | { label: string; keywords?: string[] }>;
    const getLabel = (roomId: string): string => {
        const data = mapData[roomId];
        return typeof data === "string" ? data : data.label;
    };

    const getScheduleInfo = (event: UnifiedEvent) => {
        if (event.category === 'exhibition') {
            return <span className="font-bold">常設展示</span>
        }

        if (event.category === 'garden') {
            return <span className="font-bold">園遊会</span>
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
        <div className="max-w-7xl mx-auto">
            <Slideshow items={ad_event} renderItem={(item) => (
                <Link
                    href={`/event/${item.id}`}
                    className="bg-card border border-background hover:border-primary transition-colors relative overflow-hidden block group"
                >
                    {item.images && item.images.length > 0 && (
                        <div className="absolute top-0 right-0 w-50 h-full overflow-hidden">
                            <motion.img
                                src={`/image/${item.images[0]}`}
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
                                {item.name}
                            </h3>
                            <span className="text-xs text-background bg-primary bg-opacity-20 px-2 py-1 font-bold shrink-0 ml-2">
                                                        {item.category === 'performance' ? '舞台' : item.category === 'exhibition' ? '展示' : '園遊会'}
                                                    </span>
                        </div>
                        <div className="space-y-3 text-sm">
                            <p>
                                <span className="font-bold">By:</span> {item.category === "garden" ? "" : item.organization}
                            </p>
                            <p>
                                {getScheduleInfo(item)}
                            </p>
                            <p className="text-muted-foreground mt-4">{item.description}</p>
                        </div>
                    </div>
                </Link>
            )} itemMaxWidth={600}/>
            <div className="py-10 w-fit mr-0 ml-auto">
                <Link href={"/garden"}>
                    <div className="relative flex p-4 pl-10 w-full text-4xl text-accent items-center justify-end overflow-hidden">
                        園遊会特集
                        <ArrowRight className={"ml-5"}/>
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 border-b-2 border-dashed border-accent animate-dash"></div>
                    </div>
                </Link>

                <style jsx>
                    {`
                        @keyframes dash {
                            0% {
                                background-position: 0 0;
                            }
                            100% {
                                background-position: 20px 0;
                            }
                        }
                        
                        .animate-dash {
                            background-image: linear-gradient(to right, currentColor 50%, transparent 50%);
                            background-size: 20px 2px;
                            background-repeat: repeat-x;
                            border: none;
                            animation: dash 0.5s linear infinite;
                        }
                    `}
                </style>
            </div>
            <TabView tabs={tabs} />
        </div>
    )
}
