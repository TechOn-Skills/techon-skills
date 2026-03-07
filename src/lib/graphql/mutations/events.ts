import { gql } from "@apollo/client";

export const REGISTER_FOR_EVENT = gql`
    mutation RegisterForEvent($eventId: ID!) {
        registerForEvent(eventId: $eventId)
    }
`;

export const UNREGISTER_FROM_EVENT = gql`
    mutation UnregisterFromEvent($eventId: ID!) {
        unregisterFromEvent(eventId: $eventId)
    }
`;

export const CREATE_EVENT = gql`
    mutation CreateEvent($input: EventCreateInput!) {
        createEvent(input: $input) {
            id
            title
            type
            date
            time
            totalSpots
        }
    }
`;

export const UPDATE_EVENT = gql`
    mutation UpdateEvent($input: EventUpdateInput!) {
        updateEvent(input: $input) {
            id
            title
            type
            date
            time
            totalSpots
        }
    }
`;

export const DELETE_EVENT = gql`
    mutation DeleteEvent($id: ID!) {
        deleteEvent(id: $id)
    }
`;
