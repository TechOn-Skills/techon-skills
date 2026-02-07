import { LoggerLevel } from "@/utils/enums";

export const LOGGER_LEVELS_PREFIX = {
    [LoggerLevel.DEBUG]: "🐛",
    [LoggerLevel.ERROR]: "❌",
    [LoggerLevel.INFO]: "✅",
    [LoggerLevel.WARN]: "⚠️",
};
