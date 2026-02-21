"use client";
import { IUser, IUserContextProvider, IUserProfileInfo } from "@/utils/interfaces";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_USER_PROFILE_INFO } from "@/lib/graphql";
import { LoggerLevel } from "@/utils/enums/logger";
import { logger } from "../helpers";
import { CONFIG } from "@/utils/constants";

const UserContext = createContext<IUserContextProvider | null>(null);

interface UserProfileQueryResult {
    userProfileInfo?: IUserProfileInfo;
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [userData] = useState<IUser | null>(null);

    const { data, loading, error } = useQuery<UserProfileQueryResult>(GET_USER_PROFILE_INFO);

    const userProfileInfo = useMemo(() => {
        const raw = data?.userProfileInfo;
        if (!raw) return null;
        return { id: raw.id, email: raw.email, role: raw.role, status: raw.status };
    }, [data?.userProfileInfo]);

    const profileLoaded = !loading;

    useEffect(() => {
        if (userProfileInfo) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.USER.PROFILE, JSON.stringify(userProfileInfo));
        }
    }, [userProfileInfo]);

    useEffect(() => {
        if (error) {
            logger({ type: LoggerLevel.ERROR, message: JSON.stringify(error), showToast: true });
        }
    }, [error]);

    const value = useMemo(
        () => ({ userProfileInfo: error ? null : userProfileInfo, userData, profileLoaded }),
        [userProfileInfo, userData, profileLoaded, error]
    );

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within the UserProvider context");
    }
    return context;
}