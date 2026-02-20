"use client"
import Link from "next/link"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import {
  ArrowRightIcon,
  AwardIcon,
  BriefcaseIcon,
  CheckCircle2Icon,
  CodeIcon,
  FileCheck2Icon,
  GraduationCapIcon,
  MessageCircleIcon,
  SparklesIcon,
  SmartphoneIcon,
  StarsIcon,
  StoreIcon,
  WrenchIcon,
  XIcon,
} from "lucide-react"
import { useEffect, useState } from "react"

import { Formik, Form } from "formik"
import toast from "react-hot-toast"

import { cn, getApiDisplayMessage, logger } from "@/lib/helpers"
import {
  contactFormValidationSchema,
  getContactFormInitialValues,
  type ContactFormValues,
} from "@/lib/helpers/contact-form"
import { apiService } from "@/lib/services/api"
import { useCourses } from "@/lib/providers/courses"
import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { CourseMultiSelect } from "@/lib/ui/useable-components/course-multi-select"
import { Input } from "@/lib/ui/useable-components/input"
import { PhoneInput, getFullPhone, type PhoneValue } from "@/lib/ui/useable-components/phone-input"
import { Textarea } from "@/lib/ui/useable-components/textarea"
import { Separator } from "@/lib/ui/useable-components/separator"
import type { IContactForm, IContactFormCourse } from "@/utils/interfaces"
import { LoggerLevel } from "@/utils/enums"

const CONTACT_MODAL_SHOWN_KEY = "techon_contact_modal_shown"

const FEATURED_COURSE_ICONS: Record<string, typeof CodeIcon> = {
  code: CodeIcon,
  smartphone: SmartphoneIcon,
  wrench: WrenchIcon,
  store: StoreIcon,
}

