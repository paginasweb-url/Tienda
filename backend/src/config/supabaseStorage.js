const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseStorage = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = supabaseStorage;