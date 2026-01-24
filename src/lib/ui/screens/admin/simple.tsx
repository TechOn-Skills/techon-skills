import Link from "next/link"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { ADMIN_SIDEBAR_ITEMS } from "@/utils/constants"

export const AdminSimpleScreen = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <div className="w-full py-10">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">Admin</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          {description}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {ADMIN_SIDEBAR_ITEMS.map((i) => (
          <Card key={i.href} className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
            <CardHeader>
              <CardTitle>{i.label}</CardTitle>
              <CardDescription>Open {i.label.toLowerCase()}.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" shape="pill" className="justify-start">
                <Link href={i.href}>Go</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

