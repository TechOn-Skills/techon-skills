import { cva } from "class-variance-authority";

export const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap border border-transparent text-sm font-medium transition-all select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                // Brand + theme tokens from `src/app/globals.css`
                default:
                    "bg-[var(--brand-primary)] text-[color:var(--text-on-dark)] hover:brightness-95 active:brightness-90",
                "brand-secondary":
                    "bg-[var(--brand-secondary)] text-[color:var(--text-on-dark)] hover:brightness-95 active:brightness-90",
                accent:
                    "bg-[var(--brand-accent)] text-[color:var(--text-on-dark)] hover:brightness-95 active:brightness-90",
                highlight:
                    "bg-[var(--brand-highlight)] text-[color:var(--text-primary-light)] hover:brightness-95 active:brightness-90",

                surface:
                    "bg-[var(--background-surface)] text-primary border-[var(--border-default)] hover:bg-[var(--background-hover)]",
                muted:
                    "bg-[var(--background-secondary)] text-secondary border-[var(--border-default)] hover:bg-[var(--background-hover)]",

                destructive:
                    "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
                success:
                    "bg-[var(--system-success)] text-[color:var(--text-on-dark)] hover:brightness-95 active:brightness-90",
                warning:
                    "bg-[var(--system-warning)] text-black/90 hover:brightness-95 active:brightness-90",
                info: "bg-[var(--system-info)] text-white hover:brightness-95 active:brightness-90",

                outline:
                    "bg-transparent text-primary border-[var(--border-default)] shadow-xs hover:bg-[var(--background-hover)]",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost:
                    "bg-transparent text-primary hover:bg-[var(--background-hover)]",
                link: "bg-transparent text-link underline-offset-4 hover:underline hover:text-link-hover",
            },
            size: {
                xs: "h-7 px-2.5 text-xs gap-1.5 has-[>svg]:px-2",
                sm: "h-8 px-3 gap-1.5 has-[>svg]:px-2.5",
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                lg: "h-10 px-6 has-[>svg]:px-4",
                xl: "h-11 px-8 text-base has-[>svg]:px-6",
                "2xl": "h-12 px-10 text-base has-[>svg]:px-7",

                "icon-xs": "size-7 p-0",
                "icon-sm": "size-8 p-0",
                icon: "size-9 p-0",
                "icon-lg": "size-10 p-0",
                "icon-xl": "size-11 p-0",
            },
            shape: {
                none: "rounded-none",
                square: "rounded-none",
                sm: "rounded-sm",
                md: "rounded-md",
                lg: "rounded-lg",
                xl: "rounded-xl",
                "2xl": "rounded-2xl",
                full: "rounded-full",
                pill: "rounded-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            shape: "md",
        },
    }
)