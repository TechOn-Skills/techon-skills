import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

const COURSES_DIR = join(process.cwd(), "src", "lib", "courses")

function isSafeSegment(segment: string): boolean {
    return segment.length > 0 && !segment.includes("..") && !segment.includes("/") && !segment.includes("\\")
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const courseSlug = searchParams.get("courseSlug")
    const moduleSlug = searchParams.get("moduleSlug")
    const chapterSlug = searchParams.get("chapterSlug")
    const type = searchParams.get("type") ?? "md"

    if (!courseSlug || !moduleSlug || !chapterSlug) {
        return NextResponse.json(
            { error: "Missing courseSlug, moduleSlug, or chapterSlug" },
            { status: 400 }
        )
    }

    if (!isSafeSegment(courseSlug) || !isSafeSegment(moduleSlug) || !isSafeSegment(chapterSlug)) {
        return NextResponse.json({ error: "Invalid path segments" }, { status: 400 })
    }

    if (type !== "md" && type !== "json") {
        return NextResponse.json({ error: "type must be md or json" }, { status: 400 })
    }

    const ext = type === "md" ? ".md" : ".json"
    const filePath = join(COURSES_DIR, courseSlug, moduleSlug, `${chapterSlug}${ext}`)

    if (!filePath.startsWith(COURSES_DIR)) {
        return NextResponse.json({ error: "Invalid path" }, { status: 400 })
    }

    try {
        const content = await readFile(filePath, "utf-8")
        if (type === "json") {
            const json = JSON.parse(content)
            return NextResponse.json(json)
        }
        return new NextResponse(content, {
            headers: { "Content-Type": "text/markdown; charset=utf-8" },
        })
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        if (message.includes("ENOENT")) {
            return NextResponse.json({ error: "Content not found" }, { status: 404 })
        }
        return NextResponse.json({ error: "Failed to read content" }, { status: 500 })
    }
}
