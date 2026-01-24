import { cn } from "@/lib/helpers"

export type TechId =
  | "nextjs"
  | "react"
  | "react-native"
  | "node"
  | "express"
  | "mongodb"
  | "postgres"
  | "graphql"
  | "python"
  | "fastapi"
  | "shopify"
  | "liquid"
  | "wordpress"
  | "woocommerce"
  | "elementor"
  | "wix"
  | "velo"

const Badge = ({ label }: { label: string }) => (
  <div className="text-xs font-semibold tracking-wide">{label}</div>
)

const TechMark = ({ id }: { id: TechId }) => {
  switch (id) {
    case "nextjs":
      return (
        <div className="grid place-items-center rounded-2xl bg-black text-white">
          <div className="text-lg font-semibold">N</div>
        </div>
      )
    case "mongodb":
      return (
        <div className="grid place-items-center rounded-2xl bg-[linear-gradient(135deg,#0f3d2e,#1db954)] text-white">
          <div className="text-base font-semibold">M</div>
        </div>
      )
    case "wordpress":
      return (
        <div className="grid place-items-center rounded-2xl bg-[#21759b] text-white">
          <div className="text-base font-semibold">W</div>
        </div>
      )
    case "elementor":
      return (
        <div className="grid place-items-center rounded-2xl bg-[#92003b] text-white">
          <div className="text-base font-semibold">E</div>
        </div>
      )
    case "wix":
      return (
        <div className="grid place-items-center rounded-2xl bg-[#111827] text-white">
          <div className="text-sm font-semibold">WiX</div>
        </div>
      )
    case "shopify":
      return (
        <div className="grid place-items-center rounded-2xl bg-[#0f7a3a] text-white">
          <div className="text-sm font-semibold">S</div>
        </div>
      )
    case "react":
      return (
        <div className="grid place-items-center rounded-2xl bg-[#0b2a45] text-white">
          <div className="text-sm font-semibold">⚛</div>
        </div>
      )
    case "react-native":
      return (
        <div className="grid place-items-center rounded-2xl bg-[#0b2a45] text-white">
          <div className="text-sm font-semibold">RN</div>
        </div>
      )
    case "node":
      return (
        <div className="grid place-items-center rounded-2xl bg-[#1f8f4d] text-white">
          <div className="text-sm font-semibold">Node</div>
        </div>
      )
    case "express":
      return (
        <div className="grid place-items-center rounded-2xl bg-[#111827] text-white">
          <div className="text-sm font-semibold">Ex</div>
        </div>
      )
    case "postgres":
      return (
        <div className="grid place-items-center rounded-2xl bg-[#2f6792] text-white">
          <div className="text-sm font-semibold">PG</div>
        </div>
      )
    case "graphql":
      return (
        <div className="grid place-items-center rounded-2xl bg-[#e10098] text-white">
          <div className="text-sm font-semibold">GQL</div>
        </div>
      )
    case "python":
      return (
        <div className="grid place-items-center rounded-2xl bg-[linear-gradient(135deg,#306998,#ffd43b)] text-white">
          <div className="text-sm font-semibold">Py</div>
        </div>
      )
    case "fastapi":
      return (
        <div className="grid place-items-center rounded-2xl bg-[#059669] text-white">
          <div className="text-sm font-semibold">FA</div>
        </div>
      )
    case "liquid":
      return (
        <div className="grid place-items-center rounded-2xl bg-[#10b981] text-white">
          <div className="text-sm font-semibold">LQ</div>
        </div>
      )
    case "woocommerce":
      return (
        <div className="grid place-items-center rounded-2xl bg-[#7f54b3] text-white">
          <div className="text-sm font-semibold">WC</div>
        </div>
      )
    case "velo":
      return (
        <div className="grid place-items-center rounded-2xl bg-[#111827] text-white">
          <div className="text-sm font-semibold">Velo</div>
        </div>
      )
    default:
      return (
        <div className="grid place-items-center rounded-2xl bg-[#0b2a45] text-white">
          <div className="text-sm font-semibold">T</div>
        </div>
      )
  }
}

export const TechLogoCard = ({
  id,
  label,
  className,
  delayMs = 0,
}: {
  id: TechId
  label: string
  className?: string
  delayMs?: number
}) => {
  return (
    <div
      className={cn(
        "group relative rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.35),rgba(255,138,61,0.18),transparent_70%)] p-px",
        className
      )}
      style={{
        animationDelay: `${delayMs}ms`,
      }}
    >
      <div className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 flex items-center gap-3 rounded-3xl border p-4 transition-all group-hover:-translate-y-0.5 group-hover:shadow-xl">
        <div className="relative">
          <div className="pointer-events-none absolute -inset-2 rounded-3xl bg-[radial-gradient(circle_at_center,rgba(70,208,255,0.28),transparent_60%)] opacity-0 blur-md transition-opacity group-hover:opacity-100" />
          <div className="size-12 animate-[tech-float_6s_ease-in-out_infinite]">
            <TechMark id={id} />
          </div>
        </div>
        <div className="min-w-0">
          <Badge label={label} />
          <div className="text-muted-foreground mt-1 text-xs">
            Used in real projects
          </div>
        </div>
      </div>
    </div>
  )
}

