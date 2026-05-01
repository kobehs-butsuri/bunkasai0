import Content from "./content"
import { Metadata } from "next"
import Footer from "@/components/footer";

export const metadata: Metadata = {
    title: "鶴崎校長像",
    description: "初代校長、鶴崎久米一の像の紹介ページ",
}

export default function PrincipalStatue() {
    return (
        <>
            <Content />
            <Footer />
        </>
    )
}
