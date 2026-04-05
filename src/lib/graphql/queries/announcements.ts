import { gql } from "@apollo/client";

export const GET_ANNOUNCEMENTS = gql`
    query GetAnnouncements {
        getAnnouncements {
            id
            title
            content
            date
            isNew
            category
        }
    }
`;
