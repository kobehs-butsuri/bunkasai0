import {Metadata} from "next";
import Footer from "@/components/footer";
import Content from "./content";

export const metadata : Metadata = {
    title: "スローガン・ロゴ・エンブレム紹介",
}

export default function Introduce() {
    return (
        <>
            <Content/>
            <Footer/>
        </>
    )
}