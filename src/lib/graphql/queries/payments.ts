import { gql } from "@apollo/client";

export const GET_PAYMENTS_BY_USER = gql`
    query GetPaymentsByUser($userId: ID!) {
        getPaymentsByUser(userId: $userId) {
            id
            amount
            paymentDate
            paymentMethod
            paymentStatus
            isPaid
            courseDetails {
                courseId
                enrollmentDate
                installmentNumber
            }
        }
    }
`;
