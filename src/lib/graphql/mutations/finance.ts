import { gql } from "@apollo/client";

export const CREATE_EXPENSE = gql`
    mutation CreateExpense($input: ExpenseInput!) {
        createExpense(input: $input) {
            id
        }
    }
`;

export const UPDATE_EXPENSE = gql`
    mutation UpdateExpense($input: ExpenseUpdateInput!) {
        updateExpense(input: $input) {
            id
        }
    }
`;

export const DELETE_EXPENSE = gql`
    mutation DeleteExpense($id: ID!) {
        deleteExpense(id: $id)
    }
`;

export const COPY_EXPENSES_FROM_PREVIOUS_MONTH = gql`
    mutation CopyExpensesFromPreviousMonth($month: String!) {
        copyExpensesFromPreviousMonth(month: $month)
    }
`;
