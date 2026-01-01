import Content from "./content";
import {Metadata} from "next";

export const metadata : Metadata = {
    title: "Discover",
}

export default async function Discover() {
    return <Content />
}