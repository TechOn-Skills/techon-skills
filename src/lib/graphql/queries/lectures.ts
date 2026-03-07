import { gql } from "@apollo/client";

export const GET_UPCOMING_LECTURES = gql`
    query GetUpcomingLectures($limit: Int) {
        getUpcomingLectures(limit: $limit) {
            id
            courseName
            title
            meetUrl
            durationMins
            startAt
        }
    }
`;

export const GET_LECTURES = gql`
    query GetLectures {
        getLectures {
            id
            courseName
            title
            meetUrl
            durationMins
            startAt
        }
    }
`;
