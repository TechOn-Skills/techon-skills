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
            registrationCount
            isRegistered
            tags
            instructor
        }
    }
`;

export const GET_EVENT = gql`
    query GetEvent($id: ID!) {
        getEvent(id: $id) {
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
            registrationCount
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

export const GET_EVENT_REGISTRATIONS = gql`
    query GetEventRegistrations($eventId: ID!) {
        getEventRegistrations(eventId: $eventId) {
            userId
            fullName
            email
            phoneNumber
            profilePicture
            registeredAt
        }
    }
`;
