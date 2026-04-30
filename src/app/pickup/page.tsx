import Content from "./content";
import {Metadata} from "next";
import Footer from "@/components/footer";

export const metadata : Metadata = {
    title: "Pick Up",
}

export default function Schedule() {
    return (
        <>
            <Content/>
            <Footer/>
        </>
    )
}