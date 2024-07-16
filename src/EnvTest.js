// src/EnvTest.js
import React from 'react';

const EnvTest = () => {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

  return (
    <div>
      <p>Supabase URL: {supabaseUrl}</p>
      <p>Supabase Key: {supabaseKey}</p>
    </div>
  );
};

export default EnvTest;
