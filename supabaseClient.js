const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('✅ Supabase URL:', process.env.SUPABASE_URL);
console.log('✅ Supabase Key:', process.env.SUPABASE_ANON_KEY?.slice(0, 10) + '...');


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);


module.exports = supabase;
