import festivalDataRaw from "@/data/festival.json"
import {FestivalData} from "@/data/types";

const festivalData = festivalDataRaw as FestivalData

export const dynamic = "force-static"

export async function GET() {
    const performances = festivalData.performances.map((p) => ({ id: p.id }))
    const exhibitions = festivalData.exhibitions.map((e) => ({ id: e.id }))
    const paths = [
        "",
        "map/",
        "schedule/",
        "event/",
        "access/",
        "news/",
        "introduce/",
        "pickup/",
        "garden/",
        "policy/",
        "greeting/",
        "faq/",
        "contact/",
    ]
    const dynamic_paths = [...performances, ...exhibitions]

    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${dynamic_paths
        .map((path) => {
            return `  <url>\n    <loc>https://both-khs.pages.dev/event/${path.id}</loc>\n  </url>`
        })
        .join("\n")}\n${paths
        .map((path) => {
            return `  <url>\n    <loc>https://both-khs.pages.dev/${path}</loc>\n  </url>`
        })}\n</urlset>\n`

    return new Response(body, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, s-maxage=3600",
        },
    })
}