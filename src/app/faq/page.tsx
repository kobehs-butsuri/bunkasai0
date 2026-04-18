import {Metadata} from "next";
import Footer from "@/components/footer";
import { Content } from "./content"
import qaData from "@/data/qa-data.json"

export const metadata : Metadata = {
    title: "よくあるご質問",
}

export default function Faq() {
    return (
        <>
            <Content data={qaData} />
            <Footer/>
        </>
    )
}