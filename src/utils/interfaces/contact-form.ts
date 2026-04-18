import { IContactFormCourse } from "./courses";

export interface IContactForm {
    name: string;
    email: string;
    message?: string;
    courses: IContactFormCourse[];
    phone: string;
    /** Base64 data URL of fee payment screenshot (legacy; prefer enrollment-application API). */
    feePaymentScreenshotDataUrl?: string;
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

