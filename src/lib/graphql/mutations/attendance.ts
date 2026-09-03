import { gql } from "@apollo/client";

export const SAVE_LECTURE_ATTENDANCE = gql`
  mutation SaveLectureAttendance($lectureId: ID!, $records: [AttendanceMarkInput!]!) {
    saveLectureAttendance(lectureId: $lectureId, records: $records) {
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
