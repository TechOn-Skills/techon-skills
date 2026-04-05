import { gql } from "@apollo/client";

export const GET_TICKETS = gql`
    query GetTickets($status: TicketStatus, $limit: Int) {
        getTickets(status: $status, limit: $limit) {
            id
            subject
            message
            status
            adminReply
            repliedAt
            createdAt
            user {
                id
                email
                fullName
            }
        }
    }
`;

export const GET_TICKET = gql`
    query GetTicket($id: ID!) {
        getTicket(id: $id) {
            id
            subject
            message
            status
            adminReply
            repliedAt
            createdAt
            updatedAt
            user {
                id
                email
                fullName
            }
        }
    }
`;

export const GET_MY_TICKETS = gql`
    query GetMyTickets {
        getMyTickets {
            id
            subject
            message
            status
            adminReply
            repliedAt
            createdAt
        }
    }
`;
