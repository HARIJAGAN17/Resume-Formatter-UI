import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function ResumeFormatter() {
  const navigate = useNavigate();
  const {logout} = useAuth();

  const handleLogout = () => {
    logout() // Remove token and user
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
