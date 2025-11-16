"use client"

export default function GoogleMap(){
    return (
        <div className="border border-accent-light bg-foreground/5 h-96 flex items-center justify-center">
            <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6559.158108806984!2d135.2113529!3d34.7157958!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60008ebadd1ef657%3A0xe100dc45fc6cdf21!2z5YW15bqr55yM56uL56We5oi46auY562J5a2m5qCh!5e0!3m2!1sja!2sjp!4v1763264701633!5m2!1sja!2sjp" className="w-full h-full" loading="lazy"></iframe>
        </div>
    )
}