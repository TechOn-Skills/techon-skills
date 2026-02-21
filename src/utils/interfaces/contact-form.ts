import { IContactFormCourse } from "./courses";

export interface IContactForm {
    name: string;
    email: string;
    message?: string;
    courses: IContactFormCourse[];
    phone: string;
}

export interface IContactFormSubmission {
    _id: string;
    name: string;
    email: string;
    phone: string;
    message?: string;
    courses: IContactFormCourse[];
    createdAt: string;
}

