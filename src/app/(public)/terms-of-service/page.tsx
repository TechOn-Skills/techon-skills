import { SimpleLegalPage } from "@/lib/ui/screens/public/legal/simple-legal-page"

export default function TermsOfServicePage() {
  return (
    <SimpleLegalPage
      title="Terms of Service"
      content={[
        "These terms are placeholders. Replace with your official terms.",
        "Course access and dashboard features depend on enrollment status.",
        "Respect community guidelines and intellectual property.",
      ]}
    />
  )
}

