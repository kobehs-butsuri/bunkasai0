import Content from "./content";
import {Metadata} from "next";

export const metadata : Metadata = {
    title: "校内マップ",
}

export default async function Map() {
    return <Content />
}