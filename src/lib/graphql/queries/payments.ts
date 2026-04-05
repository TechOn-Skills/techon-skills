import { gql } from "@apollo/client";

export const GET_PAYMENTS = gql`
    query GetPayments($includeDeleted: Boolean) {
        getPayments(includeDeleted: $includeDeleted) {
            id
            amount
            paymentDate
            paymentStatus
            paymentAttachment
            isPaid
            payerId
            payer {
                id
                fullName
                email
            }
            courseDetails {
                courseId
                installmentNumber
            }
        }
    }
`;

export const GET_PAYMENTS_PENDING_APPROVAL = gql`
    query GetPaymentsPendingApproval {
        getPaymentsPendingApproval {
            id
            amount
            paymentDate
            paymentStatus
            paymentAttachment
            isPaid
            payerId
            payer {
                id
                fullName
                email
            }
            courseDetails {
                courseId
                installmentNumber
            }
        }
    }
`;

export const GET_PAYMENTS_BY_USER = gql`
    query GetPaymentsByUser($userId: ID!) {
        getPaymentsByUser(userId: $userId) {
            id
            amount
            paymentDate
            paymentMethod
            paymentStatus
            paymentAttachment
            isPaid
            courseDetails {
                courseId
                enrollmentDate
                installmentNumber
                course {
                    id
                    feePerMonth
                    currency
                }
            }
        }
    }
`;
