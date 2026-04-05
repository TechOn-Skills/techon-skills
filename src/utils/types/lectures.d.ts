import { SelectedCourse } from "@utils/enums";

export type LectureRoutesType = Record<keyof typeof SelectedCourse, Record<string, Record<string, string>>>