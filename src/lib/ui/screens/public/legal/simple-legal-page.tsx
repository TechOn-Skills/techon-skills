import { Card, CardContent, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"

export const SimpleLegalPage = ({
  title,
  content,
}: {
  title: string
  content: string[]
}) => {
  return (
    <div className="w-full px-4 py-12 sm:px-6 lg:px-8 2xl:px-10">
      <div className="mx-auto max-w-3xl">
        <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7">
            {content.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

