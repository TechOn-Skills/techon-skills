"use client"
import { LECTURE_ROUTES } from "@/utils/constants";
import { SelectedCourse } from "@/utils/enums/courses";
import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import toast from "react-hot-toast";
import { useUser } from "./user";
import { LectureRoutesType } from "@/utils/types";
import { ILecturesContextProps } from "@/utils/interfaces";

const LecturesContext = createContext<ILecturesContextProps | null>(null)
export const LecturesProvider = ({ children }: { children: ReactNode }) => {
    const { userData } = useUser()
    const allowedCourses: SelectedCourse[] | null = useMemo(() => userData?.enrolledCourses ? userData?.enrolledCourses : [SelectedCourse.SOFTWARE_ENGINEERING_1_YEAR, SelectedCourse.FULL_STACK_WEB_DEVELOPMENT_6_MONTHS, SelectedCourse.WEB_DEVELOPMENT_3_MONTHS, SelectedCourse.WORDPRESS_SHOPIFY_WIX_3_MONTHS], [userData?.enrolledCourses])

    const getAllowedLecturesRoutes = useCallback(() => {
        if (!allowedCourses || allowedCourses.length === 0) {
            toast.error("No courses selected, please contact your admin for further assistance");
            return {};
        }
        const filteredLectureRoutes: Partial<LectureRoutesType> = Object.fromEntries(
            Object.entries(LECTURE_ROUTES).filter(([key]) =>
                allowedCourses.includes(key as SelectedCourse)
            )
        );
        return filteredLectureRoutes
    }, [allowedCourses]);

    const values = useMemo(() => ({
        getAllowedLecturesRoutes,
    }), [getAllowedLecturesRoutes]);

    return (
        <LecturesContext.Provider value={values}>
            {children}
        </LecturesContext.Provider>
    )
}

export function useLectures(): ILecturesContextProps {
    const ctx = useContext(LecturesContext)
    if (!ctx) {
        throw new Error("useLectures must be used within a LecturesProvider")
    }
    return ctx
}