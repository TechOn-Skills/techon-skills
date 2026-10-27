import { gql } from "@apollo/client";

export const GET_FINANCE_MONTH = gql`
    query GetFinanceMonth($month: String!) {
        getFinanceMonth(month: $month) {
            month
            revenue
            paymentsCount
            studentsPaid
            totalExpenses
            net
            dueThisMonthUnpaid
            dueThisMonthUnpaidCount
            revenueByCourse {
                courseId
                courseTitle
                amount
                students
            }
            expensesByCategory {
                category
                amount
            }
            payments {
                id
                studentId
                studentName
                courseTitle
                installmentNumber
                amount
                paidAt
            }
            expenses {
                id
                month
                category
                amount
                note
            }
        }
    }
`;

export const GET_FINANCE_HISTORY = gql`
    query GetFinanceHistory($fromMonth: String!, $toMonth: String!) {
        getFinanceHistory(fromMonth: $fromMonth, toMonth: $toMonth) {
            month
            revenue
            paymentsCount
            studentsPaid
            totalExpenses
            net
            expensesByCategory {
                category
                amount
            }
        }
    }
`;
