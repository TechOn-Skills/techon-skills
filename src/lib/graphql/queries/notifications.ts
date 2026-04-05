import { gql } from "@apollo/client";

export const GET_MY_NOTIFICATIONS = gql`
  query GetMyNotifications($limit: Int) {
    getMyNotifications(limit: $limit) {
      id
      userId
      title
      message
      link
      readAt
      createdAt
    }
  }
`;

export const GET_UNREAD_NOTIFICATION_COUNT = gql`
  query GetUnreadNotificationCount {
    getUnreadNotificationCount
  }
`;
