import {Metadata} from "next";
import Footer from "@/components/footer";

export const metadata : Metadata = {
    title: "ご挨拶",
}

export default function Greeting() {
    return (
        <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/greeting.svg"
                   alt={
`神戸高校　第130回創立記念祭へようこそ

今日　神戸高校の「伝統」と「変革」を

そして　神高生の「才気」と「情熱」も

ここで起きる偶然も必然も

目一杯　楽しんで

まだ見ぬ未来の伝統も

ここから　つくりだす

今の時代の変革を

ここから　こえていく

さあ　祭りの時間です


自治会長　中山大賀


第130回創立記念祭「BOth」のホームページを
ご覧いただきありがとうございます。

今年も音楽部による発表、文化部による展示：
ワークショップ、運動部によるチャレンジコーナー
などたくさんの企画を用意しております。

創立130周年という記念すべき年に
文化委員長として関われたことを
とても誇りに思います。

普段とはまた違った姿で活躍する神高生の姿。
長い歴史の詰まった校舎。

そして創立130周年という節目を迎えた
神戸高校の現在の姿にも
ご注目していただきたいと思っています。

たくさんの先輩方から受け継いだ伝統を
次の世代へとバトンたちできる
一年になるように全力を尽くします。

ご来場お待ちしております。

文化委員長　矢野りさ子`
            }
                   className={"max-w-3xl mx-auto w-full select-none"} />
            <Footer/>
        </>
    )
}