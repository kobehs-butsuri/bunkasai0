"use client"

import { useEffect, useState } from "react"
import AccessMap from "@/components/access-map";
import {AccessTransportation} from "@/components/access";
import {useSetPageTitle} from "@/hooks/page-title-context";

export default function Access() {
    useSetPageTitle("アクセス")

    return (
        <div className="max-w-7xl mx-auto">
            {/* Location Information */}
            <div className="grid md:grid-cols-2 grid-rows-1 gap-12 mb-24 mx-10">
                <div className="border-l-4 border-primary pl-8">
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

                <div className="relative pl-8 pb-8">
                    <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none after:content-[''] after:absolute after:top-0 after:right-0 after:w-full after:h-0.5 after:bg-accent before:content-[''] before:absolute before:top-2 before:right-2 before:w-full before:h-1.5 before:bg-secondary" />
                    <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none after:content-[''] after:absolute after:top-0 after:right-0 after:w-0.5 after:h-full after:bg-accent before:content-[''] before:absolute before:top-2 before:right-2 before:w-1.5 before:h-full before:bg-secondary" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-accent before:content-[''] before:absolute before:bottom-2 before:left-2 before:w-full before:h-1.5 before:bg-secondary" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0.5 after:h-full after:bg-accent before:content-[''] before:absolute before:bottom-2 before:left-2 before:w-1.5 before:h-full before:bg-secondary" />

                    <h3 className="text-2xl font-bold text-foreground mb-6">交通アクセス</h3>
                    <AccessTransportation/>
                </div>
            </div>

            <div className={"grid md:grid-cols-2 grid-rows-1 gap-12 mb-24 mx-10"}>
                {/* Map Placeholder */}
                <AccessMap/>

                {/* Additional Information */}
                <div className="border-l-4 border-primary pl-8">
                    <h2 className="text-2xl font-bold text-foreground mb-4">注意事項</h2>
                    <ul className="space-y-3 text-foreground/80 list-disc list-inside">
                        <li>学校の駐車場はご利用になれませんので、お車でのご来場や送迎はお控えください。特に正門前までの送迎は他の来場者との接触の危険を伴いますので、ご遠慮いただきますようお願いします。</li>
                        <li>学校周辺は坂道が多く、特に鉄道路線の各最寄り駅からは20分以上の徒歩が見込まれます。ご注意ください。</li>
                        <li>市バス18/102系統の「摩耶ケーブル下」停留所も本来は最寄りの1つですが、その駅から最も近い門は当日施錠されますので、やや遠回りとなります。「神戸高校前」停留所での下車を推奨します。</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
