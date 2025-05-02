import React from 'react';
import { useNavigate } from 'react-router-dom';

function ResumeFormatter() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token'); // Remove token
    navigate('/login'); // Redirect to login
  };

  return (
    <div>
      <h2>Resume Landing Page</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default ResumeFormatter;
