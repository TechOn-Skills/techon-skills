
export const getConfig = () => {
    return {
        BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "",
        GRAPHQL_URL: process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_URL || "",
        NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV || "",
    } as const;
};
