import { gql } from "@apollo/client";

export const GET_UPCOMING_LECTURES = gql`
    query GetUpcomingLectures {
        getUpcomingLectures {
            id
            courseId
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

export const GET_LECTURES_FOR_STAFF = gql`
    query GetLecturesForStaff {
        getLecturesForStaff {
            id
            courseId
            courseName
            title
            meetUrl
            durationMins
            startAt
            seriesId
            reminderEmailSent
            createdAt
            updatedAt
        }
    }
`;
