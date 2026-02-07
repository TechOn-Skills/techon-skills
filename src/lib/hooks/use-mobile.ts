import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT = 425
const DESKTOP_BREAKPOINT = 768

const getWidth = () => {
  if (typeof window === "undefined") {
    return DESKTOP_BREAKPOINT
  }

  return window.innerWidth
}

export function useBreakpoint() {
  const [width, setWidth] = useState(getWidth)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return {
    isMobile: width < MOBILE_BREAKPOINT,
    isDesktop: width >= DESKTOP_BREAKPOINT,
    isTablet: width >= MOBILE_BREAKPOINT && width < DESKTOP_BREAKPOINT,
  }
}
