import { gql } from "@apollo/client";

export const GET_MY_PROGRESS = gql`
  query GetMyProgress {
    getMyProgress {
      enrolledCoursesCount
      publishedQuizzesTotal
      quizzesAttempted
      quizzesPassed
      publishedAssignmentsTotal
      assignmentsSubmitted
      assignmentsGraded
      assignmentsPendingReview
      averageMarksPercent
      courses {
        courseId
        courseTitle
        courseSlug
        quizzesTotal
        quizzesAttempted
        quizzesPassed
        assignmentsTotal
        assignmentsSubmitted
        assignmentsGraded
        assignmentsPendingReview
        progressPercent
      }
    }
  }
`;

export const GET_STUDENTS_PROGRESS = gql`
  query GetStudentsProgress($courseId: ID) {
    getStudentsProgress(courseId: $courseId) {
      userId
      fullName
      email
      enrolledCoursesCount
      quizzesAttempted
      quizzesPassed
      assignmentsSubmitted
      assignmentsGraded
      assignmentsPendingReview
      averageMarksPercent
      overallProgressPercent
      lastActivityAt
    }
  }
`;
