import Link from "next/link"

import { cn } from "@/lib/helpers"
import { COMPANY_NAME } from "@/utils/constants"

const FOOTER_LINKS = [
  { label: "FAQs", href: "/faqs" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Cookie Policy", href: "/cookie-policy" },
]

export const WebappFooter = ({ className }: { className?: string }) => {
  return (
    <footer
      className={cn(
        "border-border bg-background/70 supports-backdrop-filter:bg-background/55 text-muted-foreground relative border-t backdrop-blur",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(79,195,232,0.65),rgba(242,140,40,0.55),transparent)]" />
      <div className="grid w-full gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8 2xl:px-10">
        <div className="space-y-2">
          <div className="text-foreground text-sm font-semibold">{COMPANY_NAME}</div>
          <p className="text-muted-foreground text-sm leading-6">
            Modern, outcome-driven training in web development, mobile app development, and software engineering.
          </p>
        </div>

        <div className="space-y-2">
          <div className="text-foreground text-sm font-semibold">Contact</div>
          <div className="text-muted-foreground text-sm">Phone: +923144240550</div>
          <div className="text-muted-foreground text-sm">Email: info@techonskills.cloudrika.com</div>
          <div className="text-muted-foreground text-sm">Address: Lahore Punjab Pakistan</div>
        </div>

        <div className="space-y-2">
          <div className="text-foreground text-sm font-semibold">Legal</div>
          <nav className="flex flex-col gap-2 text-sm">
            {FOOTER_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-link hover:text-link-hover w-fit"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-border/70 flex w-full flex-col gap-2 border-t px-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 2xl:px-10">
        <div className="text-muted-foreground">
          © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
        </div>
        <div className="text-muted-foreground">Built with TechOn Skills.</div>
      </div>
    </footer>
  )
}

