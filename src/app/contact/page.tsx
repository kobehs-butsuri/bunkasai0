import {Metadata} from "next";
import Footer from "@/components/footer";

export const metadata : Metadata = {
    title: "お問い合わせ",
}

export default function Contact() {
    return (
        <>
            <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSdRcSirRn90UZA2LBCpRlTq0vpPECDzyGJF4dBJyq4NSR6c3Q/viewform?embedded=true"
                className="w-full max-w-7xl mx-auto h-[calc(100dvh-8rem)] md:h-[calc(100dvh-5rem)] block"
            />
            <Footer/>
        </>
    )
}