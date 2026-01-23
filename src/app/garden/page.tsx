import Content from "./content";
import {Metadata} from "next";
import Footer from "@/components/footer";

export const metadata : Metadata = {
    title: "園遊会",
}

export default function Schedule() {
    return (
        <>
            <Content/>
            <Footer/>
        </>
    )
}