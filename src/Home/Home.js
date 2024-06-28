import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zvkmujelsuyldwuukzig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2a211amVsc3V5bGR3dXVremlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg3MzI5MzEsImV4cCI6MjAzNDMwODkzMX0.eaLh_wnpd3C1RrCJQiHysBe6kv8eYAHrxq4Bz-u7QWw';

const supabase = createClient(supabaseUrl, supabaseKey);

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Access the email passed via state

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/'); 
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div>
      <h3>Welcome {email} to the home page</h3>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
