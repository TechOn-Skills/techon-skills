import { gql } from "@apollo/client";

export const GET_ARTICLES = gql`
    query GetArticles($publishedOnly: Boolean) {
        getArticles(publishedOnly: $publishedOnly) {
            id
            title
            slug
            excerpt
            coverImage
            published
            publishedAt
            authorName
            metaTitle
            metaDescription
            createdAt
            updatedAt
        }
    }
`;

export const GET_ARTICLE = gql`
    query GetArticle($id: ID!) {
        getArticle(id: $id) {
            id
            title
            slug
            excerpt
            content
            coverImage
            published
            publishedAt
            authorName
            metaTitle
            metaDescription
            createdAt
            updatedAt
        }
    }
`;

export const GET_ARTICLE_BY_SLUG = gql`
    query GetArticleBySlug($slug: String!) {
        getArticleBySlug(slug: $slug) {
            id
            title
            slug
            excerpt
            content
            coverImage
            published
            publishedAt
            authorName
            metaTitle
            metaDescription
            createdAt
            updatedAt
        }
    }
`;
