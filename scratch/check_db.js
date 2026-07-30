const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/home/jitin/orbit-v1/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { data: users, error: uErr } = await supabase.auth.admin.listUsers();
  if (uErr) console.error(uErr);
  const user = users.users.find(u => u.email === 'not.jitin@gmail.com');
  console.log("User:", user);
  
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    console.log("Profile:", profile);
    
    // Check if there's an enrollments or access table
    const { data: enrollments } = await supabase.from('enrollments').select('*').eq('user_id', user.id);
    console.log("Enrollments:", enrollments);
    
    const { data: purchases } = await supabase.from('purchases').select('*').eq('user_id', user.id);
    console.log("Purchases:", purchases);
  }
}
main();
