"use client"

import {usePageTitle} from "@/hooks/page-title-context";

export default function Heading() {
    const { title: pageTitle } = usePageTitle()

    if (pageTitle && pageTitle.length > 0) {
        return (
            <div className="mb-12 pt-8 max-w-screen mx-auto ">
                <h1 className="text-5xl font-bold mb-4 tracking-tight text-balance wrap-anywhere flex items-center gap-12 md:pl-4 md:border-l-4 md:border-l-secondary">
                    {pageTitle}
                    <div className="relative flex-1 min-w-0 h-3.5 after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:h-2 after:bg-secondary before:content-[''] before:absolute before:top-3 before:left-0 before:right-1/4 before:h-1 before:bg-accent" />
                </h1>
            </div>
        )
    }
    return null
}