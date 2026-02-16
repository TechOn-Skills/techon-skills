import * as Yup from "yup"
import { validatePhone, type PhoneValue } from "@/lib/ui/useable-components/phone-input"
import type { IContactFormCourse } from "@/utils/interfaces"

export const DEFAULT_PHONE: PhoneValue = { countryCode: "+92", number: "" }

export interface ContactFormValues {
  firstName: string
  lastName: string
  email: string
  phone: PhoneValue
  courses: IContactFormCourse[]
  message: string
}

const phoneSchema = Yup.object({
  countryCode: Yup.string().required(),
  number: Yup.string()
    .required("Phone number is required.")
    .test("phone-valid", "Please enter a valid phone number (7–15 digits).", function (value) {
      const { countryCode } = this.parent as { countryCode: string }
      return validatePhone({ countryCode, number: value ?? "" })
    }),
}).required()

export const contactFormValidationSchema = Yup.object<ContactFormValues>({
  firstName: Yup.string().trim().required("First name is required."),
  lastName: Yup.string().trim().required("Last name is required."),
  email: Yup.string()
    .trim()
    .required("Email is required.")
    .email("Please enter a valid email address."),
  phone: phoneSchema,
  courses: Yup.array()
    .of(
      Yup.object({
        slug: Yup.string().required(),
        title: Yup.string().required(),
      })
    )
    .min(1, "Please select at least one course.")
    .required("Please select at least one course."),
  message: Yup.string().defined(),
})

export function getContactFormInitialValues(
  initialCourse?: { slug: string; title: string } | null
): ContactFormValues {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: DEFAULT_PHONE,
    courses: initialCourse ? [{ slug: initialCourse.slug, title: initialCourse.title }] : [],
    message: "",
  }
}
