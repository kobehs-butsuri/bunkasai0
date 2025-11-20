import type { Metadata } from 'next'
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata:Metadata = {
    title: '404'
}

export default function NotFound() {
    return (
        <div className="bg-background text-foreground">
            <Header />

            <main className="pt-32 pb-24 px-8 max-w-full mx-auto h-screen">
                <div className="mb-12 pt-8 max-w-7xl mx-auto">
                    <h1 className="text-5xl font-bold mb-4 tracking-tight text-balance">404</h1>
                </div>
            </main>

            <Footer />
        </div>
    );
}