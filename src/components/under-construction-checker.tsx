'use client';

import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import Link from "next/link";
import Footer from "@/components/footer";
import ConstructingSVG from "@/components/decoration/constructing.svg"

const underConstructionPages = [
    '/access',
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
            <div className={"flex flex-col-reverse md:flex-row w-full justify-center h-[calc(100vh-4rem-4rem)] md:h-[calc(100vh-5rem)]"}>
                <div className="flex flex-col mb-20 md:m-0 items-center justify-center h-fit md:h-screen max-h-200 text-center">
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
                <div className="flex flex-col items-center justify-center h-fit md:h-screen max-h-200 text-center">
                    <span
                        className="max-w-150 max-h-40 mb-10 md:m-20 w-full h-40 md:h-full flex items-center justify-center"
                    >
                        <ConstructingSVG className="w-full h-full object-contain"/>
                    </span>
                </div>
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

    if (process.env.NODE_ENV != "development" && showUnderConstruction) {
        return <UnderConstructionContent />;
    }

    return <>{children}</>;
}