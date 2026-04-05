import { gql } from "@apollo/client";

export const GET_BANKS = gql`
    query GetBanks {
        getBanks {
            id
            name
            logo
            accountNumber
            accountTitle
        }
    }
`;
