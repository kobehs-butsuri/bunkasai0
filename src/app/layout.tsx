import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/header"
import { PageTitleProvider } from "@/hooks/page-title-context"
import Heading from "@/components/heading"
import { lineSeedSans } from "@/font/localFont"
import { Toolbar } from "@/components/tool-bar"
import NextTopLoader from "nextjs-toploader";



export const metadata: Metadata = {
    title: {
        default: 'BOth',
        template: '%s | BOth',
    },
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
                <div className={"px-8 max-w-7xl mx-auto"}>
                    <Heading />
                </div>
                {children}
            </main>
        </PageTitleProvider>
        <div className="z-50">
            <Toolbar/>
        </div>
        </body>
        </html>
    )
}