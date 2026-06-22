
export const getConfig = () => {
    return {
        BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "localhost:8080",
        GRAPHQL_URL: process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_URL || "localhost:8080/graphql",
        NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV || "",
    } as const;
};
