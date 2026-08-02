// Shared course identity. Not a "use server" module — kept importable by both
// server actions and client components (a "use server" file may only export
// async functions).
export const COURSE_SLUG = "aifoundations-concept2application";
export const COURSE_BASE = `/courses/${COURSE_SLUG}`;
