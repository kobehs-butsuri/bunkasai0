"use client"

import {useSetPageTitle} from "@/hooks/page-title-context";
import festivalData from "@/data/festival.json";
import {Garden, Volunteer} from "@/data/types";
import {ImageGallery} from "@/components/image-garally";
import Link from "next/link";

export default function Content() {
    useSetPageTitle("Pick Up")

    const gardens = festivalData.gardens as Garden[]
    const volunteers = festivalData.volunteers as Volunteer[]
    return (
        <div className="max-w-7xl mx-auto mb-20">
            <div className="space-y-12 mx-10">
                <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-12 pl-4 border-l-4 border-l-secondary">
                    園遊会

                    <div className="relative flex-1 min-w-0 h-3.5 after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:h-2 after:bg-secondary before:content-[''] before:absolute before:top-3 before:left-0 before:right-1/4 before:h-1 before:bg-accent" />
                </h2>
                <div className="text-2xl">
                    園遊会の説明
                </div>
                <h2 className="text-3xl font-bold text-foreground mt-20 mb-6">店舗紹介</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {
                        gardens.map((garden, i) => {
                            return (
                                <Link href={`/event/${garden.id}`} key={i} className="p-10 flex-col md:flex-row border-2 border-accent-dark border-b-8 border-r-8 border-b-accent border-r-accent">
                                    <div>
                                        <h3 className="text-xl font-bold text-accent-dark mb-6">{garden.name}</h3>
                                        <p className="text-foreground mb-6">{
                                            garden.description
                                                .split('\n')
                                                .map((line, index)=>(
                                                    <span key={`${line}-${index}`}>
                                                        {line}
                                                        <br/>
                                                    </span>
                                                ))
                                        }</p>
                                        <Link href={`/map?id=${garden.roomId}`}
                                              className={"rounded-4xl py-2 px-4 bg-accent-dark font-bold text-background text-xs"}>マップで場所を見る</Link>
                                    </div>
                                    {garden.images && garden.images.length > 0 && (
                                        <div
                                            className="w-full md:w-80 rounded-2xl overflow-hidden shrink-0"
                                        >
                                            <ImageGallery
                                                images={garden.images}
                                                aspectRatio="square"
                                                className="md:hidden"
                                            />
                                            <ImageGallery
                                                images={garden.images}
                                                aspectRatio="portrait"
                                                className="hidden md:block"
                                            />
                                        </div>
                                    )}
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
            <div className="space-y-12 mt-10 mx-10">
                <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-12 pl-4 border-l-4 border-l-secondary">
                    ３年有志販売
                    <div className="relative flex-1 min-w-0 h-3.5 after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:h-2 after:bg-secondary before:content-[''] before:absolute before:top-3 before:left-0 before:right-1/4 before:h-1 before:bg-accent" />
                </h2>
                <div className="text-2xl">
                    ３年有志販売の説明
                </div>
                <h2 className="text-3xl font-bold text-foreground mt-20 mb-6">店舗紹介</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {
                        volunteers.map((volunteer, i) => {
                            return (
                                <Link href={`/event/${volunteer.id}`} key={i} className="flex flex-col md:flex-row p-10 border-2 border-accent-dark border-b-8 border-r-8 border-b-accent border-r-accent">
                                    <div>
                                        <h3 className="text-xl font-bold text-accent-dark mb-6">{volunteer.name}</h3>
                                        <p className="text-foreground mb-6">{
                                            volunteer.description
                                                .split('\n')
                                                .map((line, index)=>(
                                                    <span key={`${line}-${index}`}>
                                                        {line}
                                                        <br/>
                                                    </span>
                                                ))
                                        }</p>
                                        <Link href={`/map?id=${volunteer.roomId}`}
                                              className={"rounded-4xl py-2 px-4 bg-accent-dark font-bold text-background text-xs"}>マップで場所を見る</Link>
                                    </div>
                                    {volunteer.images && volunteer.images.length > 0 && (
                                        <div
                                            className="w-full md:w-80 rounded-2xl overflow-hidden shrink-0"
                                        >
                                            <ImageGallery
                                                images={volunteer.images}
                                                aspectRatio="square"
                                                className="md:hidden"
                                            />
                                            <ImageGallery
                                                images={volunteer.images}
                                                aspectRatio="portrait"
                                                className="hidden md:block"
                                            />
                                        </div>
                                    )}
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}