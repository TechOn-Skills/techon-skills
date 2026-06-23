import { gql } from "@apollo/client";

export const GET_MY_FEE_STATUS = gql`
    query GetMyFeeStatus {
        getMyFeeStatus {
            state
            locked
            reason
        }
    }
`;
