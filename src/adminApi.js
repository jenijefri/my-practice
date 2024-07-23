// serverApi.js
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with the service role key
const supabaseUrl = 'https://zvkmujelsuyldwuukzig.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2a211amVsc3V5bGR3dXVremlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg3MzI5MzEsImV4cCI6MjAzNDMwODkzMX0.eaLh_wnpd3C1RrCJQiHysBe6kv8eYAHrxq4Bz-u7QWw';


const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export const fetchAllUsers = async () => {
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }

  return data.users;
};
