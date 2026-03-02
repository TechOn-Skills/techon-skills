import { LectureRoutesType } from "@/utils/types";

export interface ILecturesContextProps {
    getAllowedLecturesRoutes: () => Partial<LectureRoutesType>;
}