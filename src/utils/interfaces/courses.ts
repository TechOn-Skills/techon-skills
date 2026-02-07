import { TechId } from "../types"

export interface ICourseSection {
    title: string
    description: string
    icon: string
}

export interface IPublicCourse {
    slug: string
    title: string
    subtitle: string
    duration: string
    price: string
    icon: string
    highlight?: string
    benefits?: string[]
    sections: ICourseSection[]
    technologies: { id: TechId; label: string }[]
    projects: { title: string; description: string }[]
}
