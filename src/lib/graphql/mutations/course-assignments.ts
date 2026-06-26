import { gql } from "@apollo/client";

export const CREATE_COURSE_ASSIGNMENT = gql`
  mutation CreateCourseAssignment($input: CreateCourseAssignmentInput!) {
    createCourseAssignment(input: $input) {
      id
      courseId
      title
      description
      maxMarks
      referenceId
      dueDate
      createdAt
    }
  }
`;

export const PUBLISH_COURSE_ASSIGNMENT = gql`
  mutation PublishCourseAssignment($id: ID!) {
    publishCourseAssignment(id: $id) {
      id
      isPublished
      publishedAt
    }
  }
`;

export const DELETE_COURSE_ASSIGNMENT = gql`
  mutation DeleteCourseAssignment($id: ID!) {
    deleteCourseAssignment(id: $id)
  }
`;
