import Content from "./content";
import {Metadata} from "next";

export const metadata : Metadata = {
    title: "タイムテーブル",
}

export default function Access() {
    return (
        <Content/>
    )
}