export const LandingPageScreen = () => {
  const { featuredCourses: featuredFromHook } = useCourses()
  const featuredCourses = featuredFromHook.map((c) => ({
    ...c,
    icon: FEATURED_COURSE_ICONS[c.icon] ?? CodeIcon,
  }))
  const [contactSent, setContactSent] = useState(false)
  const [contactModalOpen, setContactModalOpen] = useState(false)

  // Show contact modal on first visit; persist "shown" in localStorage so it only appears once.
  useEffect(() => {
    if (typeof window === "undefined") return
    const alreadyShown = localStorage.getItem(CONTACT_MODAL_SHOWN_KEY)
    if (alreadyShown === "true") return
    const t = setTimeout(() => setContactModalOpen(true), 500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (contactModalOpen && typeof window !== "undefined") {
      localStorage.setItem(CONTACT_MODAL_SHOWN_KEY, "true")
    }
  }, [contactModalOpen])

  useEffect(() => {
    // Smooth scrolling + reveal animations (no scroll-snap to avoid footer jump).
    const root = document.documentElement
    root.classList.add("scroll-smooth")

    const revealEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    )
    for (const el of revealEls) {
      el.classList.add("opacity-0", "translate-y-6")
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement
          if (entry.isIntersecting) {
            el.classList.add("opacity-100", "translate-y-0")
            el.classList.remove("opacity-0", "translate-y-6")
          } else {
            // fade-out when leaving viewport
            el.classList.add("opacity-0", "translate-y-6")
            el.classList.remove("opacity-100", "translate-y-0")
          }
        }
      },
      { threshold: 0.12, rootMargin: "-10% 0px -10% 0px" }
    )
    for (const el of revealEls) io.observe(el)
    return () => {
      io.disconnect()
      root.classList.remove("scroll-smooth")
    }
  }, [])

  const submitContactPayload = async (values: ContactFormValues) => {
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
      toast.success(getApiDisplayMessage(response, "Thanks! We'll get back soon."))
      setContactSent(true)
      setContactModalOpen(false)
    } else {
      toast.error(getApiDisplayMessage(response, "Failed to send message. Please try again."))
    }
    return response.success
  }

  return (
    <div className="w-full">
      <DialogPrimitive.Root open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-md transition-all duration-500" />
          <DialogPrimitive.Content
            className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border-0 shadow-2xl outline-none focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4 duration-500"
            style={{
              background: "linear-gradient(135deg, rgba(79,195,232,0.12), rgba(242,140,40,0.08), var(--card))",
              boxShadow: "0 0 0 1px rgba(79,195,232,0.2), 0 25px 50px -12px rgba(0,0,0,0.35)",
            }}
          >
            <div className="relative flex max-h-[90vh] flex-col">
              <div className="flex-none p-6 pb-0 sm:p-8 sm:pb-0">
                <div className="absolute right-4 top-4">
                  <DialogPrimitive.Close asChild>
                    <button
                      type="button"
                      className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-background/60 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-(--brand-highlight)"
                      aria-label="Close"
                    >
                      <XIcon className="size-5" />
                    </button>
                  </DialogPrimitive.Close>
                </div>
                <div className="flex items-start gap-3 pr-10">
                  <span className="bg-(--brand-primary) text-(--text-on-dark) inline-flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-lg">
                    <MessageCircleIcon className="size-6" />
                  </span>
                  <div className="min-w-0">
                    <DialogPrimitive.Title className="text-xl font-semibold tracking-tight">
                      Say hello — we’d love to help
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="text-muted-foreground mt-1 text-sm leading-6">
                      Tell us your name, interests, and a quick message. We’ll get back soon.
                    </DialogPrimitive.Description>
                  </div>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-6 pt-4 sm:p-8 sm:pt-4">
                <Formik
                  initialValues={getContactFormInitialValues()}
                  validationSchema={contactFormValidationSchema}
                  onSubmit={async (values, { resetForm, setSubmitting }) => {
                    const success = await submitContactPayload(values)
                    setSubmitting(false)
                    if (success) resetForm({ values: getContactFormInitialValues(), touched: {}, errors: {} })
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
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="w-full">
                          <Input
                            placeholder="First name"
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={!!(touched.firstName && errors.firstName)}
                            className={cn(
                              "rounded-xl border-background/60 bg-background/50 transition-colors focus:bg-background",
                              touched.firstName && errors.firstName && "border-destructive"
                            )}
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
                            className={cn(
                              "rounded-xl border-background/60 bg-background/50 transition-colors focus:bg-background",
                              touched.lastName && errors.lastName && "border-destructive"
                            )}
                          />
                          {touched.lastName && errors.lastName && (
                            <p className="text-destructive mt-1 text-xs">{errors.lastName}</p>
                          )}
                        </div>
                      </div>
                      <div className="w-full">
                        <Input
                          placeholder="Your email"
                          name="email"
                          type="email"
                          required
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-invalid={!!(touched.email && errors.email)}
                          className={cn(
                            "rounded-xl border-background/60 bg-background/50 transition-colors focus:bg-background",
                            touched.email && errors.email && "border-destructive"
                          )}
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
                          className="[&_select]:rounded-l-xl [&_input]:rounded-r-xl [&_select]:border-background/60 [&_input]:border-background/60 [&_select]:bg-background/50 [&_input]:bg-background/50"
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
                        placeholder="Message"
                        className="min-h-32 rounded-xl border-background/60 bg-background/50 transition-colors focus:bg-background"
                        name="message"
                        value={values.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          {contactSent ? (
                            <span className="text-muted-foreground">{"Thanks! We'll get back soon."}</span>
                          ) : (
                            <>
                              <span className="text-muted-foreground">Prefer call? +923257720992</span>
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
                        <Button variant="brand-secondary" shape="pill" className="w-fit shrink-0" type="submit">
                          Send message
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-144 w-240 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(79,195,232,0.22),transparent_60%)] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-112 w-md rounded-full bg-[radial-gradient(circle_at_center,rgba(242,140,40,0.16),transparent_65%)] blur-3xl" />
      </div>

      <div className="w-full">
        <section
          id="hero"
          data-reveal
          className="scroll-mt-24 transition-all duration-700 ease-out will-change-transform"
        >
          <div className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 2xl:px-10">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium">
                    <CheckCircle2Icon className="size-3.5 text-(--brand-highlight)" />
                    Job-ready skills, built with real projects
                  </div>

                  <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                    Learn skills that{" "}
                    <span className="bg-[linear-gradient(135deg,var(--brand-secondary),var(--brand-highlight))] bg-clip-text text-transparent">
                      convert
                    </span>{" "}
                    into outcomes.
                  </h1>

                  <p className="text-muted-foreground max-w-2xl text-pretty text-lg leading-8">
                    TechOn Skills helps you become confident in Web Development, Mobile App Development, Software Engineering,
                    and Ecommerce (Shopify + WordPress + Wix) — with structured learning, practical assignments, and a dashboard
                    that tracks marks.
                  </p>

                  <div className="border-border/60 bg-background/40 rounded-2xl border p-4 text-sm">
                    <div className="font-semibold">Career support</div>
                    <div className="text-muted-foreground mt-1 leading-7">
                      We help deserving candidates start their careers by connecting them to job opportunities after consistent
                      performance and strong project submissions.
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button asChild size="xl" shape="pill">
                      <Link href="/courses">
                        Explore courses
                        <ArrowRightIcon className="size-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="xl" shape="pill">
                      <Link href="/contact">Talk to us</Link>
                    </Button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "Hands-on", value: "Projects" },
                      { label: "Guided", value: "Flow" },
                      { label: "Clear", value: "Outcomes" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-2xl border bg-background/60 p-4">
                        <div className="text-xl font-semibold">{s.value}</div>
                        <div className="text-muted-foreground text-xs">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
                  <CardHeader>
                    <CardTitle>What you’ll build</CardTitle>
                    <CardDescription>Portfolio-ready projects and real workflows.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {[
                      "A modern landing page + dashboard UI",
                      "An API-driven app with authentication",
                      "A deployable project with Git workflow",
                    ].map((t) => (
                      <div key={t} className="flex items-start gap-2">
                        <CheckCircle2Icon className="mt-0.5 size-4 text-(--brand-highlight)" />
                        <div>{t}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section
          id="courses"
          data-reveal
          className="scroll-mt-24 transition-all duration-700 ease-out will-change-transform"
        >
          <div className="px-4 py-12 sm:px-6 sm:py-14 lg:px-8 2xl:px-10">
            <div className="mx-auto max-w-6xl space-y-8">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-secondary">Featured</div>
                <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  Pick a path — we’ll guide you to the finish line.
                </h2>
                <p className="text-muted-foreground max-w-2xl">
                  Choose one track or combine skills. Every course follows a clean flow: learn → practice → submit →
                  feedback.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {featuredCourses.map((c) => (
                  <Link key={c.title} href={`/courses/${c.slug}`} className="block transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50 h-full cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <span className="bg-(--brand-primary) text-(--text-on-dark) inline-flex size-10 items-center justify-center rounded-2xl">
                            <c.icon className="size-5" />
                          </span>
                          <div>
                            <CardTitle className="text-base">{c.title}</CardTitle>
                            <CardDescription className="text-xs leading-5">
                              {c.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm">
                          {c.bullets.slice(0, 2).map((b) => (
                            <div key={b} className="flex items-start gap-2">
                              <CheckCircle2Icon className="mt-0.5 size-4 text-(--brand-highlight)" />
                              <div className="text-sm">{b}</div>
                            </div>
                          ))}
                        </div>
                        <span className="text-foreground shrink-0 whitespace-nowrap inline-flex w-fit items-center gap-2 text-sm font-medium">
                          View details
                          <ArrowRightIcon className="size-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="why"
          data-reveal
          className="scroll-mt-24 transition-all duration-700 ease-out will-change-transform"
        >
          <div className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8 2xl:px-10">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(27,119,182,0.18),transparent_55%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.22))]" />
            </div>

            <div className="mx-auto max-w-6xl space-y-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-semibold">
                  <SparklesIcon className="size-3.5 text-(--brand-highlight)" />
                  Why TechOn Skills
                </div>
                <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  A smooth learning loop that makes you unstoppable.
                </h2>
                <p className="text-muted-foreground max-w-3xl text-pretty">
                  We built the platform around human psychology: small wins, visible progress, and momentum that keeps you
                  showing up daily.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {[
                  {
                    title: "Structured lessons",
                    description: "Short lessons that build confidence without overwhelming you.",
                    icon: GraduationCapIcon,
                  },
                  {
                    title: "Assignments + marks",
                    description: "Submit work, get marks, and see progress clearly — like a real training program.",
                    icon: FileCheck2Icon,
                  },
                  {
                    title: "Career support",
                    description: "Deserving candidates get help to start careers through strong performance and projects.",
                    icon: BriefcaseIcon,
                  },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="rounded-3xl bg-[linear-gradient(135deg,rgba(79,195,232,0.30),rgba(242,140,40,0.14),transparent_70%)] p-px transition-all hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
                      <CardHeader className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="bg-(--brand-primary) text-(--text-on-dark) inline-flex size-10 items-center justify-center rounded-2xl">
                            <f.icon className="size-5" />
                          </span>
                          <CardTitle className="text-lg">{f.title}</CardTitle>
                        </div>
                        <CardDescription className="text-sm leading-7">{f.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
                <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
                  <CardHeader>
                    <CardTitle>How the flow works</CardTitle>
                    <CardDescription>Simple, repeatable, addictive progress.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3 sm:grid-cols-3">
                    {[
                      { t: "Learn", d: "Short lesson + examples", icon: StarsIcon },
                      { t: "Practice", d: "Guided tasks & projects", icon: WrenchIcon },
                      { t: "Submit", d: "Marks + feedback loop", icon: AwardIcon },
                    ].map((s) => (
                      <div key={s.t} className="rounded-2xl border bg-background/40 p-4">
                        <div className="flex items-center gap-2">
                          <s.icon className="size-4 text-(--brand-highlight)" />
                          <div className="font-semibold">{s.t}</div>
                        </div>
                        <div className="text-muted-foreground mt-1 text-sm leading-6">{s.d}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
                  <CardHeader>
                    <CardTitle>What makes people finish</CardTitle>
                    <CardDescription>Designed to keep you moving.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {[
                      "Visible progress (marks) creates momentum",
                      "Small milestones prevent overwhelm",
                      "Projects build confidence faster than theory",
                    ].map((t) => (
                      <div key={t} className="flex items-start gap-2">
                        <CheckCircle2Icon className="mt-0.5 size-4 text-(--brand-highlight)" />
                        <div className="text-muted-foreground leading-7">{t}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section
          id="testimonials"
          data-reveal
          className="scroll-mt-24 transition-all duration-700 ease-out will-change-transform"
        >
          <div className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8 2xl:px-10">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,195,232,0.14),transparent_55%)]" />
            </div>
            <div className="mx-auto max-w-6xl space-y-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-semibold">
                  <SparklesIcon className="size-3.5 text-(--brand-highlight)" />
                  Outcomes
                </div>
                <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  Built to upgrade you — fast.
                </h2>
                <p className="text-muted-foreground max-w-3xl text-pretty">
                  You’ll build proof, not just learn theory. Your dashboard keeps you accountable with assignments, submissions,
                  and marks.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {[
                  { title: "Clear roadmap", description: "Know exactly what to learn next — no confusion." },
                  { title: "Portfolio ready", description: "Projects that prove skill and unlock confidence." },
                  { title: "Career lift", description: "Top performers get support to start careers and win opportunities." },
                ].map((t) => (
                  <div
                    key={t.title}
                    className="rounded-3xl bg-[linear-gradient(135deg,rgba(242,140,40,0.18),rgba(79,195,232,0.22),transparent_70%)] p-px transition-all hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
                      <CardHeader>
                        <CardTitle className="text-lg">{t.title}</CardTitle>
                        <CardDescription className="text-sm leading-7">{t.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                ))}
              </div>

              <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
                <CardContent className="grid gap-6 p-6 sm:grid-cols-3 sm:p-8">
                  {[
                    { k: "Marks tracking", v: "See progress clearly" },
                    { k: "Assignments", v: "Build discipline" },
                    { k: "Career support", v: "For deserving candidates" },
                  ].map((s) => (
                    <div key={s.k} className="rounded-2xl border bg-background/40 p-5">
                      <div className="text-muted-foreground text-xs">{s.k}</div>
                      <div className="mt-1 text-xl font-semibold">{s.v}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section
          id="contact"
          data-reveal
          className="scroll-mt-24 transition-all duration-700 ease-out will-change-transform"
        >
          <div className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8 2xl:px-10">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,140,40,0.12),transparent_55%)]" />
            </div>

            <div className="mx-auto max-w-6xl">
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
                  <CardHeader>
                    <CardTitle>Talk to us</CardTitle>
                    <CardDescription>
                      We’ll help you choose the right course and explain the flow.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {[
                      { k: "Phone", v: "+923257720992" },
                      { k: "Email", v: "info@cloudrika.com" },
                      { k: "Address", v: "Lahore Punjab Pakistan" },
                    ].map((r) => (
                      <div key={r.k} className="rounded-2xl border bg-background/40 p-4">
                        <div className="text-muted-foreground text-xs">{r.k}</div>
                        <div className="mt-1 font-semibold">{r.v}</div>
                      </div>
                    ))}
                    <div className="rounded-2xl border bg-background/40 p-4">
                      <div className="text-muted-foreground text-xs">Tip</div>
                      <div className="mt-1 leading-7">
                        Mention your target course and your current level — we’ll suggest the fastest path.
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
                  <CardHeader>
                    <CardTitle>Contact form</CardTitle>
                    <CardDescription>
                      Submit this and we’ll respond quickly.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Formik
                      initialValues={getContactFormInitialValues()}
                      validationSchema={contactFormValidationSchema}
                      onSubmit={async (values, { resetForm, setSubmitting }) => {
                        const success = await submitContactPayload(values)
                        setSubmitting(false)
                        if (success) resetForm({ values: getContactFormInitialValues(), touched: {}, errors: {} })
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
                              name="email"
                              type="email"
                              required
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
                            placeholder="Message"
                            className="min-h-40"
                            name="message"
                            value={values.message}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <Separator />
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                              {contactSent ? (
                                <span className="text-muted-foreground">{"Thanks! We'll get back soon."}</span>
                              ) : (
                                <>
                                  <span className="text-muted-foreground">Prefer call? +923257720992</span>
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
                            <Button variant="brand-secondary" shape="pill" className="w-fit" type="submit">
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
        </section>
      </div>
    </div>
  )
}

