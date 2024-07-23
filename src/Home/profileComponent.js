import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://zvkmujelsuyldwuukzig.supabase.co';
const supabaseAnonKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2a211amVsc3V5bGR3dXVremlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg3MzI5MzEsImV4cCI6MjAzNDMwODkzMX0.eaLh_wnpd3C1RrCJQiHysBe6kv8eYAHrxq4Bz-u7QWw';
// Replace with your actual key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ProfileComponent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users') // Replace 'users' with your table name
          .select('*');
        
        if (error) {
          throw error;
        }
        
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('user');
      localStorage.removeItem('loginTime');
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Handle logout error if needed
    }
  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <div>
      <h2>User Accounts List</h2>
      <button onClick={handleLogout} style={{ position: 'absolute', right: '10px', top: '10px' }}>Logout</button>
      <button onClick={() => navigate('/dashboard')}>Go Back to Home</button>
      {error && <p>Error: {error}</p>}
      {users.length > 0 ? (
        <table style={{ borderCollapse: 'collapse', width: '90%', margin: '40px', border: '1px solid black' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>Email</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>User ID</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{user.email}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{user.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default ProfileComponent;
