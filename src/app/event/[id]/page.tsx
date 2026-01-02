import festivalData from "@/data/festival.json"
import mapDataJson from "@/data/map.json"
import {Performance, Exhibition, UnifiedEvent} from "@/data/types";
import {Metadata} from "next";
import {notFound} from "next/navigation";
import { Content } from "./content";

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
        <Content
            event={event}
            isPerformance={isPerformance}
            schedules={schedules}
            roomId={roomId}
            mapData={mapData}
            festivalDays={festivalData.festival.days}
        />
    )
}