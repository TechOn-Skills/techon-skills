"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@apollo/client/react"
import { DownloadIcon, FolderOpenIcon, Loader2Icon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { GET_MY_PUBLISHED_COURSE_CONTENTS, GET_PUBLISHED_COURSE_CONTENTS } from "@/lib/graphql"
import { useUser } from "@/lib/providers/user"

type ContentItem = {
  id: string
  courseId: string
  title: string
  description: string | null
  attachments: Array<{ url: string; filename: string; contentType: string }>
  createdAt: string
  course?: { id: string; title: string; slug: string } | null
}

export const StudentCourseContentScreen = () => {
  const { userProfileInfo, enrolledCoursesFromApi } = useUser()
  const [courseFilter, setCourseFilter] = useState<string>("all")

  const { data: allData, loading: loadingAll } = useQuery<{ getMyPublishedCourseContents: ContentItem[] }>(
    GET_MY_PUBLISHED_COURSE_CONTENTS,
    { skip: !userProfileInfo?.id, fetchPolicy: "network-only" }
  )

  const { data: filteredData, loading: loadingFiltered } = useQuery<{
    getPublishedCourseContents: ContentItem[]
  }>(GET_PUBLISHED_COURSE_CONTENTS, {
    variables: { courseId: courseFilter },
    skip: !userProfileInfo?.id || courseFilter === "all",
    fetchPolicy: "network-only",
  })

  const items = useMemo(
    () =>
      courseFilter === "all"
        ? allData?.getMyPublishedCourseContents ?? []
        : filteredData?.getPublishedCourseContents ?? [],
    [courseFilter, allData, filteredData]
  )
  const loading = courseFilter === "all" ? loadingAll : loadingFiltered

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8">
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Course content</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          Slides and materials shared by your instructors for your enrolled courses.
        </p>
      </div>

      <div className="mb-6">
        <label className="text-muted-foreground mb-2 block text-sm font-medium">Course</label>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="border-input bg-background rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--brand-secondary)"
        >
          <option value="all">All enrolled courses</option>
          {enrolledCoursesFromApi.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-muted-foreground flex items-center justify-center gap-2 py-20">
          <Loader2Icon className="size-6 animate-spin" />
          Loading materials…
        </div>
      ) : items.length === 0 ? (
        <Card className="rounded-3xl">
          <CardContent className="text-muted-foreground flex flex-col items-center gap-3 py-16 text-center">
            <FolderOpenIcon className="size-12 opacity-40" />
            <p>No published course materials yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.id} className="rounded-3xl">
              <CardHeader>
                <CardDescription>{item.course?.title ?? "Course"}</CardDescription>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                {item.description ? <p className="text-muted-foreground text-sm">{item.description}</p> : null}
              </CardHeader>
              <CardContent>
                {item.attachments.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No downloadable files attached.</p>
                ) : (
                  <ul className="space-y-2">
                    {item.attachments.map((a) => (
                      <li key={a.url}>
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-(--brand-secondary) hover:underline"
                        >
                          <DownloadIcon className="size-4" />
                          {a.filename || "Download file"}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
