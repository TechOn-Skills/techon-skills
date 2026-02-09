"use client";
import { IUser, IUserContextProvider, IUserProfileInfo } from "@/utils/interfaces";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { apiService } from "../services";
import { LoggerLevel } from "@/utils/enums/logger";
import { logger } from "../helpers";
import { CONFIG } from "@/utils/constants";



const UserContext = createContext<IUserContextProvider | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [userProfileInfo, setUserProfileInfo] = useState<IUserProfileInfo | null>(null);
    const [userData, setUserData] = useState<IUser | null>(null);

    const handleGetUserProfileInfo = async () => {
        const response = await apiService.getUserProfileInfo<IUserProfileInfo>();
        if (response.success && response.data) {
            return response.data;
        } else {
            return null;
        }
    }

    useEffect(() => {
        handleGetUserProfileInfo().then((userProfileInfoData) => {
            if (userProfileInfoData) {
                localStorage.setItem(CONFIG.STORAGE_KEYS.USER.PROFILE, JSON.stringify(userProfileInfoData));
                setUserProfileInfo(userProfileInfoData);
            }
        }).catch((error) => {
            logger({ type: LoggerLevel.ERROR, message: JSON.stringify(error), showToast: true });
            setUserProfileInfo(null);
        });
    }, []);

    return (
        <UserContext.Provider value={{ userProfileInfo, userData }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within the UserProvider context");
    }
    return context;
}