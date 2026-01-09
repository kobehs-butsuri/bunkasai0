import Content from "./content";
import {Metadata} from "next";
import Footer from "@/components/footer";

export const metadata : Metadata = {
    title: "イベント一覧",
}

export default function Map() {
    return (
        <>
            <Content/>
            <Footer/>
        </>
    )
}