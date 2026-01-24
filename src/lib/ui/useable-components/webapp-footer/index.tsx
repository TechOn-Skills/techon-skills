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
        "border-border bg-[linear-gradient(135deg,var(--brand-primary),rgba(7,26,43,0.9))] text-(--text-on-dark) relative border-t",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(70,208,255,0.75),rgba(255,138,61,0.55),transparent)]" />
      <div className="w-full px-4 py-10 sm:px-6 lg:px-8 2xl:px-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-2">
            <div className="text-sm font-semibold">{COMPANY_NAME}</div>
            <p className="text-(--text-on-dark)/75 text-sm leading-6">
              Modern, outcome-driven training in web development, mobile app development, and software engineering.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">Contact</div>
            <div className="text-(--text-on-dark)/75 text-sm">Phone: +923144240550</div>
            <div className="text-(--text-on-dark)/75 text-sm">Email: info@cloudrika.com</div>
            <div className="text-(--text-on-dark)/75 text-sm">Address: Lahore Punjab Pakistan</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">Legal</div>
            <nav className="flex flex-col gap-2 text-sm">
              {FOOTER_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-(--text-on-dark)/80 hover:text-(--text-on-dark) w-fit transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="text-(--text-on-dark)/70">
            © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
          </div>
          <div className="text-(--text-on-dark)/70">Built with TechOn Skills.</div>
        </div>
      </div>
    </footer>
  )
}

