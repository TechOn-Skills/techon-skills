import { gql } from "@apollo/client";

export const CREATE_NEWS = gql`
    mutation CreateNews($input: NewsCreateInput!) {
        createNews(input: $input) {
            id
            title
            description
        }
    }
`;

export const UPDATE_NEWS = gql`
    mutation UpdateNews($input: NewsUpdateInput!) {
        updateNews(input: $input) {
            id
            title
            description
        }
    }
`;

export const DELETE_NEWS = gql`
    mutation DeleteNews($id: ID!) {
        deleteNews(id: $id)
    }
`;
