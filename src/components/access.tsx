"use client"

import AccessMap from "@/components/access-map";
import useMobile from "@/hooks/use-mobile";
import Link from "next/link";
import {ChevronRight} from "lucide-react";

export function AccessTransportation() {
    return (
        <div className="space-y-4 text-foreground/80">
            <div>
                <p className="font-semibold text-foreground mb-1">バス</p>
                <p>神戸市営バス 2/18/102系統 「神戸高校前」停留所から徒歩5分</p>
            </div>
            <div>
                <p className="font-semibold text-foreground mb-1">電車</p>
                <p>阪急神戸本線 「王子公園」駅から徒歩20分</p>
                <p>JR神戸線 「灘」駅から徒歩29分</p>
                <p>JR神戸線 「摩耶」駅から徒歩30分</p>
                <p>阪神本線 「岩屋」駅から徒歩35分</p>
                <p>阪神本線 「西灘」駅から徒歩35分</p>
            </div>
        </div>
    )
}

export function AccessBanner() {
    return (
        <div className="bg-background relative pl-5 pr-5 pb-5 md:m-20 overflow-hidden">
        <div className="absolute top-8 right-8 w-16 h-16 pointer-events-none after:content-[''] after:absolute after:top-0 after:right-0 after:w-full after:h-0.5 after:bg-accent before:content-[''] before:absolute before:top-2 before:right-2 before:w-full before:h-1.5 before:bg-secondary" />
        <div className="absolute top-8 right-8 w-16 h-16 pointer-events-none after:content-[''] after:absolute after:top-0 after:right-0 after:w-0.5 after:h-full after:bg-accent before:content-[''] before:absolute before:top-2 before:right-2 before:w-1.5 before:h-full before:bg-secondary" />
        <div className="absolute bottom-4 left-8 w-16 h-16 pointer-events-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-accent before:content-[''] before:absolute before:bottom-2 before:left-2 before:w-full before:h-1.5 before:bg-secondary" />
        <div className="absolute bottom-4 left-8 w-16 h-16 pointer-events-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0.5 after:h-full after:bg-accent before:content-[''] before:absolute before:bottom-2 before:left-2 before:w-1.5 before:h-full before:bg-secondary" />
        <div className="w-full">
            {/* Location Information */}
            {useMobile() && (
                <div>
                    <div className="pb-8">
                        <div className="pt-8">
                                <h3
                                    className="text-4xl font-bold mb-4 tracking-tight text-balance"
                                    style={{letterSpacing: "0.05em"}}>
                                    <Link href="/access" className={"flex items-center"}>
                                        <span className={"text-4xl"}>アクセス</span>
                                        <ChevronRight size={36} />
                                    </Link>
                                </h3>
                        </div>
                        <AccessTransportation/>
                    </div>
                    <div className="pb-20">
                        <AccessMap/>
                    </div>
                </div>
                )
            }
            {!useMobile() &&(
                <div className="grid grid-cols-2 gap-12">
                    <div className="p-8">
                        <div className="mb-12 pt-8">
                            <h3
                                className="font-bold mb-4 tracking-tight text-balance"
                                style={{letterSpacing: "0.05em"}}>
                                <Link href="/access" className={"flex items-center"}>
                                    <span className={"text-4xl"}>アクセス</span>
                                    <ChevronRight size={36} />
                                </Link>
                            </h3>
                        </div>
                        <AccessTransportation/>
                    </div>

                    <div className="flex items-center justify-center p-16">
                        <AccessMap/>
                    </div>
                </div>
                )
            }
        </div>
        </div>
    )
}
