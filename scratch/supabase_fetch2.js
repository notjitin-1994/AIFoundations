const supabaseUrl = 'https://lymilwegnuzimngpawik.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5bWlsd2VnbnV6aW1uZ3Bhd2lrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzQ4OTU4OSwiZXhwIjoyMDk5MDY1NTg5fQ.APIMQF3cMuNz2CIZbXIT_1UNkkbWppZ8c55dlOrEGKc';

const headers = {
  'apikey': supabaseKey,
  'Authorization': `Bearer ${supabaseKey}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

async function run() {
  // 1. Get user from Auth
  console.log('Fetching user from Auth API...');
  let res = await fetch(`${supabaseUrl}/auth/v1/admin/users`, { headers });
  if (!res.ok) {
    console.log('Auth users API failed:', await res.text());
    return;
  }
  let data = await res.json();
  let user = data.users ? data.users.find(u => u.email === 'bharat.nair.mail@gmail.com') : null;
  
  if (!user) {
    console.log('User not found in auth! Creating user...');
    // create user
    const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: 'bharat.nair.mail@gmail.com',
        email_confirm: true,
        password: 'Password123!',
        user_metadata: { first_name: 'Bharat', last_name: 'Nair' }
      })
    });
    if (!createRes.ok) {
      console.log('Failed to create user:', await createRes.text());
      return;
    }
    user = await createRes.json();
    console.log('User created:', user.id);
  } else {
    console.log('Found user in Auth:', user.id);
  }

  const userId = user.id;

  // 1.5 ensure profile exists
  console.log('Upserting profile...');
  await fetch(`${supabaseUrl}/rest/v1/profiles`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify({
      id: userId,
      email: 'bharat.nair.mail@gmail.com',
      first_name: 'Bharat',
      last_name: 'Nair',
      app_role: 'learner'
    })
  });

  // 2. Get course
  console.log('Fetching courses...');
  res = await fetch(`${supabaseUrl}/rest/v1/courses`, { headers });
  data = await res.json();
  if (data.length === 0) {
    console.log('No courses found!');
    return;
  }
  
  const course = data.find(c => c.slug === 'ai-foundations' || c.title.toLowerCase().includes('ai foundations')) || data[0];
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
