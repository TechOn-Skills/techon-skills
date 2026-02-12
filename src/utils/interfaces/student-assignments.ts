export interface IStudentAssignment {
  id: string
  title: string
  dueDate: string
  course: string
  brief: string
  requirements: string[]
}

export interface ISubmission {
  text: string
  submittedAt: string
  marks?: number
}
