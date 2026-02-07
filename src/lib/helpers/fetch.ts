import { getConfig } from "@/lib/services"
import { CONFIG } from "@/utils/constants"
import { LoggerLevel } from "@/utils/enums"
import { logger } from "./logger"

const { BACKEND_URL } = getConfig()
export const fetchURL = async ({ path, options, isGraphQL = true }: { path: string, options: RequestInit, isGraphQL?: boolean }) => {
    if (!BACKEND_URL) {
        logger({ type: LoggerLevel.ERROR, message: "Unable to fetch URL, please check your backend URL" })
        return null

    }
    const response = await fetch(`${BACKEND_URL}${isGraphQL ? CONFIG.BACKEND_PATHS.GRAPHQL : path}`, options)
    return response
}