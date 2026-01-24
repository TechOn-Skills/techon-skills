"use client";

import { CONFIG } from "@/utils/constants";
import { ThemeMode } from "@/utils/enums/theme";
import { IThemeContextProvider } from "@/utils/interfaces/theme";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const ThemeContext = createContext<IThemeContextProvider | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {

    const [theme, setTheme] = useState<ThemeMode>(() => {
        // This initializer runs during SSR too, so don't touch `localStorage` unless we're in the browser.
        if (typeof window === "undefined") return ThemeMode.SYSTEM;

        const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_PREFERENCES.THEME) as ThemeMode | null;
        if (stored && Object.values(ThemeMode).includes(stored)) return stored;
        if (stored) localStorage.setItem(CONFIG.STORAGE_KEYS.USER_PREFERENCES.THEME, ThemeMode.SYSTEM);
        return ThemeMode.SYSTEM;
    });

    const changeTheme = useCallback((theme: ThemeMode) => {
        setTheme(theme);
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER_PREFERENCES.THEME, theme);
    }, [])

    const values = useMemo(() => ({
        theme,
        changeTheme,
    }), [theme, changeTheme])

    useEffect(() => {
        document.documentElement.classList.toggle("light", theme === ThemeMode.LIGHT);
        document.documentElement.classList.toggle("dark", theme === ThemeMode.DARK);
        document.documentElement.classList.toggle("system", theme === ThemeMode.SYSTEM);
    }, [theme])

    return (
        <ThemeContext.Provider value={values}>
            {children}
        </ThemeContext.Provider>
    )
};

export const useTheme = () => {
    const theme = useContext(ThemeContext);
    if (!theme) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return theme;
}