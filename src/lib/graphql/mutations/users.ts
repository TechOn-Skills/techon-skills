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
    mutation DeleteUser($id: String!) {
        deleteUser(id: $id) {
            id
        }
    }
`;