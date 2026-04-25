import { ReactNode } from "react"

import { WebappFooter, WebappNavbar } from "@/lib/ui/useable-components"

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface flex min-h-svh min-w-0 flex-col overflow-x-clip">
      <WebappNavbar />
      <main className="min-w-0 w-full flex-1">{children}</main>
      <WebappFooter />
    </div>
  )
}

