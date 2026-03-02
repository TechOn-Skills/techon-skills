const STORAGE_KEY = "techon_course_progress";

export type CourseProgressMap = Record<string, Record<string, Record<string, number>>>;

export function getStoredProgress(): CourseProgressMap {
    if (typeof window === "undefined") return {};
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw) as unknown;
        return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? (parsed as CourseProgressMap) : {};
    } catch {
        return {};
    }
}

export function getChapterProgress(courseSlug: string, moduleSlug: string, chapterSlug: string): number {
    const map = getStoredProgress();
    return map[courseSlug]?.[moduleSlug]?.[chapterSlug] ?? 0;
}

export function setChapterProgress(courseSlug: string, moduleSlug: string, chapterSlug: string, percent: number): void {
    const map = getStoredProgress();
    if (!map[courseSlug]) map[courseSlug] = {};
    if (!map[courseSlug][moduleSlug]) map[courseSlug][moduleSlug] = {};
    map[courseSlug][moduleSlug][chapterSlug] = Math.min(100, Math.max(0, percent));
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch {
        // ignore
    }
}

/** Get overall course progress (0–100) from stored chapter progress. */
export function getCourseProgressPercent(courseSlug: string, totalChapters: number): number {
    if (totalChapters === 0) return 0;
    const map = getStoredProgress();
    const course = map[courseSlug];
    if (!course) return 0;
    let completed = 0;
    for (const moduleChapters of Object.values(course)) {
        for (const pct of Object.values(moduleChapters)) {
            if (pct >= 100) completed += 1;
        }
    }
    return Math.round((completed / totalChapters) * 100);
}
