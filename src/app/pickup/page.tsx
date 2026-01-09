import Content from "./content";
import {Metadata} from "next";
import Footer from "@/components/footer";
import type React from "react";

export const metadata : Metadata = {
    title: "Pick Up",
}

export default async function Pickup() {
    return <>
        <Content/>
        <Footer/>
    </>
}