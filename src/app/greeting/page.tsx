import {Metadata} from "next";
import Footer from "@/components/footer";

export const metadata : Metadata = {
    title: "自治会長・文化委員長挨拶",
}

export default function Greeting() {
    return (
        <>
            <Footer/>
        </>
    )
}