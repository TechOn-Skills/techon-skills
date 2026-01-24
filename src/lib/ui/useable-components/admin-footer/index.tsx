import Link from "next/link"

import { cn } from "@/lib/helpers"
import type { IAdminFooterProps } from "@/utils/interfaces"
import { COMPANY_NAME } from "@/utils/constants"

export const AdminFooter = ({
  className,
  links,
  children,
}: IAdminFooterProps) => {
  return (
    <footer
      className={cn(
        "border-border bg-background text-muted-foreground border-t",
        className
      )}
    >
      <div className="flex w-full flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 2xl:px-10">
        <div className="text-sm">
          © {new Date().getFullYear()} {COMPANY_NAME}
        </div>

        {children}

        {!!links?.length && (
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-link hover:text-link-hover"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </footer>
  )
}

