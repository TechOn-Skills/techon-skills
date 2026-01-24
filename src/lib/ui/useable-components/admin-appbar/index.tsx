"use client"

import Image from "next/image"
import Link from "next/link"
import {
    ChevronDownIcon,
    LogOutIcon,
    SettingsIcon,
} from "lucide-react"

import { cn } from "@/lib/helpers"
import { Button } from "@/lib/ui/useable-components/button"
import { Separator } from "@/lib/ui/useable-components/separator"
import TechOnLogo from "@/lib/assets/techon-skills-logo-rm-bg.png"
import { COMPANY_NAME, CONFIG } from "@/utils/constants"
import { SidebarTrigger } from "@/lib/ui/useable-components/sidebar"
import { ThemeSwitcher } from "@/lib/ui/useable-components/theme-switcher"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

export const AdminAppbar = ({ className }: { className?: string }) => {
    const router = useRouter()

    const handleLogout = useCallback(() => {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.AUTH.TOKEN)
        localStorage.removeItem(CONFIG.STORAGE_KEYS.AUTH.REFRESH_TOKEN)
        router.push(CONFIG.ROUTES.AUTH.LOGIN)
    }, [router])
    return (
        <header
            className={cn(
                "border-border/60 supports-backdrop-filter:bg-background/60 bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur",
                className
            )}
        >
            <div className="flex h-14 w-full items-center gap-3 px-4 sm:px-6 lg:px-8 2xl:px-10">
                <div className="flex min-w-0 items-center gap-2">
                    <div className="md:hidden">
                        <SidebarTrigger aria-label="Open navigation" />
                    </div>

                    <Link
                        href={CONFIG.ROUTES.ADMIN.DASHBOARD}
                        className="hover:bg-accent/40 flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 transition-colors"
                        aria-label={`${COMPANY_NAME} admin home`}
                    >
                        <Image
                            src={TechOnLogo}
                            alt={COMPANY_NAME}
                            width={28}
                            height={28}
                            className="size-7"
                            priority
                        />
                        <div className="min-w-0 leading-tight">
                            <div className="truncate text-sm font-semibold">{COMPANY_NAME}</div>
                            <div className="text-muted-foreground truncate text-xs">
                                Admin panel
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <ThemeSwitcher className="hidden sm:inline-flex" />
                    <DialogPrimitive.Root>
                        <DialogPrimitive.Trigger asChild>
                            <Button
                                variant="ghost"
                                shape="pill"
                                className="h-10 gap-2 px-2"
                                aria-label="Open profile menu"
                            >
                                <span className="bg-(--brand-primary) text-(--text-on-dark) inline-flex size-8 items-center justify-center overflow-hidden rounded-full">
                                    <Image
                                        src={TechOnLogo}
                                        alt="Profile"
                                        width={20}
                                        height={20}
                                        className="size-5"
                                    />
                                </span>
                                <span className="hidden max-w-40 truncate text-sm font-medium sm:block">
                                    Admin
                                </span>
                                <ChevronDownIcon className="text-muted-foreground hidden size-4 sm:block" />
                            </Button>
                        </DialogPrimitive.Trigger>

                        <DialogPrimitive.Portal>
                            <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/20" />
                            <DialogPrimitive.Content
                                className={cn(
                                    "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed right-4 top-[3.75rem] z-50 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-xl border shadow-lg outline-none"
                                )}
                            >
                                <div className="p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-(--brand-primary) text-(--text-on-dark) flex size-10 items-center justify-center overflow-hidden rounded-full">
                                            <Image
                                                src={TechOnLogo}
                                                alt="Profile"
                                                width={24}
                                                height={24}
                                                className="size-6"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-semibold">Admin</div>
                                            <div className="text-muted-foreground truncate text-xs">
                                                {COMPANY_NAME}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="p-2">
                                    <DialogPrimitive.Close asChild>
                                        <Button asChild variant="ghost" shape="lg" className="w-full justify-start">
                                            <Link href={CONFIG.ROUTES.ADMIN.SETTINGS}>
                                                <SettingsIcon className="size-4 text-muted-foreground" />
                                                <span>Settings</span>
                                            </Link>
                                        </Button>
                                    </DialogPrimitive.Close>

                                    <DialogPrimitive.Close asChild>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            shape="lg"
                                            className="w-full justify-start text-red-600 hover:text-red-700"
                                            onClick={handleLogout}
                                        >
                                            <LogOutIcon className="size-4" />
                                            <span>Logout</span>
                                        </Button>
                                    </DialogPrimitive.Close>
                                </div>
                            </DialogPrimitive.Content>
                        </DialogPrimitive.Portal>
                    </DialogPrimitive.Root>
                </div>
            </div>
        </header>
    )
}