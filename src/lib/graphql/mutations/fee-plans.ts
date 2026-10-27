import { gql } from "@apollo/client";
import { STUDENT_COURSE_FEE_FIELDS } from "../queries/fee-plans";

export const SET_STUDENT_FEE_PLAN = gql`
    mutation SetStudentFeePlan($input: SetStudentFeePlanInput!) {
        setStudentFeePlan(input: $input) {
            ${STUDENT_COURSE_FEE_FIELDS}
        }
    }
`;

export const ADD_STUDENT_INSTALLMENT = gql`
    mutation AddStudentInstallment($input: AddStudentInstallmentInput!) {
        addStudentInstallment(input: $input) {
            ${STUDENT_COURSE_FEE_FIELDS}
        }
    }
`;

export const UPDATE_STUDENT_INSTALLMENT = gql`
    mutation UpdateStudentInstallment($input: UpdateStudentInstallmentInput!) {
        updateStudentInstallment(input: $input) {
            ${STUDENT_COURSE_FEE_FIELDS}
        }
    }
`;

export const REMOVE_STUDENT_INSTALLMENT = gql`
    mutation RemoveStudentInstallment($paymentId: ID!) {
        removeStudentInstallment(paymentId: $paymentId) {
            ${STUDENT_COURSE_FEE_FIELDS}
        }
    }
`;
