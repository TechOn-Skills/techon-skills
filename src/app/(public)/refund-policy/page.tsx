import { SimpleLegalPage } from "@/lib/ui/screens/public/legal/simple-legal-page"

export default function RefundPolicyPage() {
  return (
    <SimpleLegalPage
      title="Refund Policy"
      content={[
        "This refund policy is a placeholder. Replace with your official policy.",
        "Refund eligibility may depend on course progress and time since enrollment.",
        "For refund requests, contact: info@cloudrika.com",
      ]}
    />
  )
}

