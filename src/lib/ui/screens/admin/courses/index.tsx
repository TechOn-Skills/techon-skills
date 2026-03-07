"use client"

import { useQuery, useMutation } from "@apollo/client/react"
import { BookOpenIcon, Loader2Icon, Trash2Icon } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { GET_COURSES, DELETE_COURSE } from "@/lib/graphql"

type CourseRow = { id: string; title: string; slug: string; subtitle?: string; totalFee?: number; feePerMonth?: number; courseDurationInMonths?: number }

export const AdminCoursesScreen = () => {
  const { data, loading, error, refetch } = useQuery<{ getCourses: CourseRow[] }>(GET_COURSES)
  const [deleteCourse, { loading: deleting }] = useMutation(DELETE_COURSE, {
    onCompleted: () => { toast.success("Course deleted"); refetch() },
    onError: (e) => toast.error(e.message),
  })

  const courses = data?.getCourses ?? []

  const handleDelete = (id: string) => {
    if (!confirm("Delete this course? This cannot be undone.")) return
    deleteCourse({ variables: { input: { id } } })
  }

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">Admin</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Courses</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          Manage course catalog. Courses are created via the API or database; you can delete them here. To add a new course use the API with full details (technologies, articleFeatures).
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" />
          <span>Loading courses...</span>
        </div>
      ) : error ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-destructive">Failed to load courses.</p>
        </div>
      ) : (
        <Card className="bg-background/70 backdrop-blur rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/40">
                  <tr>
                    <th className="p-4 font-semibold">Course</th>
                    <th className="p-4 font-semibold">Slug</th>
                    <th className="p-4 font-semibold">Duration</th>
                    <th className="p-4 font-semibold">Fee</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c.id} className="border-b transition-colors hover:bg-muted/20">
                      <td className="p-4">
                        <div className="font-medium">{c.title}</div>
                        {c.subtitle && <div className="text-muted-foreground text-xs">{c.subtitle}</div>}
                      </td>
                      <td className="p-4 font-mono text-xs">{c.slug}</td>
                      <td className="p-4 text-muted-foreground">{c.courseDurationInMonths != null ? `${c.courseDurationInMonths} mo` : "—"}</td>
                      <td className="p-4">
                        {c.totalFee != null ? `PKR ${c.totalFee.toLocaleString()}` : "—"}
                        {c.feePerMonth != null && <span className="text-muted-foreground text-xs block">PKR {c.feePerMonth}/mo</span>}
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(c.id)} disabled={deleting}>
                          <Trash2Icon className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {courses.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <BookOpenIcon className="size-12 mx-auto mb-4 opacity-50" />
                <p>No courses in the catalog. Add courses via the API or database.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
