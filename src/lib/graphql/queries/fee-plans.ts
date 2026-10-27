import { gql } from "@apollo/client";

export const STUDENT_COURSE_FEE_FIELDS = `
    courseId
    courseTitle
    currency
    planType
    courseFee
    agreedFee
    discount
    discountNote
    totalPaid
    outstanding
    overdue
    installments {
        id
        amount
        paymentDate
        paymentStatus
        paymentAttachment
        isPaid
        paidAt
        note
        courseDetails {
            installmentNumber
        }
    }
`;

export const GET_STUDENT_FEES = gql`
    query GetStudentFees($userId: ID!) {
        getStudentFees(userId: $userId) {
            ${STUDENT_COURSE_FEE_FIELDS}
        }
    }
`;
