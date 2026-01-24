import { WorkspaceHeader } from "@/lib/ui/screen-components"
import { Button } from "@/lib/ui/useable-components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/ui/useable-components/card"

export const RouteScreen = ({
  contextLabel,
  title,
  description,
  quickLinks,
  items,
}: {
  contextLabel: string
  title: string
  description: string
  quickLinks: { label: string; href: string; disabled?: boolean }[]
  items: { title: string; description: string; cta?: string }[]
}) => {
  return (
    <div className="w-full py-10">
      <WorkspaceHeader
        contextLabel={contextLabel}
        title={title}
        description={description}
        quickLinks={quickLinks}
        primaryAction={quickLinks?.[0] ? { label: quickLinks[0].label, href: quickLinks[0].href } : undefined}
        secondaryAction={quickLinks?.[2] ? { label: quickLinks[2].label, href: quickLinks[2].href } : undefined}
      />

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {items.map((it) => (
          <Card
            key={it.title}
            className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50 transition-shadow hover:shadow-lg"
          >
            <CardHeader>
              <CardTitle>{it.title}</CardTitle>
              <CardDescription>{it.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button variant="default" shape="pill" className="w-fit">
                {it.cta ?? "Open"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

