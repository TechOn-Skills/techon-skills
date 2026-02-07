import { UserRole, UserStatus } from "@/utils/enums/user";

export interface IUserProfileInfo {
    id: string;
    email: string;
    role: UserRole;
    status: UserStatus;
}