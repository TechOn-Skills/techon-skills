import { gql } from "@apollo/client";

export const CREATE_QUIZ = gql`
  mutation CreateQuiz($input: CreateQuizInput!) {
    createQuiz(input: $input) {
      id
      courseId
      title
      totalMarks
      isPublished
      createdAt
    }
  }
`;

export const PUBLISH_QUIZ = gql`
  mutation PublishQuiz($id: ID!) {
    publishQuiz(id: $id) {
      id
      isPublished
      publishedAt
    }
  }
`;

export const DELETE_QUIZ = gql`
  mutation DeleteQuiz($id: ID!) {
    deleteQuiz(id: $id)
  }
`;

export const SUBMIT_QUIZ_ATTEMPT = gql`
  mutation SubmitQuizAttempt($input: SubmitQuizAttemptInput!) {
    submitQuizAttempt(input: $input) {
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
