import { gql } from "@apollo/client";

export const CREATE_SUBMISSION = gql`
  mutation CreateSubmission($input: CreateSubmissionInput!) {
    createSubmission(input: $input) {
      id
      status
      createdAt
    }
  }
`;

export const UPDATE_SUBMISSION_MARKS = gql`
  mutation UpdateSubmissionMarks($input: UpdateSubmissionMarksInput!) {
    updateSubmissionMarks(input: $input) {
      id
      marks
      status
      markedAt
    }
  }
`;
