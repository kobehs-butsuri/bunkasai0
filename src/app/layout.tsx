import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/header"
import { PageTitleProvider } from "@/hooks/page-title-context"
import Heading from "@/components/heading"
import { lineSeedSans } from "@/font/localFont"
import { Toolbar } from "@/components/tool-bar"
import NextTopLoader from "nextjs-toploader";
import UnderConstructionChecker from "@/components/under-construction-checker";



export const metadata: Metadata = {
    title: {
        default: '「BOth」第130回神戸高校創立記念祭・文化祭',
        template: '%s | 「BOth」第130回神戸高校創立記念祭・文化祭',
    },
    description: '兵庫県立神戸高等学校の第130回創立記念祭・文化祭「BOth」公式ウェブサイトです。\
一般祭（一般公開）は、2026年5月3日(日)に開催いたします。神高生一同、皆さまのご来場をお待ちしております！　ぜひ神戸高校へお越しください！\
当サイトでは、神戸高校へのアクセスや当日のタイムスケジュール、校内マップ、各クラスや部活動による展示・ステージ発表・模擬店の一覧、ご来場に関するよくある質問（FAQ）をご確認できます。',
    icons: {
        icon: [
            {
                url: "/icon-light-32x32.png",
                media: "(prefers-color-scheme: light)",
            },
            {
                url: "/icon-dark-32x32.png",
                media: "(prefers-color-scheme: dark)",
            },
            {
                url: "/icon.svg",
                type: "image/svg+xml",
            },
        ],
        apple: "/apple-icon.png",
    },
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="ja" className={lineSeedSans.className}>
        <body className={`font-sans antialiased flex flex-col min-h-screen w-full min-w-[80vw] mr-0 ${lineSeedSans.className}`}>
        <NextTopLoader color="#e94709" />
        <PageTitleProvider>
            <Header/>
            <main className="mt-16 md:mt-20 w-full bg-background grow">
                <UnderConstructionChecker>
                    <div className={"px-8 max-w-7xl mx-auto"}>
                        <Heading />
                    </div>
                    {children}
                </UnderConstructionChecker>
            </main>
        </PageTitleProvider>
        <div className="z-50">
            <Toolbar/>
        </div>
        </body>
        </html>
    )
}