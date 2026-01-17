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
            <div className={"w-100"} >
                { layer === 0 && (
                    <MapGF className={"w-100"} />
                )}
                { layer === 1 && (
                    <Map1F className={"w-100"} />
                )}
                { layer === 2 && (
                    <Map2F className={"w-100"} />
                )}
                { layer === 3 && (
                    <Map3F className={"w-100"} />
                )}
                { layer === 4 && (
                    <Map4F className={"w-100"} />
                )}
                { layer === 5 && (
                    <Map5F className={"w-100"} />
                )}
                { layer === 6 && (
                    <div className={"w-100 grid grid-cols-1 grid-rows-1"}>
                        <div className={"col-start-1 row-start-1 pt-105"}>
                            <div style={{transform: 'skewX(-15deg)', zIndex: 10}}>
                                <MapGF className={"w-full"}/>
                            </div>
                        </div>
                        <div className={"col-start-1 row-start-1 pt-88"}>
                            <div style={{transform: 'skewX(-15deg)', zIndex: 20}}>
                                <Map1F className={"w-full"}/>
                            </div>
                        </div>
                        <div className={"col-start-1 row-start-1 pt-65"}>
                            <div style={{transform: 'skewX(-15deg)', zIndex: 30}}>
                                <Map2F className={"w-full"}/>
                            </div>
                        </div>
                        <div className={"col-start-1 row-start-1 pt-26"}>
                            <div style={{transform: 'skewX(-15deg)', zIndex: 40}}>
                                <Map3F className={"w-full"}/>
                            </div>
                        </div>
                        <div className={"col-start-1 row-start-1 pt-13"}>
                            <div style={{transform: 'skewX(-15deg)', zIndex: 50}}>
                                <Map4F className={"w-full"}/>
                            </div>
                        </div>
                        <div className={"col-start-1 row-start-1 pt-0"}>
                            <div style={{transform: 'skewX(-15deg)', zIndex: 60}}>
                                <Map5F className={"w-full"}/>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}