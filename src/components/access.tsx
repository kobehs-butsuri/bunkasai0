"use client"

import ParallaxContainer from "@/components/parallax-container"
import GoogleMap from "@/components/google-map";
import {useEffect, useState} from "react";
import useMobile from "@/hooks/use-mobile";
import Link from "next/link";
import {ChevronRight} from "lucide-react";

export function AccessTransportation() {
    return (
        <div className="space-y-4 text-foreground/80">
            <div>
                <p className="font-semibold text-foreground mb-1">電車</p>
                <p>阪急神戸本線 王子公園駅から徒歩20分</p>
            </div>
            <div>
                <p className="font-semibold text-foreground mb-1">バス</p>
                <p>2系統/18系統/102系統 神戸高校前 停留所から徒歩5分</p>
            </div>
        </div>
    )
}

export function AccessBanner() {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="bg-muted pl-5 pr-5 md:m-20 overflow-hidden">
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
                        <GoogleMap/>
                    </div>
                </div>
                )
            }
            {!useMobile() &&(
                <div className="grid grid-cols-2 gap-12">
                    <ParallaxContainer offset={scrollY * 0.6 - 500}>
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
                    </ParallaxContainer>

                    <ParallaxContainer offset={scrollY * 0.6 - 500}>
                        <div className="pb-20">
                            <GoogleMap/>
                        </div>
                    </ParallaxContainer>
                </div>
                )
            }
        </div>
        </div>
    )
}
