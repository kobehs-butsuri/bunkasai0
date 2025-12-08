// components/logo.tsx
interface LogoProps {
    size?: number
    className?: string
}

export default function Logo({ size = 20, className = "" }: LogoProps) {
    return (
        <svg
            className={className}
            height={size}
            viewBox="0 0 95 20"
            fill="currentColor"
        >
            <circle r="10" cx="10" cy="10"/>
            <circle r="10" cx="35" cy="10"/>
            <circle r="10" cx="60" cy="10"/>
            <circle r="10" cx="85" cy="10"/>
        </svg>
    )
}