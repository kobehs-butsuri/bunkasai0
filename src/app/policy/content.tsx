"use client"

import {useSetPageTitle} from "@/hooks/page-title-context";
import Link from "next/link";

export default function Policy() {
    useSetPageTitle("サイトポリシー")
    return (
        <div className="max-w-7xl mx-auto">
            <div className="space-y-12 mx-10">
                <section>
                    <h2 className="text-3xl font-bold text-foreground mb-6">著作権について</h2>
                    <div className="prose prose-neutral max-w-none">
                        <p className="text-foreground/80 mb-4">
                            本サイトに掲載されているコンテンツ(文章、画像、デザイン、レイアウト等)の著作権は、当サイト運営者または正当な権利者に帰属します。
                        </p>
                        <p className="text-foreground/80 mb-4">
                            これらのコンテンツを、著作権者の許諾なく複製、転用、販売などの二次利用することを禁じます。
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-foreground mb-6">リンクについて</h2>
                    <div className="prose prose-neutral max-w-none">
                        <p className="text-foreground/80 mb-4">
                            本サイトへのリンクは、原則として自由です。ただし、以下の場合はリンクをお断りする場合があります。
                        </p>
                        <ul className="list-disc list-inside text-foreground/80 space-y-2 mb-4">
                            <li>公序良俗に反するサイトからのリンク</li>
                            <li>当サイトの信用を毀損する恐れのあるサイトからのリンク</li>
                            <li>フレーム内に本サイトを表示するようなリンク</li>
                            <li>その他、当サイトが不適切と判断するサイトからのリンク</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-foreground mb-6">免責事項</h2>
                    <div className="prose prose-neutral max-w-none">
                        <p className="text-foreground/80 mb-4">
                            本サイトに掲載されている情報の正確性については万全を期しておりますが、当サイト運営者は利用者が本サイトの情報を用いて行う一切の行為について、何ら責任を負うものではありません。
                        </p>
                        <p className="text-foreground/80 mb-4">
                            本サイトは予告なく内容を変更または削除する場合がありますので、あらかじめご了承ください。
                        </p>
                        <p className="text-foreground/80 mb-4">
                            本サイトからリンクされている外部サイトの内容については、当サイト運営者は一切の責任を負いません。
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-foreground mb-6">使用しているライブラリ・ライセンス</h2>
                    <div className="prose prose-neutral max-w-none">
                        <p className="text-foreground/80 mb-4">
                            本サイトでは、以下のオープンソースライブラリを使用しています。
                        </p>
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold text-foreground mb-3">主要なライブラリ</h3>
                            <ul className="list-disc list-inside text-foreground/80 space-y-2">
                                <li><Link href="https://nextjs.org/"><strong>Next.js</strong></Link> - MIT License</li>
                                <li><Link href="https://react.dev/"><strong>React</strong></Link> - MIT License</li>
                                <li><Link href="https://tailwindcss.com/"><strong>Tailwind CSS</strong></Link> - MIT License</li>
                                <li><Link href="https://www.radix-ui.com/"><strong>Radix UI</strong></Link> - MIT License</li>
                                <li><Link href="https://lucide.dev/"><strong>Lucide React</strong></Link> - ISC License</li>
                            </ul>
                        </div>
                        <p className="text-foreground/80 mb-4">
                            各ライブラリの詳細なライセンス情報については、それぞれのプロジェクトページをご参照ください。
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-foreground mb-6">ポリシーの変更</h2>
                    <div className="prose prose-neutral max-w-none">
                        <p className="text-foreground/80 mb-4">
                            本ポリシーの内容は、法令の変更やサービス内容の変更等に応じて、予告なく変更する場合があります。
                        </p>
                        <p className="text-foreground/80 mb-4">
                            変更後のポリシーは、本ページに掲載した時点で効力を生じるものとします。
                        </p>
                    </div>
                </section>
            </div>
        </div>
    )
}
