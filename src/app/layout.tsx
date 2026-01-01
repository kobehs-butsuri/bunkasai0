import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { PageTitleProvider } from "@/hooks/page-title-context"
import Heading from "@/components/heading"
import { Noto_Sans_JP } from "next/font/google"
import { Toolbar } from "@/components/tool-bar"

const noto = Noto_Sans_JP({
    weight: ["400", "700"],
    style: "normal",
    subsets: ["latin"],
})

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
        <html lang="ja">
        <body className={`font-sans antialiased flex flex-col min-h-screen w-full min-w-[80vw] overflow-x-hidden mr-0 ${noto.className}`}>
        <PageTitleProvider>
            <Header/>
            <main className="mt-40 w-full bg-background grow mb-16">
                <div className={"px-8"}>
                    <Heading />
                </div>
                {children}
            </main>
            <Footer/>
        </PageTitleProvider>
        <div className="z-10">
            <Toolbar/>
        </div>
        </body>
        </html>
    )
}