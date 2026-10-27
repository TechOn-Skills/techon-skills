import { gql } from "@apollo/client";

export const CREATE_USER = gql`
    mutation CreateUser($input: UserCreateInput!) {
        createUser(input: $input) {
            id
            email
            fullName
            phoneNumber
            role
            status
            allowedMarkGradesOn
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

export const REQUEST_COURSE_FOR_USER = gql`
    mutation RequestCourseForUser($input: UserCourseInput!) {
        requestCourseForUser(input: $input) {
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
export const MOVE_USERS_TO_BIN = gql`
    mutation MoveUsersToBin($ids: [ID!]!) {
        moveUsersToBin(ids: $ids)
    }
`;

export const RESTORE_USERS_FROM_BIN = gql`
    mutation RestoreUsersFromBin($ids: [ID!]!) {
        restoreUsersFromBin(ids: $ids)
    }
`;

export const SEND_BULK_EMAIL = gql`
    mutation SendBulkEmail($input: BulkEmailInput!) {
        sendBulkEmail(input: $input) {
            queued
            skippedUnsubscribed
            estimatedMinutes
        }
    }
`;
