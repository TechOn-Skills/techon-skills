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
    const s3PublicBase =
        (process.env.NEXT_PUBLIC_S3_PUBLIC_BASE_URL || "").replace(/\/$/, "") ||
        "https://s3.ap-south-1.amazonaws.com/bucket.techonskills";
    return {
        BACKEND_URL: backendUrl.replace(/\/$/, ""),
        GRAPHQL_URL: graphqlUrl,
        S3_PUBLIC_BASE_URL: s3PublicBase,
        NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV || "development",
    } as const;
};
