"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Formik, Form } from "formik"
import { CheckCircle2Icon, SparklesIcon, ZapIcon } from "lucide-react"
import toast from "react-hot-toast"

import { getApiDisplayMessage, logger } from "@/lib/helpers"
import {
  contactFormValidationSchema,
  getContactFormInitialValues,
  type ContactFormValues,
} from "@/lib/helpers/contact-form"
import { apiService } from "@/lib/services/api"
import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { useCourses } from "@/lib/providers/courses"
import { CourseMultiSelect } from "@/lib/ui/useable-components/course-multi-select"
import { Input } from "@/lib/ui/useable-components/input"
import { PhoneInput, getFullPhone, type PhoneValue } from "@/lib/ui/useable-components/phone-input"
import { Separator } from "@/lib/ui/useable-components/separator"
import { Textarea } from "@/lib/ui/useable-components/textarea"
import type { IContactForm, IContactFormCourse } from "@/utils/interfaces"
import { cn } from "@/lib/helpers"
import { LoggerLevel } from "@/utils/enums"

export const PublicContactScreen = () => {
  const params = useSearchParams()
  const { getCourseBySlug } = useCourses()
  const selectedCourseFromUrl = params.get("course")
  const initialCourse = selectedCourseFromUrl
    ? getCourseBySlug(selectedCourseFromUrl)
    : null

  const [sent, setSent] = useState(false)
  const initialValues = getContactFormInitialValues(initialCourse ?? undefined)

  const handleSubmit = async (values: ContactFormValues) => {
    const name = [values.firstName, values.lastName].filter(Boolean).join(" ").trim()
    const payload: IContactForm = {
      name,
      email: values.email,
      courses: values.courses,
      message: values.message,
      phone: getFullPhone(values.phone),
    }
    const toastId = toast.loading("Sending message...")
    logger({ type: LoggerLevel.DEBUG, message: "Submitting contact form", error: JSON.stringify(payload) })
    const response = await apiService.submitContactForm<IContactForm>(payload)
    toast.dismiss(toastId)
    if (response.success) {
      toast.success(getApiDisplayMessage(response, "Thanks! Message received. We'll get back soon."))
      setSent(true)
    } else {
      toast.error(getApiDisplayMessage(response, "Failed to send message. Please try again."))
    }
    return response.success
  }

  return (
    <div className="w-full px-4 py-12 sm:px-6 lg:px-8 2xl:px-10">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-144 w-240 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(70,208,255,0.18),transparent_60%)] blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-112 w-md rounded-full bg-[radial-gradient(circle_at_center,rgba(255,138,61,0.14),transparent_65%)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-semibold">
                <SparklesIcon className="size-3.5 text-(--brand-highlight)" />
                Contact
              </div>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                {"Let's build your roadmap."}
              </h1>
              <p className="text-muted-foreground max-w-xl text-pretty text-lg leading-8">
                {"Tell us your goal and we'll recommend the fastest course path. If you enroll, you'll unlock dashboard access with assignments + marks."}
              </p>
            </div>

            <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
              <CardHeader>
                <CardTitle className="text-lg">Quick info</CardTitle>
                <CardDescription>We respond quickly.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  "Phone: +923257720992",
                  "Email: info@cloudrika.com",
                  "Address: Lahore Punjab Pakistan",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-2">
                    <CheckCircle2Icon className="mt-0.5 size-4 text-(--brand-highlight)" />
                    <div className="text-muted-foreground leading-7">{t}</div>
                  </div>
                ))}
                <div className="rounded-2xl border bg-background/40 p-4">
                  <div className="flex items-center gap-2 font-semibold">
                    <ZapIcon className="size-4 text-(--brand-accent)" />
                    Pro tip
                  </div>
                  <div className="text-muted-foreground mt-1 leading-7">
                    {"Pick a course and tell us your current level. We'll guide your weekly plan and expected outcomes."}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.14),transparent_70%)] p-px">
            <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
              <CardHeader>
                <CardTitle>Send your details</CardTitle>
                <CardDescription>
                  {"Choose a course, tell us your goal, and we'll respond with the next steps."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Formik
                  initialValues={initialValues}
                  validationSchema={contactFormValidationSchema}
                  onSubmit={async (values, { resetForm, setSubmitting }) => {
                    const success = await handleSubmit(values)
                    setSubmitting(false)
                    if (success) resetForm({ values: getContactFormInitialValues(initialCourse ?? undefined), touched: {}, errors: {} })
                    return success
                  }}
                  validateOnBlur={false}
                  validateOnChange={false}
                >
                  {({ values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched, handleSubmit }) => (
                    <Form
                      className="space-y-4"
                      noValidate
                      onSubmit={(e) => {
                        e.preventDefault()
                          ;["firstName", "lastName", "email", "phone", "courses", "message"].forEach((field) =>
                            setFieldTouched(field as keyof ContactFormValues, true)
                          )
                        handleSubmit(e)
                      }}
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="w-full">
                          <Input
                            placeholder="First name"
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={!!(touched.firstName && errors.firstName)}
                            className={cn(touched.firstName && errors.firstName && "border-destructive")}
                          />
                          {touched.firstName && errors.firstName && (
                            <p className="text-destructive mt-1 text-xs">{errors.firstName}</p>
                          )}
                        </div>
                        <div className="w-full">
                          <Input
                            placeholder="Last name"
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={!!(touched.lastName && errors.lastName)}
                            className={cn(touched.lastName && errors.lastName && "border-destructive")}
                          />
                          {touched.lastName && errors.lastName && (
                            <p className="text-destructive mt-1 text-xs">{errors.lastName}</p>
                          )}
                        </div>
                      </div>
                      <div className="w-full">
                        <Input
                          placeholder="Your email"
                          type="email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-invalid={!!(touched.email && errors.email)}
                          className={cn(touched.email && errors.email && "border-destructive")}
                        />
                        {touched.email && errors.email && (
                          <p className="text-destructive mt-1 text-xs">{errors.email}</p>
                        )}
                      </div>
                      <div className="w-full">
                        <PhoneInput
                          value={values.phone}
                          onChange={(phone: PhoneValue) => setFieldValue("phone", phone)}
                          onBlur={() => setFieldTouched("phone", true)}
                          touched={!!touched.phone}
                          placeholder="Phone number"
                          required
                          aria-invalid={!!(touched.phone && errors.phone)}
                          suppressErrorMessage
                        />
                        {touched.phone && typeof errors.phone === "string" && (
                          <p className="text-destructive mt-1 text-xs">{errors.phone}</p>
                        )}
                      </div>
                      <div className="w-full">
                        <CourseMultiSelect
                          value={values.courses}
                          onChange={(courses: IContactFormCourse[]) => setFieldValue("courses", courses)}
                          placeholder="Search and select courses…"
                          required
                        />
                        {touched.courses && typeof errors.courses === "string" && (
                          <p className="text-destructive mt-1 text-xs">{errors.courses}</p>
                        )}
                      </div>

                      <Textarea
                        placeholder="Tell us your goal (e.g., job in 6 months, freelance clients, ecommerce store)…"
                        className="min-h-44"
                        value={values.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="message"
                      />

                      <Separator />

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          {sent ? (
                            <span className="text-muted-foreground">Thanks! Message received. You can now continue to dashboard with your email.</span>
                          ) : (
                            <>
                              <span className="text-muted-foreground">We reply quickly. Or reach us on</span>
                              <Button variant="outline" size="sm" shape="pill" asChild>
                                <a href="https://wa.me/923257720992" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5">
                                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                  </svg>
                                  WhatsApp
                                </a>
                              </Button>
                            </>
                          )}
                        </div>
                        <Button variant="brand-secondary" shape="pill" className="h-11 w-fit" type="submit">
                          Send message
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
