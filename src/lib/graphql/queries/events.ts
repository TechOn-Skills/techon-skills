import { gql } from "@apollo/client";

export const GET_EVENTS = gql`
    query GetEvents {
        getEvents {
            id
            title
            description
            type
            date
            time
            duration
            location
            isOnline
            totalSpots
            spotsLeft
            isRegistered
            tags
            instructor
        }
    }
`;

export const GET_MY_EVENT_REGISTRATIONS = gql`
    query GetMyEventRegistrations {
        getMyEventRegistrations
    }
`;
