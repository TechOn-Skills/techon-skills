import { gql } from "@apollo/client";

export const UPDATE_PAYMENT = gql`
    mutation UpdatePayment($input: PaymentUpdateInput!) {
        updatePayment(input: $input) {
            id
            paymentStatus
            isPaid
        }
    }
`;
