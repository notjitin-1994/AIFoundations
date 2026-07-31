const supabaseUrl = 'https://lymilwegnuzimngpawik.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5bWlsd2VnbnV6aW1uZ3Bhd2lrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzQ4OTU4OSwiZXhwIjoyMDk5MDY1NTg5fQ.APIMQF3cMuNz2CIZbXIT_1UNkkbWppZ8c55dlOrEGKc';

const headers = {
  'apikey': supabaseKey,
  'Authorization': `Bearer ${supabaseKey}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

async function run() {
  // 1. Get user profile
  console.log('Fetching user profile...');
  let res = await fetch(`${supabaseUrl}/rest/v1/profiles?email=eq.bharat.nair.mail@gmail.com`, { headers });
  let data = await res.json();
  if (data.length === 0) {
    console.log('User not found in profiles!');
    return;
  }
  const userId = data[0].id;
  console.log('User ID:', userId);

  // 2. Get course
  console.log('Fetching courses...');
  res = await fetch(`${supabaseUrl}/rest/v1/courses`, { headers });
  data = await res.json();
  if (data.length === 0) {
    console.log('No courses found!');
    return;
  }
  
  const course = data.find(c => c.slug === 'ai-foundations') || data[0];
  const courseId = course.id;
  console.log('Course ID:', courseId, course.title);

  // 3. Upsert enrollment
  console.log('Enrolling user...');
  const enrollRes = await fetch(`${supabaseUrl}/rest/v1/enrollments`, {
    method: 'POST',
    headers: {
      ...headers,
      'Prefer': 'resolution=merge-duplicates,return=representation'
    },
    body: JSON.stringify({
      user_id: userId,
      course_id: courseId,
      status: 'active'
    })
  });
  
  if (!enrollRes.ok) {
    const err = await enrollRes.text();
    console.error('Enrollment error:', err);
  } else {
    const enrollData = await enrollRes.json();
    console.log('Successfully enrolled:', enrollData);
  }
}

run().catch(console.error);
