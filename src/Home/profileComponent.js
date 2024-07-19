import { useEffect, useState } from 'react';

function ProfileComponent() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users from the API endpoint provided by your server
        const response = await fetch('http://localhost:3000/api/users'); // Adjust if using a different port or host
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data);
        console.log("Fetched data:", data); // Correctly log the fetched data
      } catch (err) {
        console.error('Error fetching users:', err.message);
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {error && <p>Error: {error}</p>}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <p>User ID: {user.id}</p>
            <p>Email: {user.email}</p>
            <p>Username: {user.user_metadata?.username || 'No username set'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProfileComponent;
