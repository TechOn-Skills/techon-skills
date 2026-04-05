import { gql } from "@apollo/client";

export const GET_ADMIN_DASHBOARD = gql`
    query GetAdminDashboard {
        getAdminDashboard {
            totalRevenue
            totalContactSubmissions
            totalRegisteredStudents
            recentActivity {
                id
                type
                user
                action
                time
            }
            pendingTasks {
                id
                title
                priority
            }
            enrolledPerCourse {
                slug
                name
                enrolled
            }
        }
    }
`;
