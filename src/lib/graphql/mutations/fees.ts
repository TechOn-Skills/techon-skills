import { gql } from "@apollo/client";

export const SUBMIT_FEE_PROOF = gql`
    mutation SubmitFeeProof($input: SubmitFeeProofInput!) {
        submitFeeProof(input: $input) {
            id
            paymentStatus
            paymentAttachment
            isPaid
        }
    }
`;
