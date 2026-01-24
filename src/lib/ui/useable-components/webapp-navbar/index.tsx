"use client"

import Image from "next/image"
import Link from "next/link"
import { MenuIcon } from "lucide-react"

import { cn } from "@/lib/helpers"
import { Button } from "@/lib/ui/useable-components/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/lib/ui/useable-components/sheet"
import TechOnLogo from "@/lib/assets/techon-skills-logo-rm-bg.png"
import { COMPANY_NAME } from "@/utils/constants"
import { SheetContentSide } from "@/utils/enums"
import { ThemeSwitcher } from "@/lib/ui/useable-components/theme-switcher"
import { ContinueToDashboardDialog } from "@/lib/ui/useable-components/continue-dashboard-dialog"

const NAV_ITEMS = [
  { label: "Courses", href: "/courses" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
]

export const WebappNavbar = ({ className }: { className?: string }) => {
  return (
    <header
      className={cn(
        "border-border/60 supports-backdrop-filter:bg-background/60 bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur",
        className
      )}
    >
      <div className="flex h-16 w-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 2xl:px-10">
        <div className="flex min-w-0 items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                shape="pill"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <MenuIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={SheetContentSide.LEFT} className="w-[18rem] p-0">
              <SheetHeader className="border-border border-b p-4">
                <SheetTitle className="flex items-center gap-2">
                  <Image
                    src={TechOnLogo}
                    alt={COMPANY_NAME}
                    width={28}
                    height={28}
                    className="size-7"
                    priority
                  />
                  <span className="truncate">{COMPANY_NAME}</span>
                </SheetTitle>
              </SheetHeader>

              <nav className="p-2">
                <div className="flex flex-col gap-1">
                  {NAV_ITEMS.map((item) => (
                    <SheetClose key={item.href} asChild>
                      <Button
                        asChild
                        variant="ghost"
                        shape="lg"
                        className="justify-start"
                      >
                        <Link href={item.href}>{item.label}</Link>
                      </Button>
                    </SheetClose>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <Link
            href="/"
            className="hover:bg-accent/40 flex min-w-0 items-center gap-2 rounded-xl px-2 py-2 transition-colors"
            aria-label={`${COMPANY_NAME} home`}
          >
            <Image
              src={TechOnLogo}
              alt={COMPANY_NAME}
              width={32}
              height={32}
              className="size-8"
              priority
            />
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-semibold">{COMPANY_NAME}</div>
              <div className="text-muted-foreground truncate text-xs">
                Learn. Build. Grow.
              </div>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-2 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Button key={item.href} asChild variant="ghost" shape="pill">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeSwitcher className="hidden sm:inline-flex" />
          <ContinueToDashboardDialog />
        </div>
      </div>
    </header>
  )
}

