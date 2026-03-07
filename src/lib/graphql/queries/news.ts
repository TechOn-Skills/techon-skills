import { gql } from "@apollo/client";

export const GET_NEWS_POSTS = gql`
    query GetNewsPosts {
        getNewsPosts {
            id
            title
            description
            createdAt
            updatedAt
        }
    }
`;

export const GET_NEWS_POST = gql`
    query GetNewsPost($id: ID!) {
        getNewsPost(id: $id) {
            id
            title
            description
            createdAt
            updatedAt
        }
    }
`;
