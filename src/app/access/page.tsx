import Content from "./content";
import {Metadata} from "next";
import Footer from "@/components/footer";
import type React from "react";

export const metadata : Metadata = {
    title: "アクセス",
}

export default function Access() {
    return (
        <>
            <div className="mb-20">
                <Content/>
            </div>
            <Footer/>
        </>
    )
}