"use client"

import {Emblem, Logo} from "@/components/logo";

export default function Access() {
    return (
        <div className="max-w-7xl mt-20 mx-auto">
            <div className={"p-4"}><h1 className={"text-4xl w-full text-center"}>Theme & Logo & Emblem</h1></div>
            <div className={"p-4 pt-10"}><h2 className={"text-2xl w-full text-center"}>Theme</h2></div>
            <div className={"p-4"}><p className={"text-8xl w-full text-center font-bold"}>BOth</p></div>
            <div className={"p-4"}><p className={"text-4 w-full text-center"}>
                第130回創立記念祭のテーマ「BOth」は、神高生が伝統と変革の「両方」の姿勢を持ち続けていることを表現している。<br/>
                また、記念すべき「130th」であることを踏まえたエスプリを字形に利かせた。
            </p></div>
            <div className={"p-4 pt-20"}><h2 className={"text-2xl w-full text-center"}>Logo & Emblem</h2></div>
            <div className={"p-4"}><p className={"text-4 w-full text-center"}>
                神高生の「知性」と「情熱」を象徴する紺と朱が用いられたデザイン
            </p></div>
            <div className="p-4 w-full grid grid-cols-1 md:grid-cols-2 md:grid-rows-[auto_auto] gap-x-16 mb-20">
                <div className="px-4 w-full md:row-start-1 md:col-start-1 flex justify-center">
                    <Emblem className="w-full h-auto object-contain"/>
                </div>
                <div className="px-4 pt-0 md:row-start-2 md:col-start-1">
                    <p className="text-4 w-full text-center">
                        伝統と変革を表す二つの円の重なりに校章をあしらう。<br/>
                        未来に羽ばたく神高生の気概を遊び心あふれた斬新なデザインで表現した。
                    </p>
                </div>
                <div className="px-4 p-10 w-full md:row-start-1 md:col-start-2 flex justify-center">
                    <Logo className="w-full h-auto object-contain"/>
                </div>
                <div className="px-4 pt-0 md:row-start-2 md:col-start-2">
                    <p className="text-4 w-full text-center">
                        ロゴのグリフは「BOth」にも「130th」にも読むことができるスタイリッシュなシェイピング。<br/>
                        大海にまさに羽ばたかんとする鵬の英姿を大胆に単純化した。
                    </p>
                </div>
            </div>
        </div>
    )
}
