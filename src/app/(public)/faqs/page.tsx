import { SimpleLegalPage } from "@/lib/ui/screens/public/legal/simple-legal-page"

export default function FAQsPage() {
  return (
    <SimpleLegalPage
      title="FAQs"
      content={[
        "How do I enroll? Contact us and we’ll guide you.",
        "How do assignments work? You’ll submit your work inside the dashboard and receive marks.",
        "Can I switch courses? Contact support and we’ll assist you.",
      ]}
    />
  )
}

