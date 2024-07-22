import supabase from '../supabaseClient';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileComponent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch the current authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        setUser(user); // Set user state
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <p>Loading user profile...</p>;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };

  return (
    <div>
      <h2> User Task List</h2>
       <button onClick={handleLogout} style={{ position: 'absolute', right: '10px', top: '10px' }}>Logout</button>
      <button onClick={() => navigate('/dashboard')}>Go Back to Home</button>
      {user ? (
        <table style={{ borderCollapse: 'collapse', width: '90%', margin: '40px', border: '1px solid black' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Email</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>User ID</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>{user.email}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{user.id}</td>
          </tr>
        </tbody>
      </table>
      
      ) : (
        <p>No user profile found.</p>
      )}
    </div>
  );
};

export default ProfileComponent;