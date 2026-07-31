const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lymilwegnuzimngpawik.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5bWlsd2VnbnV6aW1uZ3Bhd2lrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzQ4OTU4OSwiZXhwIjoyMDk5MDY1NTg5fQ.APIMQF3cMuNz2CIZbXIT_1UNkkbWppZ8c55dlOrEGKc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: users, error: authErr } = await supabase.auth.admin.listUsers();
  if (authErr) {
    console.error('Auth Error:', authErr);
  }
  let userId = null;
  if (users) {
    const u = users.users.find(x => x.email === 'bharat.nair.mail@gmail.com');
    if (u) {
      userId = u.id;
      console.log('Found user in auth:', userId);
    }
  }

  if (!userId) {
     const { data: profile } = await supabase.from('profiles').select('*').eq('email', 'bharat.nair.mail@gmail.com').maybeSingle();
     if (profile) {
       userId = profile.id;
       console.log('Found user in profiles:', userId);
     }
  }

  if (!userId) {
    console.log('User not found!');
    return;
  }

  const { data: courses, error: courseErr } = await supabase.from('courses').select('*');
  console.log('Courses:', courses);

  if (courses && courses.length > 0) {
     const course = courses.find(c => c.slug === 'ai-foundations' || c.title.toLowerCase().includes('ai foundations')) || courses[0];
     const courseId = course.id;
     console.log('Found course:', course.title, courseId);
     
     const { data: enroll, error: enrollErr } = await supabase.from('enrollments').upsert([
       { user_id: userId, course_id: courseId, status: 'active' }
     ], { onConflict: 'user_id, course_id' }).select();
     
     if (enrollErr) {
       console.error('Enrollment error:', enrollErr);
     } else {
       console.log('Successfully enrolled:', enroll);
     }
  }
}

run().catch(console.error);
