"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Footer from "@/components/footer"

export function Content() {
    const [answer, setAnswer] = useState("")
    const router = useRouter()

    const correctAnswer = "bravo"

    const handleSubmit = () => {
        if (answer.toLowerCase() === correctAnswer) {
            router.push("/quiz/dfejiaoes")
        } else {
            alert("不正解")
        }
    }

    return (
        <>
            <div className="max-w-7xl mx-auto select-none">
                <div className="space-y-12 mx-10 mt-20">
                    <section className="min-h-[calc(100dvh-100px)] md:min-h-[calc(100dvh-84px)]">
                        <h1 className="text-4xl leading-none font-bold my-5">
                            EX問題
                        </h1>
                        <input
                            name="field"
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="bg-white border border-black focus:outline-blue-500 my-5"
                        />
                        <button
                            className="bg-white border border-black focus:outline-none"
                            onClick={handleSubmit}
                        >
                            確定
                        </button>
                        <img
                            src="/image/dsDfdnjazAerw.PNG"
                            alt=""
                            className="border border-black my-5"
                        />
                    </section>
                </div>
            </div>
            <Footer />
        </>
    )
}