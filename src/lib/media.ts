const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export function audioUrl(filename: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/course-audio/${filename}`;
}

export function imageUrl(filename: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/course-images/${filename}`;
}

export function videoUrl(filename: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/course-videos/${filename}`;
}
