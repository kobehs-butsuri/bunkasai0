"use client"

import Link from "next/link";
import Instagram from '@/components/decoration/instagram.svg'
import Line from '@/components/decoration/line.svg'
import {Emblem, Logo} from "@/components/logo";
import useMobile from "@/hooks/use-mobile";

export default function Footer() {
    return (
        <footer className="w-full bg-foreground text-background py-16 px-8 relative overflow-hidden select-none">
            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 pb-12 border-t-2 border-background border-opacity-20">
                    <div className="pt-12">
                        <p className="text-primary-foreground leading-relaxed text-2xl">BOth</p>
                        <div className={"flex gap-4"}>
                            <Emblem size={80} />
                            <Logo size={80} />
                        </div>
                        <p className={"text-primary-foreground leading-relaxed"}>兵庫県立神戸高等学校</p>
                        <p className={"text-primary-foreground leading-relaxed text-xs"}>神戸市灘区城の下通1丁目5-1</p>
                    </div>
                    {useMobile() && (
                        <div className="pt-12 flex gap-2 md:justify-end h-fit">
                            <Link href="https://lin.ee/Rw1wF2U" className={"p-2"}><Line height={40}/></Link>
                            <Link href="https://instagram.com/kobe.souritsukinen.sai_130" className={"p-2"}><Instagram
                                height={40}/></Link>
                        </div>)}

                    <div className={"flex-row gap-4"}>
                        <div className="pt-12">
                            <ul className="space-y-2 text-sm opacity-80">
                                <h4 className="font-bold uppercase tracking-widest mb-4 text-sm opacity-60">Pages</h4>
                                <li>
                                    <Link href="/" className="hover:opacity-100 transition-opacity">
                                        ホーム
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/introduce" className="hover:opacity-100 transition-opacity">
                                        スローガン・ロゴ・エンブレム紹介
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="pt-12">
                            <ul className="space-y-2 text-sm opacity-80">
                                <h4 className="font-bold uppercase tracking-widest mb-4 text-sm opacity-60">イベント</h4>
                                <li>
                                    <Link href="/pickup" className="hover:opacity-100 transition-opacity">
                                        Pick Up
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/map" className="hover:opacity-100 transition-opacity">
                                        マップ
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/schedule" className="hover:opacity-100 transition-opacity">
                                        スケジュール
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/event" className="hover:opacity-100 transition-opacity">
                                        イベント
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/access" className="hover:opacity-100 transition-opacity">
                                        アクセス
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="pt-12">
                            <ul className="space-y-2 text-sm opacity-80">
                                <h4 className="font-bold uppercase tracking-widest mb-4 text-sm opacity-60">情報</h4>
                                <li>
                                    <Link href="/access" className="hover:opacity-100 transition-opacity">
                                        アクセス
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/news" className="hover:opacity-100 transition-opacity">
                                        ニュース
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/policy" className="hover:opacity-100 transition-opacity">
                                        サイトポリシー
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="pt-12">
                            <ul className="space-y-2 text-sm opacity-80">
                                <h4 className="font-bold uppercase tracking-widest mb-4 text-sm opacity-60">その他</h4>
                                <li>
                                    <Link href="/greeting" className="hover:opacity-100 transition-opacity">
                                        自治会長・文化委員長挨拶
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/faq" className="hover:opacity-100 transition-opacity">
                                        よくあるご質問
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="hover:opacity-100 transition-opacity">
                                        お問い合わせ
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {!useMobile() && (
                        <div className="pt-12 flex gap-2 md:justify-end h-fit">
                            <Link href="https://lin.ee/Rw1wF2U" className={"p-2"}><Line height={40}/></Link>
                            <Link href="https://instagram.com/kobe.souritsukinen.sai_130" className={"p-2"}><Instagram
                                height={40}/></Link>
                        </div>)}
                </div>
            </div>
        </footer>
    )
}
