import { SimpleLegalPage } from "@/lib/ui/screens/public/legal/simple-legal-page"

export default function PrivacyPolicyPage() {
  return (
    <SimpleLegalPage
      title="Privacy Policy"
      content={[
        "This privacy policy is a placeholder. Replace with your official policy.",
        "We may store basic account/session data to provide dashboard access.",
        "Contact us for any privacy-related questions.",
      ]}
    />
  )
}

