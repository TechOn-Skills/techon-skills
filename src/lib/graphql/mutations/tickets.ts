import { gql } from "@apollo/client";

export const CREATE_TICKET = gql`
    mutation CreateTicket($input: TicketCreateInput!) {
        createTicket(input: $input) {
            id
            subject
            status
            createdAt
        }
    }
`;

export const REPLY_TO_TICKET = gql`
    mutation ReplyToTicket($input: TicketReplyInput!) {
        replyToTicket(input: $input) {
            id
            adminReply
            repliedAt
            status
        }
    }
`;

export const UPDATE_TICKET_STATUS = gql`
    mutation UpdateTicketStatus($id: ID!, $status: TicketStatus!) {
        updateTicketStatus(id: $id, status: $status) {
            id
            status
        }
    }
`;
