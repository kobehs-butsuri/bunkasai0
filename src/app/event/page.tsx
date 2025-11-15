"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import eventsData from "@/data/events.json"

interface Schedule {
    dayId: string;
    locationId: string;
    startTime: string;
    endTime: string;
}

interface Event {
    id: string;
    name: string;
    organization: string;
    type: string;
    description: string;
    schedules: Schedule[];
}

interface Day {
    id: string;
    date: string;
    name: string;
}

interface Location {
    id: string;
    name: string;
}

export default function EventsPage() {
    const events = eventsData.events as Event[]
    const days = eventsData.festival.days as Day[]
    const locations = eventsData.festival.locations as Location[]

    const [searchTerm, setSearchTerm] = useState("")
    const [filterOrganization, setFilterOrganization] = useState("")
    const [filterDay, setFilterDay] = useState("")
    const [filterLocation, setFilterLocation] = useState("")

    const organizations = [...new Set(events.map((e) => e.organization))]

    const filteredEvents = events.filter((event) => {
        const matchesSearch =
            event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesOrg = !filterOrganization || event.organization === filterOrganization

        // dayIdまたはlocationIdでフィルタリング
        const matchesDay = !filterDay || event.schedules.some(s => s.dayId === filterDay)
        const matchesLocation = !filterLocation || event.schedules.some(s => s.locationId === filterLocation)

        return matchesSearch && matchesOrg && matchesDay && matchesLocation
    })

    // スケジュール情報を取得するヘルパー関数
    const getScheduleInfo = (event: Event) => {
        const scheduleTexts = event.schedules.map(schedule => {
            const day = days.find(d => d.id === schedule.dayId)
            const location = locations.find(l => l.id === schedule.locationId)
            return `${day?.name || '不明'} ${schedule.startTime}-${schedule.endTime} (${location?.name || '不明'})`
        })
        return scheduleTexts.join(', ')
    }

    return (
        <div className="bg-background text-foreground">
            <Header />

            <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto">
                {/* Title Section */}
                <div className="mb-12 pt-8">
                    <h1 className="text-5xl font-bold mb-4 tracking-tight text-balance">イベント一覧</h1>
                    <p className="text-lg text-muted-foreground">文化祭で開催される全てのイベント</p>
                </div>

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

                            <div>
                                <label className="block text-sm font-bold mb-2">場所で絞込</label>
                                <select
                                    value={filterLocation}
                                    onChange={(e) => setFilterLocation(e.target.value)}
                                    className="w-full bg-input border border-border px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">全て表示</option>
                                    {locations.map((loc) => (
                                        <option key={loc.id} value={loc.id}>
                                            {loc.name}
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
                                <h3 className="text-xl font-bold mb-4 text-primary">{event.name}</h3>
                                <div className="space-y-3 text-sm">
                                    <p>
                                        <span className="font-bold">主催:</span> {event.organization}
                                    </p>
                                    <p>
                                        <span className="font-bold">種類:</span> {event.type}
                                    </p>
                                    <p>
                                        <span className="font-bold">スケジュール:</span> {getScheduleInfo(event)}
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
            </main>

            <Footer />
        </div>
    )
}