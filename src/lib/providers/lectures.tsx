"use client"
import { LECTURE_ROUTES, getLectureRouteKeyBySlug, API_COURSE_SLUG_TO_CONTENT_SLUG } from "@/utils/constants";
import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import toast from "react-hot-toast";
import { useUser } from "./user";
import { LectureRoutesType } from "@/utils/types";
import { ILecturesContextProps } from "@/utils/interfaces";

const LecturesContext = createContext<ILecturesContextProps | null>(null)
export const LecturesProvider = ({ children }: { children: ReactNode }) => {
    const { enrolledCoursesFromApi } = useUser()
    const allowedCourses: string[] | null = useMemo(() => {
        if (!enrolledCoursesFromApi?.length) return []
        const keys = enrolledCoursesFromApi
            .map((c) => {
                const contentSlug = API_COURSE_SLUG_TO_CONTENT_SLUG[c.slug] ?? c.slug
                return getLectureRouteKeyBySlug(contentSlug)
            })
            .filter((key): key is string => !!key)
        return keys
    }, [enrolledCoursesFromApi])

    const getAllowedLecturesRoutes = useCallback(() => {
        if (!allowedCourses || allowedCourses.length === 0) {
            toast.error("No courses assigned yet. Please clear your dues and contact admin for course access.");
            return {};
        }
        const filteredLectureRoutes: Partial<LectureRoutesType> = Object.fromEntries(
            Object.entries(LECTURE_ROUTES).filter(([key]) => allowedCourses.includes(key))
        )
        return filteredLectureRoutes
    }, [allowedCourses])

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