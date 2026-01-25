'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import Link from "next/link";
import Footer from "@/components/footer";

const underConstructionPages = [
    '/contact',
    '/event',
    '/faq',
    '/greeting',
    '/map',
    '/news',
    '/pickup',
    '/schedule',
];

function isUnderConstruction(pathname: string): boolean {
    const normalizedPath = pathname.replace(/\/$/, '') || '/';

    return underConstructionPages.some(page => {
        const normalizedPage = page.replace(/\/$/, '');
        return normalizedPath === normalizedPage ||
            normalizedPath.startsWith(normalizedPage + '/');
    });
}

function UnderConstructionContent() {
    return (
        <div className={"bg-background"}>
            <div className="flex flex-col items-center justify-center h-screen max-h-200 text-center">
                <h1 className={"text-5xl font-bold text-accent-foreground"}>
                    工事中
                </h1>
                <p className="lead text-muted-foreground mb-4">
                    このページは現在準備中です。
                </p>
                <Link
                    href="/"
                    className={"inline-flex p-2 bg-muted text-accent-foreground"}
                >
                    トップページへ戻る
                </Link>
            </div>
            <Footer/>
        </div>
    );
}

export default function UnderConstructionChecker({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const showUnderConstruction = useMemo(() => {
        return isUnderConstruction(pathname);
    }, [pathname]);

    if (showUnderConstruction) {
        return <UnderConstructionContent />;
    }

    return <>{children}</>;
}