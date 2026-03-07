import { gql } from "@apollo/client";

export const GET_USERS = gql`
    query GetUsers($includeDeleted: Boolean) {
        getUsers(includeDeleted: $includeDeleted) {
            id
            email
            fullName
            phoneNumber
            profilePicture
            role
            status
            isDeleted
            isBlocked
            isSuspended
            enrolledCourses {
                id
                title
                slug
            }
            requestedCourses {
                id
                title
                slug
            }
            payments {
                id
                amount
            }
            createdAt
            updatedAt
        }
    }
`;

export const GET_USER_PROFILE_INFO = gql`
    query GetUserProfileInfo {
        userProfileInfo {
            id
            email
            fullName
            phoneNumber
            profilePicture
            role
            status
            createdAt
            updatedAt
            enrolledCourses {
                id
                title
                slug
            }
        }
    }
`;

export const GET_USER_BY_ID = gql`
    query GetUserById($id: ID!) {
        getUser(id: $id) {
            id
            email
            fullName
            phoneNumber
            profilePicture
            role
            status
            isBlocked
            isSuspended
            isDeleted
            enrolledCourses {
                id
                title
                slug
            }
            requestedCourses {
                id
                title
                slug
            }
            payments {
                id
                amount
            }
            createdAt
            updatedAt
        }
    }
`;

export const GET_USERS_BY_ROLE = gql`
    query GetUsersByRole($role: UserRole!) {
        getUsersByRole(role: $role) {
            id
            email
            fullName
            role
            status
        }
    }
`;

export const GET_USERS_BY_STATUS = gql`
    query GetUsersByStatus($status: UserStatus!) {
        getUsersByStatus(status: $status) {
            id
            email
            fullName
            role
            status
        }
    }
`;