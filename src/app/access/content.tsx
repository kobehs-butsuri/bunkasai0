"use client"

import { useEffect, useState } from "react"
import ParallaxContainer from "@/components/parallax-container"
import AccessMap from "@/components/access-map";
import {AccessTransportation} from "@/components/access";
import {useSetPageTitle} from "@/hooks/page-title-context";

export default function Access() {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useSetPageTitle("アクセス")

    return (
        <div className="max-w-7xl mx-auto">
            {/* Location Information */}
            <div className="grid md:grid-cols-2 grid-rows-1 gap-12 mb-24 mx-10">
                <ParallaxContainer offset={scrollY * 0.35}>
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-6">会場情報</h2>
                        <div className="space-y-6 text-foreground/80 leading-relaxed">
                            <div>
                                <p className="font-semibold text-foreground mb-2">会場名</p>
                                <p>兵庫県立神戸高等学校</p>
                            </div>
                            <div>
                                <p className="font-semibold text-foreground mb-2">住所</p>
                                <p>兵庫県神戸市灘区城の下通1丁目5-1</p>
                            </div>
                            <div>
                                <p className="font-semibold text-foreground mb-2">開催日時</p>
                                <p>2026/05/03 (一般祭)</p>
                            </div>
                        </div>
                    </div>
                </ParallaxContainer>

                <ParallaxContainer offset={scrollY * 0.3}>
                    <div className="border border-accent-light p-8 bg-primary/5">
                        <h3 className="text-2xl font-bold text-foreground mb-6">交通アクセス</h3>
                        <AccessTransportation/>
                    </div>
                </ParallaxContainer>
            </div>

            <div className={"grid md:grid-cols-2 grid-rows-1 gap-12 mb-24 mx-10"}>
                {/* Map Placeholder */}
                <ParallaxContainer offset={scrollY * 0.25}>
                    <AccessMap/>
                </ParallaxContainer>

                {/* Additional Information */}
                <ParallaxContainer offset={scrollY * 0.2}>
                    <div className="border-l-4 border-primary pl-8 mx-10">
                        <h2 className="text-2xl font-bold text-foreground mb-4">注意事項</h2>
                        <ul className="space-y-3 text-foreground/80 list-disc list-inside">
                            <li>学校の駐車場はご利用になれませんので、お車でのご来場や送迎はお控えください。特に正門前までの送迎は他の来場者との接触の危険を伴いますので、ご遠慮いただきますようお願いします。</li>
                            <li>学校周辺は坂道が多く、特に鉄道路線の各最寄り駅からは20分以上の徒歩が見込まれます。ご注意ください。</li>
                            <li>市バス18/102系統の「摩耶ケーブル下」停留所も本来は最寄りの1つですが、その駅から最も近い門は当日施錠されますので、やや遠回りとなります。「神戸高校前」停留所での下車を推奨します。</li>
                        </ul>
                    </div>
                </ParallaxContainer>
            </div>
        </div>
    )
}
