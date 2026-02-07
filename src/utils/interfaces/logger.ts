import { LoggerLevel } from "@/utils/enums";

export interface ILoggerProps {
    message: string;
    type: LoggerLevel;
    error?: string;
    showToast?: boolean;
    isLoading?: boolean | undefined;
}