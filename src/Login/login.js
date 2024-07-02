import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

const supabaseUrl = 'https://zvkmujelsuyldwuukzig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2a211amVsc3V5bGR3dXVremlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg3MzI5MzEsImV4cCI6MjAzNDMwODkzMX0.eaLh_wnpd3C1RrCJQiHysBe6kv8eYAHrxq4Bz-u7QWw';

const supabase = createClient(supabaseUrl, supabaseKey);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const loginTime = localStorage.getItem('loginTime');
    const currentTime = Date.now();
    const tenMinutes = 10 * 60 * 1000;

    if (storedUser && (currentTime - loginTime <= tenMinutes)) {
      navigate('/home');
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      console.log("email")
      console.log(email);
      console.log("password")
      console.log(password);
      if (error) {
        throw new Error('Error logging in: ' + error.message);
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('loginTime', Date.now());

      alert('Login successful.');
      navigate('/home');
    } catch (error) {
      console.error('Unexpected error:', error.message);
      setError('Unexpected error: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>
           E-mail:
          <input
            className="login-input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleLogin} className="login-button">
        Login
      </button>
    </div>
  );
};

export default Login;
