import { gql } from "@apollo/client";

export const CREATE_ARTICLE = gql`
    mutation CreateArticle($input: ArticleCreateInput!) {
        createArticle(input: $input) {
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

export const UPDATE_ARTICLE = gql`
    mutation UpdateArticle($input: ArticleUpdateInput!) {
        updateArticle(input: $input) {
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

export const DELETE_ARTICLE = gql`
    mutation DeleteArticle($id: ID!) {
        deleteArticle(id: $id)
    }
`;
