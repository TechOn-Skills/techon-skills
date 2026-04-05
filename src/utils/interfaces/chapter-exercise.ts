export interface McqOption {
    key: string
    text: string
    isCorrect: boolean
}

export interface McqItem {
    id: number
    question: string
    codeSnippet: string | null
    options: McqOption[]
}

export interface ShortQuestionItem {
    id: number
    question: string
    preferredAnswer: string
}

export interface ChapterExerciseJson {
    chapterTitle: string
    chapterId: string
    MCQs: McqItem[]
    ShortQuestions: ShortQuestionItem[]
}
