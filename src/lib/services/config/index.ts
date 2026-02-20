export const getConfig = () => {
    const { NEXT_PUBLIC_BACKEND_URL, NEXT_PUBLIC_NODE_ENV, NEXT_PUBLIC_BACKEND_GRAPHQL_URL } = process.env;
    console.log("ENV VARS", NEXT_PUBLIC_BACKEND_URL, NEXT_PUBLIC_NODE_ENV, NEXT_PUBLIC_BACKEND_GRAPHQL_URL);
    if (!NEXT_PUBLIC_BACKEND_URL || !NEXT_PUBLIC_NODE_ENV || !NEXT_PUBLIC_BACKEND_GRAPHQL_URL) {
        console.error("NEXT_PUBLIC_BACKEND_URL is not set");
        throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
    }
    return {
        BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
        GRAPHQL_URL: process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_URL,
        NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    } as const
}