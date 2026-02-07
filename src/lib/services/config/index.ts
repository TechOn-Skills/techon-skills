import { logger } from "@/lib/helpers";
import { LoggerLevel } from "@/utils/enums";

export const getConfig = () => {
    const { NEXT_PUBLIC_BACKEND_URL, NEXT_PUBLIC_NODE_ENV } = process.env;
    if (!NEXT_PUBLIC_BACKEND_URL || !NEXT_PUBLIC_NODE_ENV) {
        logger({ type: LoggerLevel.ERROR, message: "NEXT_PUBLIC_BACKEND_URL is not set" });
        throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
    }
    return {
        BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
        NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    } as const
}