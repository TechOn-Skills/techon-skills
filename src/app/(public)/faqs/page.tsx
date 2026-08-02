import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lib/ui/accordion"

const faqs = [
  {
    question: "What is TechOn Skills?",
    answer:
      "TechOn Skills is a practical, project-based training platform operated by Cloudrika Technologies, based in Lahore, Pakistan. We teach Web Development, Mobile App Development, Software Engineering, and E-commerce (Shopify, WordPress, Wix) through structured lessons, hands-on assignments, and a dashboard that tracks your marks and progress.",
  },
  {
    question: "Who are the courses for?",
    answer:
      "Students, recent graduates, and working professionals who want job-ready or freelance-ready skills, no prior coding experience is required for beginner tracks. Course pages list any prerequisites for advanced tracks.",
  },
  {
    question: "How much do courses cost?",
    answer:
      "Pricing starts from PKR 3,500/month, depending on the course and track selected. Exact fees are shown on each course page and at enrollment.",
  },
  {
    question: "How does enrollment work?",
    answer:
      "Select your course(s) on the Enrollment page, review your first-fee total, pay via the listed methods, upload your payment screenshot, and submit. Your account is created and activated after admin approval.",
  },
  {
    question: "How are classes delivered?",
    answer:
      "Classes run live online (Google Meet) with recordings and materials available on your dashboard, alongside structured lessons, assignments, and marks tracking.",
  },
  {
    question: "What if I miss a class?",
    answer:
      "Recordings and lesson materials remain available on your dashboard so you can catch up. Assignment deadlines still apply, see your course schedule.",
  },
  {
    question: "Do you offer career support?",
    answer:
      "Yes, for consistently high-performing students. Career support means introductions and guidance toward opportunities for candidates whose submissions and performance stand out, it is not a guaranteed job placement, and we don't claim otherwise.",
  },
  {
    question: "Do I get a certificate?",
    answer:
      "Yes, on successful completion of a course's assignments and requirements. A certificate reflects completed training, it is proof of work done, not a guarantee of employment.",
  },
  {
    question: "Can I get a refund if I change my mind?",
    answer:
      "See our Refund Policy page for exact terms and timelines on cancellations, course-start windows, and eligibility.",
  },
  {
    question: "Can I switch courses after enrolling?",
    answer:
      "Yes, contact support via WhatsApp or email and we'll help you switch tracks, subject to seat availability on the new course.",
  },
  {
    question: "How do I contact the team?",
    answer:
      "Phone/WhatsApp: +92 325 7720992 · Email: info@techonskills.com · Address: 8th Floor, Office No. 812, Al Hafeez Executive Towers, Gulberg II, Firdous Market, Lahore, Punjab, Pakistan.",
  },
]

export default function FAQsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-muted-foreground">
          Everything you need to know before you enroll. Can&apos;t find your
          answer? Message us on WhatsApp at{" "}
          <a
            href="https://wa.me/923257720992"
            className="font-medium underline underline-offset-4"
          >
            +92 325 7720992
          </a>
          .
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-base font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}