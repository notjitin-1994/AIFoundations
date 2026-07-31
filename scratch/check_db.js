const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:Vtvt%40123%401994@db.lymilwegnuzimngpawik.supabase.co:5432/postgres'
});

async function run() {
  await client.connect();
  const res = await client.query(`SELECT id, email FROM auth.users WHERE email = 'bharat.nair.mail@gmail.com'`);
  console.log('Users:', res.rows);

  const courses = await client.query(`SELECT id, slug, title FROM public.courses`);
  console.log('Courses:', courses.rows);

  await client.end();
}
run().catch(console.error);
