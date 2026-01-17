"use client"

import {usePageTitle} from "@/hooks/page-title-context";

export default function Heading() {
    const { title: pageTitle } = usePageTitle()

    if (pageTitle && pageTitle.length > 0) {
        return (
            <div className="mb-12 pt-8 max-w-screen mx-auto">
                <h1 className="text-5xl font-bold mb-4 tracking-tight text-balance wrap-anywhere">{pageTitle}</h1>
            </div>
        )
    }
    return null
}