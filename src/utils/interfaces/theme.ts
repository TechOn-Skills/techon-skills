import { ThemeMode } from "@/utils/enums/theme";

export interface IThemeContextProvider {
    theme: ThemeMode;
    changeTheme: (theme: ThemeMode) => void;
}