import { gql } from "@apollo/client";

export const GET_USERS = gql`
    query GetUsers {
        getUsers {
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
                title 
                slug
            }
            requestedCourses {
                title 
                slug
            }
            payments {
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
        }
    }
`;

export const GET_USER_BY_ID = gql`
    query GetUserById($id: String!) {
        user(id: $id) {
            id
            name
            email
            role
            status
            isBlocked
            isSuspended
            isDeleted
        }
    }
`;

export const GET_USERS_BY_ROLE = gql`
    query GetUsersByRole($role: UserRole!) {
        usersByRole(role: $role) {
            id
            name
            email
            role
            status
        }
    }
`;

export const GET_USERS_BY_STATUS = gql`
    query GetUsersByStatus($status: UserStatus!) {
        usersByStatus(status: $status) {
            id
            name
            email
            role
            status
        }
    }
`;