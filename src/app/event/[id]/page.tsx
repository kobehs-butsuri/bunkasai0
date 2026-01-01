import Link from "next/link"
import festivalData from "@/data/festival.json"
import mapDataJson from "@/data/map.json"
import {Performance, Exhibition, UnifiedEvent} from "@/data/types";
import {Metadata} from "next";
import {notFound} from "next/navigation";

interface EventDetailPageProps {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EventDetailPageProps):Promise<Metadata> {
    const { id } = await params

    const performance = festivalData.performances.find((p) => p.id === id)
    if (performance) {
        return {
            title: `${performance.name} (舞台)`,
        }
    } else {
        const exhibition = festivalData.exhibitions.find((e) => e.id === id)
        if (exhibition) {
            return {
                title: `${exhibition.name} (展示)`,
            }
        }
    }
    return {}
}


export const generateStaticParams = () =>{
    const performances = festivalData.performances.map((p) => ({ id: p.id }))
    const exhibitions = festivalData.exhibitions.map((e) => ({ id: e.id }))
    return [...performances, ...exhibitions]
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
    const { id } = await params

    // パフォーマンスと展示の両方から検索
    let event: UnifiedEvent | undefined

    const performance = festivalData.performances.find((p) => p.id === id)
    if (performance) {
        event = { ...performance, category: 'performance' as const }
    } else {
        const exhibition = festivalData.exhibitions.find((e) => e.id === id)
        if (exhibition) {
            event = { ...exhibition, category: 'exhibition' as const }
        }
    }

    if (!event) {
        return notFound()
    }

    const isPerformance = event.category === 'performance'
    const schedules = isPerformance ? (event as Performance).schedules : undefined
    const roomId = !isPerformance ? (event as Exhibition).roomId : undefined
    const mapData = mapDataJson as Record<string, string>;

    return (
        <div className="pt-28 pb-28 max-w-3xl mx-auto">
            {/* Back link */}
            <Link href="/event" className="text-primary underline mb-8 inline-block hover:opacity-75 mx-10">
                ← イベント一覧
            </Link>

            {/* Event header */}
            <div className="mb-12 mx-10">
                <div className="flex items-start gap-4 mb-6">
                    <h1 className="text-5xl font-bold tracking-tight text-balance flex-1">{event.name}</h1>
                    <div>
                        <p className="text-lg">{event.organization}</p>
                    </div>
                    <span className="text-sm bg-primary bg-opacity-20 text-background px-3 py-1 font-bold shrink-0">
                        {isPerformance ? '舞台' : '展示'}
                    </span>
                </div>

                <div className="p-8 space-y-6">
                    {isPerformance && schedules && schedules.length > 0 && (
                        <>
                            <div>
                                {(() => {
                                    const times = schedules.map(s => s.info.map(info => `${info.startTime} - ${info.endTime}`).flat().join(', '))
                                    const allSame = times.every(t => t === times[0])

                                    if (allSame && festivalData.festival.days.length === schedules.length) {
                                        return <p className="text-lg">{times[0]}</p>
                                    }

                                    return schedules.map(schedule => {
                                        const day = festivalData.festival.days.find(d => d.id === schedule.dayId)
                                        if (!day) return null
                                        return (
                                            <p className="text-lg my-4" key={schedule.dayId}>
                                                <span className="font-bold text-2xl">{day.name}<br/></span>
                                                {schedule.info.map((info, idx) =>
                                                    (
                                                        <span key={`${id}-${schedule.dayId}-${idx}-time-pos`}>
                                                            {idx !== 0 && (<br/>)}{info.startTime} - {info.endTime} <span className="font-bold">@{mapData[info.location]}</span>
                                                            <Link href={`/map?id=${info.location}`} className="ml-4 text-primary underline">マップを見る</Link>
                                                        </span>
                                                    )
                                                )}
                                            </p>
                                        )
                                    }).flat()
                                })()}
                            </div>
                        </>
                    )}

                    {!isPerformance && roomId && (
                        <div>
                            <h3 className="font-bold text-lg mb-2">場所</h3>
                            <p className="text-lg">{mapData[roomId]}</p>
                            <p className="text-sm text-muted-foreground font-bold mt-1">常設展示</p>
                        </div>
                    )}

                    <div>
                        <p className="text-lg leading-relaxed">{event.description}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 mx-10">
                {!isPerformance && roomId && (
                    <Link
                        href={`/map?id=${roomId}`}
                        className="flex-1 bg-primary text-background py-3 font-bold hover:opacity-90 transition-opacity text-center"
                    >
                        マップを見る
                    </Link>
                )}
                {isPerformance && (
                    <Link
                        href="/timetable"
                        className="flex-1 bg-card border border-accent-light py-3 font-bold hover:bg-accent-light transition-colors text-center"
                    >
                        タイムテーブルを見る
                    </Link>
                )}
            </div>
        </div>
    )
}