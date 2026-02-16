"use client"
import { LOGGER_LEVELS_PREFIX } from "@/utils/constants";
import { ILoggerProps } from "@/utils/interfaces";

import { Environment, LoggerLevel } from "@/utils/enums";
import { getConfig } from "@/lib/services";
import toast, { ToastOptions } from 'react-hot-toast';

const { NODE_ENV } = getConfig();
function getToastLevel(type: LoggerLevel) {
    switch (type) {
        case LoggerLevel.ERROR:
            return "error";
        case LoggerLevel.INFO:
            return "success";
        case LoggerLevel.WARN:
            return "warning";
        case LoggerLevel.DEBUG:
            return "info";
        default:
            return "success";
    }
}
export const logger = (
    { type, message, error, showToast = false }: ILoggerProps
) => {
    if (NODE_ENV === Environment.DEVELOPMENT) {
        console.log(`[${LOGGER_LEVELS_PREFIX[type]}]:\t${message}\n${error ? `Error: ${error}` : ""}`);
        if (showToast) {
            const toastLevel = getToastLevel(type);
            const toastOptions: ToastOptions = {
                duration: 3000,
                position: "bottom-right",
            };
            switch (toastLevel) {
                case "error":
                    toast.error(message, toastOptions);
                    break;
                case "success":
                    toast.success(message, toastOptions);
                    break;
                case "warning":
                    toast(message, { ...toastOptions, icon: "⚠️" });
                    break;
                default:
                    toast(message, { ...toastOptions, icon: "🐞" });
                    break;
            }
        }
    } else {
        return;
    }
}