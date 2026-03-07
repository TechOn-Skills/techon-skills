import { gql } from "@apollo/client";

export const CREATE_USER = gql`
    mutation CreateUser($user: UserInput!) {
        createUser(user: $user) {
            id
            name
            email
            role
            status
        }
    }
`;

export const UPDATE_USER = gql`
    mutation UpdateUser($id: String!, $user: UserInput!) {
        updateUser(id: $id, user: $user) {
            id
            name
            email
            role
            status
        }
    }
`;

export const DELETE_USER = gql`
    mutation DeleteUser($input: UserDeleteInput!) {
        deleteUser(input: $input)
    }
`;

export const ENROLL_USER_IN_COURSE = gql`
    mutation EnrollUserInCourse($input: UserCourseInput!) {
        enrollUserInCourse(input: $input) {
            id
            email
            fullName
        }
    }
`;

export const UPDATE_USER_INPUT = gql`
    mutation UpdateUserInput($input: UserUpdateInput!) {
        updateUser(input: $input) {
            id
            email
            fullName
            phoneNumber
            profilePicture
            role
            status
        }
    }
`;