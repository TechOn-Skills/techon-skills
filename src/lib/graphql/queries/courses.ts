import { gql } from "@apollo/client";

export const GET_COURSES = gql`
    query GetCourses {
        getCourses {
            id
            title
            slug
            subtitle
            totalFee
            feePerMonth
            courseDurationInMonths
        }
    }
`;

export const GET_COURSE = gql`
    query GetCourse($id: ID!) {
        getCourse(id: $id) {
            id
            title
            slug
            heroDescription
            subtitle
            subDescription
            totalFee
            feePerMonth
            courseDurationInMonths
            totalNumberOfInstallments
            currency
        }
    }
`;

export const GET_COURSE_BY_SLUG = gql`
    query GetCourseBySlug($slug: String!) {
        getCourseBySlug(slug: $slug) {
            id
            title
            slug
            heroDescription
            subtitle
            subDescription
            totalFee
            feePerMonth
            courseDurationInMonths
        }
    }
`;
