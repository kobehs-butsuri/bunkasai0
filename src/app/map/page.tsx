import Content from "./content";
import {Metadata} from "next";

export const metadata : Metadata = {
    title: "校内マップ",
}

type Props = {
    searchParams: { id?: string }
}

export default function Map({ searchParams }: Props) {
    return (
        <Content initialRoomId={searchParams.id} />
    )
}