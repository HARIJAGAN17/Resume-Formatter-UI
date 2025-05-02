import React, { useState,useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../Api/api';
import './Login.css';
import qs from 'qs';
import { useAuth } from '../../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';
function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();  // Use AuthContext to access user and login

  // Redirect if the user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/resume');  // Redirect if user is logged in
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await api.post('/login', qs.stringify(formData), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);
  
      const decoded = jwtDecode(access_token);
      login(decoded);
  
      toast.success('Login successful!');
      navigate('/resume');
    } catch (error) {
      console.log(error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="login-container">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>
            Login{' '}
            {loading && (
              <div className="spinner-border text-light" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </h1>
          <div className="input-box">
            <input
              type="text"
              name="username"
              value={formData.username}
              placeholder="Username"
              onChange={handleChange}
              required
            />
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <button type="submit" className="btn">
            Login
          </button>
          <div className="register-link">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
