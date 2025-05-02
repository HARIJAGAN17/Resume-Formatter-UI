import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";
import api from '../../Api/api';

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    userType: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) errs.username = "Invalid Username";
    if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Invalid Email";
    if (!formData.userType) errs.userType = "Choose the role";
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
      const response = await api.post("/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        user_type: formData.userType,
      });
      console.log(response.data)
      toast.success("Registered successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const msg =
        error.response?.data?.detail || "Registration failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>
            Register{" "}
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
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <i className="bx bxs-user"></i>
            {errors.username && <span>{errors.username}</span>}
          </div>

          <div className="input-box">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <i className="bx bxs-envelope"></i>
            {errors.email && <span>{errors.email}</span>}
          </div>

          <div className="input-box">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <i className="bx bxs-lock-alt"></i>
          </div>

          <div className="role-select-box">
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Choose Role
              </option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <i className="bx bxs-user"></i>
            {errors.userType && <span>{errors.userType}</span>}
          </div>

          <button type="submit" className="btn">
            Register
          </button>

          <div className="register-link">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
