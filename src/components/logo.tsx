import EmblemSVG from "@/components/logos/emblem.svg"
import LogoSVG from "@/components/logos/logo.svg"

interface LogoProps {
    size?: number
    className?: string
}

export function Emblem({ size = 20, className = "" }: LogoProps) {
    return (
            <EmblemSVG className={className} height={size} />
    )
}

export function Logo({ size = 20, className = "" }: LogoProps) {
    return (
        <LogoSVG className={className} height={size} />
    )
}