import { ReactNode } from "react"

import { WebappFooter, WebappNavbar } from "@/lib/ui/useable-components"

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface flex min-h-svh flex-col">
      <WebappNavbar />
      <main className="w-full flex-1">{children}</main>
      <WebappFooter />
    </div>
  )
}

