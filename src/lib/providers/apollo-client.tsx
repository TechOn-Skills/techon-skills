"use client"

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { getConfig } from "@/lib/services";
import { ReactNode } from "react";

const { GRAPHQL_URL } = getConfig();
const client = new ApolloClient({
    link: new HttpLink({
        uri: GRAPHQL_URL,
        credentials: "include",
    }),
    cache: new InMemoryCache(),
});

export const ApolloClientProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    )
}