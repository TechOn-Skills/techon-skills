import { gql } from "@apollo/client";

export const CREATE_COURSE_CONTENT = gql`
  mutation CreateCourseContent($input: CreateCourseContentInput!) {
    createCourseContent(input: $input) {
      id
      courseId
      title
      description
      attachments {
        url
        filename
        contentType
      }
      sortOrder
      isPublished
      createdAt
    }
  }
`;

export const UPDATE_COURSE_CONTENT = gql`
  mutation UpdateCourseContent($input: UpdateCourseContentInput!) {
    updateCourseContent(input: $input) {
      id
      title
      description
      attachments {
        url
        filename
        contentType
      }
      sortOrder
      isPublished
    }
  }
`;

export const PUBLISH_COURSE_CONTENT = gql`
  mutation PublishCourseContent($id: ID!) {
    publishCourseContent(id: $id) {
      id
      isPublished
      publishedAt
    }
  }
`;

export const DELETE_COURSE_CONTENT = gql`
  mutation DeleteCourseContent($id: ID!) {
    deleteCourseContent(id: $id)
  }
`;
