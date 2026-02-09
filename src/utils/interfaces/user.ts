import { UserRole, UserStatus } from "@/utils/enums/user";

export interface IUserProfileInfo {
    id: string;
    email: string;
    role: UserRole;
    status: UserStatus;
}

export interface IUser {
    _id: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    isBlocked: boolean;
    isSuspended: boolean;
    isDeleted: boolean;
    fullName: string;
    phoneNumber: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserContextProvider {
    userProfileInfo: IUserProfileInfo | null;
    userData: IUser | null;
}