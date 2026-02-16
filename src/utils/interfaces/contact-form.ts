import { IContactFormCourse } from "./courses";

export interface IContactForm {
    name: string;
    email: string;
    message?: string;
    courses: IContactFormCourse[];
    phone: string;
}
