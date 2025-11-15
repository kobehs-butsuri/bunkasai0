import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import eventsData from "@/data/events.json"

interface EventDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
    const { id } = await params
    const events = eventsData.events
    const event = events.find((e) => e.id === id)

    if (!event) {
        return (
            <div className="bg-background text-foreground">
                <Header />
                <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto">
                    <h1 className="text-5xl font-bold mb-4">イベントが見つかりません</h1>
                    <Link href="/map" className="text-primary underline">
                        マップに戻る
                    </Link>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="bg-background text-foreground">
            <Header />

            <main className="pt-32 pb-24 px-8 max-w-3xl mx-auto">
                {/* Back link */}
                <Link href="/map" className="text-primary underline mb-8 inline-block hover:opacity-75">
                    ← マップに戻る
                </Link>

                {/* Event header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-bold mb-6 tracking-tight text-balance">{event.name}</h1>
                    <div className="bg-card border border-accent-light p-8 space-y-6">
                        <div>
                            <h3 className="font-bold text-lg mb-2">主催団体</h3>
                            <p className="text-lg">{event.organization}</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">日時</h3>
                            {(() => {
                                const times = event.schedules.map(s => `${s.startTime} - ${s.endTime}`);
                                const allSame = times.every(t => t === times[0]);
                                const allNull = event.schedules.every(s => !s.startTime && !s.endTime);

                                if (allNull) return null;

                                if (allSame && eventsData.festival.days.length === event.schedules.length) {
                                    return <p className="text-lg">{times[0]}</p>;
                                }

                                return event.schedules.map(schedule => {
                                    const day = eventsData.festival.days.find(d => d.id === schedule.dayId);
                                    if (!day) return null;
                                    return (
                                        <p className="text-lg" key={schedule.dayId}>
                                            {day.name}: {schedule.startTime} - {schedule.endTime}
                                        </p>
                                    );
                                });
                            })()}
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">場所</h3>
                            {(() => {
                                const locationIds = event.schedules.map(s => s.locationId);
                                const allSame = locationIds.every(id => id === locationIds[0]);

                                if (allSame && eventsData.festival.days.length === event.schedules.length) {
                                    const location = eventsData.festival.locations.find(l => l.id === locationIds[0]);
                                    return location ? <p className="text-lg">{location.name}</p> : null;
                                }

                                return event.schedules.map(schedule => {
                                    const day = eventsData.festival.days.find(d => d.id === schedule.dayId);
                                    const location = eventsData.festival.locations.find(l => l.id === schedule.locationId);
                                    if (!day || !location) return null;
                                    return (
                                        <p className="text-lg" key={schedule.dayId}>
                                            {day.name}: {location.name}
                                        </p>
                                    );
                                });
                            })()}
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">説明</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">{event.description}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-4">
                    <Link
                        href="/map"
                        className="flex-1 bg-primary text-background py-3 font-bold hover:opacity-90 transition-opacity text-center"
                    >
                        マップに戻る
                    </Link>
                    <Link
                        href="/timetable"
                        className="flex-1 bg-card border border-accent-light py-3 font-bold hover:bg-accent-light transition-colors text-center"
                    >
                        タイムテーブルを見る
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    )
}
