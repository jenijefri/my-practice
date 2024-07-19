// server.js
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = 3000;

// Initialize Supabase client with your URL and Service Role Key
const supabase = createClient('https://your-supabase-url.supabase.co', 'YOUR_SERVICE_ROLE_KEY');

// API route to fetch all users
app.get('/api/users', async (req, res) => {
  try {
    // Fetch the list of users from Supabase
    const { data, error } = await supabase.auth.admin.listUsers();
    
    // Log the entire response data and error (if any)
    console.log('Fetched data:', data);
    console.error('Error (if any):', error);
    
    if (error) {
      throw error;
    }
    
    // Send the fetched user data as JSON response
    res.json(data.users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
