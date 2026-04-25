import festivalDataRaw from "@/data/festival.json"
import mapDataJson from "@/data/map.json"
import {Performance, Exhibition, UnifiedEvent, FestivalData, Garden, Volunteer} from "@/data/types";
import {Metadata} from "next";
import {notFound} from "next/navigation";
import { Content } from "./content";
import Footer from "@/components/footer";
import type React from "react";

interface EventDetailPageProps {
    params: Promise<{ id: string }>
}

const festivalData = festivalDataRaw as FestivalData

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
        else {
            const garden = festivalData.gardens.find((e) => e.id === id)
            if (garden) {
                return {
                    title: `${garden.name} (園遊会)`,
                }
            }
            else {
                const volunteer = festivalData.volunteers.find((e) => e.id === id)
                if (volunteer) {
                    return {
                        title: `${volunteer.name} (３年有志)`,
                    }
                }
            }
        }
    }
    return {}
}

export const generateStaticParams = () =>{
    const performances = festivalData.performances.map((p) => ({ id: p.id }))
    const exhibitions = festivalData.exhibitions.map((e) => ({ id: e.id }))
    const gardens = festivalData.gardens.map((e) => ({ id: e.id }))
    const volunteers = festivalData.volunteers.map((e) => ({ id: e.id }))
    const params = [...performances, ...exhibitions, ...gardens, ...volunteers]

    if (params.length === 0) {
        return [{ id: '_dummy_' }]
    }

    return params
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
        else {
            const garden = festivalData.gardens.find((e) => e.id === id)
            if (garden) {
                event = { ...garden, category: 'garden' as const }
            }
            else {
                const volunteer = festivalData.volunteers.find((e) => e.id === id)
                if (volunteer) {
                    event = { ...volunteer, category: 'volunteer' as const }
                }
            }
        }
    }

    if (!event) {
        return notFound()
    }

    const isPerformance = event.category === 'performance'
    const isExhibition = event.category === 'exhibition'
    const isGarden = event.category === 'garden'
    const schedules = isPerformance ? (event as Performance).schedules : undefined
    const roomId = !isPerformance ? (isExhibition ? event as Exhibition : isGarden ? event as Garden : event as Volunteer).roomId : undefined
    const mapData = mapDataJson as Record<string, string | { label: string; keywords?: string[] }>;

    return (
        <>
            <Content
                event={event}
                schedules={schedules}
                roomId={roomId}
                mapData={mapData}
                festivalDays={festivalData.festival.days}
            />
            <Footer/>
        </>
    )
}