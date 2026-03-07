"use client"

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { getConfig } from "@/lib/services";
import { CONFIG } from "@/utils/constants";
import { ReactNode } from "react";

const { GRAPHQL_URL } = getConfig();

const authLink = setContext((_, { headers }) => {
    const token = typeof window !== "undefined" ? localStorage.getItem(CONFIG.STORAGE_KEYS.AUTH.TOKEN) : null;
    return {
        headers: {
            ...headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(
        new HttpLink({
            uri: GRAPHQL_URL,
            credentials: "include",
        })
    ),
    cache: new InMemoryCache(),
});

export const ApolloClientProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    )
}