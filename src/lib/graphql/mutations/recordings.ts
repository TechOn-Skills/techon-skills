import { gql } from "@apollo/client";

export const CREATE_RECORDING = gql`
    mutation CreateRecording($input: RecordingInput!) {
        createRecording(input: $input) {
            id
        }
    }
`;

export const UPDATE_RECORDING = gql`
    mutation UpdateRecording($input: RecordingUpdateInput!) {
        updateRecording(input: $input) {
            id
        }
    }
`;

export const DELETE_RECORDING = gql`
    mutation DeleteRecording($id: ID!) {
        deleteRecording(id: $id)
    }
`;

export const CHECK_RECORDING_ACCESS = gql`
    mutation CheckRecordingAccess($id: ID!) {
        checkRecordingAccess(id: $id) {
            ok
            message
        }
    }
`;
