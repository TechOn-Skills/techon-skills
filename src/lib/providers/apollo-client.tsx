"use client"

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { getConfig } from "@/lib/services";
import { CONFIG } from "@/utils/constants";
import { getClientTimezone } from "@/lib/helpers";
import { ReactNode, useMemo } from "react";

function createApolloClient() {
    const { GRAPHQL_URL } = getConfig();
    const authLink = setContext((_, { headers }) => {
        const token = typeof window !== "undefined" ? localStorage.getItem(CONFIG.STORAGE_KEYS.AUTH.TOKEN) : null;
        const tz = getClientTimezone();
        return {
            headers: {
                ...headers,
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(tz ? { "X-Timezone": tz } : {}),
            },
        };
    });
    return new ApolloClient({
        link: authLink.concat(
            new HttpLink({
                uri: GRAPHQL_URL,
                credentials: "include",
            })
        ),
        cache: new InMemoryCache(),
    });
}

export const ApolloClientProvider = ({ children }: { children: ReactNode }) => {
    const client = useMemo(() => createApolloClient(), []);
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    )
}