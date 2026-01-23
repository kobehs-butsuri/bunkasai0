"use client"

import {useSetPageTitle} from "@/hooks/page-title-context";

export default function Timetable() {
    useSetPageTitle("園遊会")
    return (
        <div className="max-w-7xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-6">園遊会について</h2>
            <div className="text-2xl">
                園遊会の説明
            </div>
            <h2 className="text-3xl font-bold text-foreground mt-20 mb-6">店舗紹介</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {

                }
            </div>
        </div>
    )
}