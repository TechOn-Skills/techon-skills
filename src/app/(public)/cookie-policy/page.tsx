import { SimpleLegalPage } from "@/lib/ui/screens/public/legal/simple-legal-page"

export default function CookiePolicyPage() {
  return (
    <SimpleLegalPage
      title="Cookie Policy"
      content={[
        "This cookie policy is a placeholder. Replace with your official policy.",
        "We may use cookies/local storage to keep you signed in and remember preferences.",
      ]}
    />
  )
}

