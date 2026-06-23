function withHttpScheme(url: string): string {
    const trimmed = url.trim();
    if (!trimmed) return trimmed;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `http://${trimmed.replace(/^\/+/, "")}`;
}

export const getConfig = () => {
    const backendUrl = withHttpScheme(process.env.NEXT_PUBLIC_BACKEND_URL || "localhost:8080");
    const graphqlUrl = withHttpScheme(
        process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_URL || `${backendUrl.replace(/\/$/, "")}/graphql-techonskills`
    );
    return {
        BACKEND_URL: backendUrl.replace(/\/$/, ""),
        GRAPHQL_URL: graphqlUrl,
        NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV || "development",
    } as const;
};
