import {Metadata} from "next";
import Footer from "@/components/footer";

export const metadata : Metadata = {
    title: "謎解き",
}

export default function Schedule() {
    return (
        <>

            <div className="max-w-7xl mx-auto">
                <div className="space-y-12 mx-10">
                    <section className="h-[calc(100dvh-100px)] md:h-[calc(100dvh-84px)] flex items-center justify-center">
                        <p>
                            神戸高校創立記念祭、謎解きへようこそ！謎を解きながら校内を歩き回って、創立記念祭を楽しもう！<br/><br/>
                            まずは初めの問題を解き、答えの場所に向かおう。向かった先で文字を集めて、【①②③④】が示す場所に行こう。<br/><br/>
                            どこかわかりにくい場所が答えになる場合もあるので、その時は創立記念祭公式ページの「マップ」で「検索」すればすぐに辿り着ける。<br/><br/>
                            会議室Aでは問題のヒントがもらえる。すべての問題は問題番号が振られているので、担当の人に問題番号とどこかわからないのかを説明すると、適切なヒントがもらえる。<br/><br/>
                            問題番号「Boss」の問題の答えがわかったら会議室Aに行って答えを伝えると、景品がもらえる。
                        </p>
                    </section>
                </div>
            </div>
            <Footer/>
        </>
    )
}