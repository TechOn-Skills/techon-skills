export interface IStudentCoursesHeaderProps {
    className?: string
    searchProps?: { type: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }
}