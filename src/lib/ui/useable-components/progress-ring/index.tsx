"use client"

import { cn } from "@/lib/helpers"

const SIZE = 44
const STROKE_WIDTH = 4
const RADIUS = (SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

type Props = {
    value: number
    size?: number
    strokeWidth?: number
    className?: string
    children?: React.ReactNode
}

export function ProgressRing({
    value,
    size = SIZE,
    strokeWidth = STROKE_WIDTH,
    className,
    children,
}: Props) {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const clamped = Math.min(100, Math.max(0, value))
    const offset = circumference - (clamped / 100) * circumference

    return (
        <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                className="-rotate-90"
                aria-hidden
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-(--border-soft-divider-light) dark:text-(--border-soft-divider-dark) opacity-40"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="text-(--brand-secondary) dark:text-(--brand-highlight) transition-[stroke-dashoffset] duration-500 ease-out"
                />
            </svg>
            {children != null ? (
                <div className="absolute inset-0 flex items-center justify-center text-center">
                    {children}
                </div>
            ) : null}
        </div>
    )
}
