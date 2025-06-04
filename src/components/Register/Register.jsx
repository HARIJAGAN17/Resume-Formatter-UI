import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";
import api from "../../Api/api";
import { useAuth } from "../../hooks/useAuth";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/resume");
  }, [user, navigate]);

  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) errs.username = "Invalid Username";
    if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Invalid Email";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      await api.post("/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        user_type: "user",
      });
      toast.success("Registered successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const msg =
        error.response?.data?.detail || "Registration failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <form onSubmit={handleSubmit}>
          <h1 className="register-heading">
            Register
            {loading && <span className="register-spinner" />}
          </h1>

          <div className="register-form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="register-input"
            />
            {errors.username && (
              <span className="error-text">{errors.username}</span>
            )}
          </div>

          <div className="register-form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="register-input"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="register-form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="register-input"
            />
          </div>

          <button type="submit" className="register-button">
            Register
          </button>

          <div className="register-footer">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
