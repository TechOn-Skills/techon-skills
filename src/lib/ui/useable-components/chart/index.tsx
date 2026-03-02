"use client"

import * as React from "react"
import { ResponsiveContainer, Tooltip } from "recharts"
import { cn } from "@/lib/helpers"

export type ChartConfig = Record<
  string,
  { label?: React.ReactNode; icon?: React.ComponentType; color?: string } & (
    | { color?: string; theme?: never }
    | { color?: never; theme?: Record<string, string> }
  )
>

const ChartContext = React.createContext<{ config: ChartConfig; id: string } | null>(null)

function useChart(): { config: ChartConfig; id: string } | null {
  return React.useContext(ChartContext)
}

type ChartContainerProps = React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ReactNode
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ config, className, children, ...props }, ref) => {
    const id = React.useId().replace(/:/g, "")
    return (
      <ChartContext.Provider value={{ config, id }}>
        <div
          ref={ref}
          className={cn("w-full", className)}
          style={
            Object.fromEntries(
              Object.entries(config)
                .map(([key, entry]) => {
                  const color = typeof entry === "object" && entry && "color" in entry ? entry.color : undefined
                  return color ? [`--color-${key}`, color] : null
                })
                .filter((e): e is [string, string] => e != null)
            ) as React.CSSProperties
          }
          {...props}
        >
          <ResponsiveContainer width="100%" height="100%" debounce={50}>
            {children}
          </ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

type ChartTooltipContentProps = {
  active?: boolean
  payload?: Array<{ name?: string; value?: number | string; dataKey?: string; color?: string; fill?: string }>
  label?: string
  labelFormatter?: (label: unknown) => React.ReactNode
  formatter?: (value: unknown) => React.ReactNode
  nameKey?: string
  hideLabel?: boolean
  className?: string
}

function ChartTooltipContent({
  active,
  payload = [],
  label,
  labelFormatter,
  formatter,
  nameKey,
  hideLabel,
  className,
}: ChartTooltipContentProps) {
  const ctx = useChart()
  const config = ctx?.config ?? {}
  if (!active || !payload?.length) return null
  const name = nameKey && config[nameKey] ? (config[nameKey].label ?? nameKey) : undefined
  return (
    <div
      className={cn(
        "rounded-lg border border-(--border-default-light) dark:border-(--border-default-dark) bg-card px-3 py-2 text-sm shadow-md",
        className
      )}
    >
      {!hideLabel && (
        <div className="font-medium text-foreground mb-1">
          {labelFormatter ? labelFormatter(label) : String(label ?? "")}
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        {payload.map((entry) => {
          const key = entry.dataKey ?? entry.name
          const cfg = key ? config[key as keyof typeof config] : undefined
          const displayName = (cfg && typeof cfg === "object" && cfg.label) ?? entry.name ?? key
          const value = formatter ? formatter(entry.value) : entry.value
          const color = entry.color ?? entry.fill
          return (
            <div key={String(key)} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                {color && (
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                )}
                <span className="text-muted-foreground">{displayName}</span>
              </span>
              <span className="font-medium tabular-nums text-foreground">{value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { ChartContainer, ChartTooltipContent, useChart }
