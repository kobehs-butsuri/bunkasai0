import MapGF from "@/map/map-gf.svg"
import Map1F from "@/map/map-1f.svg"
import Map2F from "@/map/map-2f.svg"
import Map3F from "@/map/map-3f.svg"
import Map4F from "@/map/map-4f.svg"
import Map5F from "@/map/map-5f.svg"

interface MapProps {
    layer?: number
}
export function MapSVG({ layer = 0 }: MapProps) {
    return (
        <>
            <div className={"w-full"} >
                { layer === 0 && (
                    <MapGF className={"w-full"} />
                )}
                { layer === 1 && (
                    <Map1F className={"w-full"} />
                )}
                { layer === 2 && (
                    <Map2F className={"w-full"} />
                )}
                { layer === 3 && (
                    <Map3F className={"w-full"} />
                )}
                { layer === 4 && (
                    <Map4F className={"w-full"} />
                )}
                { layer === 5 && (
                    <Map5F className={"w-full"} />
                )}
            </div>
        </>
    )
}