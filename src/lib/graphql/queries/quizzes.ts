import { gql } from "@apollo/client";

export const GET_QUIZZES_FOR_COURSE = gql`
  query GetQuizzesForCourse($courseId: ID!) {
    getQuizzesForCourse(courseId: $courseId) {
      id
      courseId
      title
      description
      instructions
      totalMarks
      passPercentage
      durationMins
      dueDate
      isPublished
      publishedAt
      createdAt
      questions {
        id
        prompt
        marks
        options {
          id
          text
        }
        correctOptionIds
      }
    }
  }
`;

export const GET_MY_QUIZZES = gql`
  query GetMyQuizzes {
    getMyQuizzes {
      id
      courseId
      title
      description
      instructions
      totalMarks
      passPercentage
      durationMins
      dueDate
      isPublished
      course {
        id
        title
      }
      myAttempt {
        id
        score
        maxScore
        percentage
        passed
        submittedAt
      }
    }
  }
`;

export const GET_QUIZ_FOR_ATTEMPT = gql`
  query GetQuizForAttempt($id: ID!) {
    getQuizForAttempt(id: $id) {
      id
      courseId
      title
      description
      instructions
      totalMarks
      passPercentage
      durationMins
      dueDate
      course {
        id
        title
      }
      questions {
        id
        prompt
        marks
        options {
          id
          text
        }
      }
    }
  }
`;

export const GET_MY_QUIZ_ATTEMPT = gql`
  query GetMyQuizAttempt($quizId: ID!) {
    getMyQuizAttempt(quizId: $quizId) {
      id
      quizId
      score
      maxScore
      percentage
      passed
      submittedAt
      answers {
        questionId
        selectedOptionIds
        marksAwarded
        isCorrect
      }
    }
  }
`;
