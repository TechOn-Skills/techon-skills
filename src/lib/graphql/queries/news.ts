import { gql } from "@apollo/client";

export const GET_NEWS_POSTS = gql`
    query GetNewsPosts {
        getNewsPosts {
            id
            title
            description
        }
    }
`;
