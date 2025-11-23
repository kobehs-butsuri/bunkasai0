import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
    title: "タイトル",
    description: "説明文",
    generator: "v0.app",
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
        <body className={`font-sans antialiased flex flex-col min-h-screen`}>
            <Header/>
            <main className="w-full bg-background flex-grow px-8">
                {children}
            </main>
            <Footer/>
        </body>
        </html>
    )
}
