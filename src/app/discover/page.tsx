import Content from "./content";
import {Metadata} from "next";
import Footer from "@/components/footer";
import type React from "react";

export const metadata : Metadata = {
    title: "Discover",
}

export default async function Discover() {
    return <>
        <Content/>
        <Footer/>
    </>
}