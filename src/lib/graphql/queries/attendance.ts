import { gql } from "@apollo/client";

export const GET_ATTENDANCE_SHEET = gql`
  query GetAttendanceSheet($lectureId: ID!) {
    getAttendanceSheet(lectureId: $lectureId) {
      lectureId
      courseId
      lectureTitle
      lectureStartAt
      rows {
        studentId
        fullName
        email
        status
      }
    }
  }
`;

export const GET_MY_ATTENDANCE_SUMMARIES = gql`
  query GetMyAttendanceSummaries {
    getMyAttendanceSummaries {
      courseId
      courseTitle
      courseSlug
      sessionsTaken
      presentCount
      percentage
    }
  }
`;
