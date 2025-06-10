import { useNavigate } from "react-router-dom";
import "./projectSidebar.css";

// projectSidebar.jsx
export default function ProjectSidebar({
  status,
  toggleStatus,
  loading,
  setActiveSection,
  activeSection,
}) {
  const navigate = useNavigate();
  return (
    <div className="project-sidebar">
      <div className="sidebar-header">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          Dashboard {">"}
        </button>
      </div>

      <div className="header-bottom"></div>

      <nav className="sidebar-nav">
        <button
          className={`nav-btn ${activeSection === "resumes" ? "active" : ""}`}
          onClick={() => setActiveSection("resumes")}
          aria-label="Resumes"
        >
          <i className="fa-solid fa-file-lines"></i>
          <span>Overview</span>
        </button>
        <button
          className={`nav-btn ${activeSection === "resumes" ? "active" : ""}`}
          onClick={() => setActiveSection("Upload")}
          aria-label="Resumes"
        >
          <i className="fa-solid fa-file-arrow-up"></i>
          <span>Upload</span>
        </button>
        <button
          className={`nav-btn ${activeSection === "resumes" ? "active" : ""}`}
          onClick={() => setActiveSection("Analyze")}
          aria-label="Resumes"
        >
          <i className="fa-solid fa-magnifying-glass-chart"></i>
          <span>Analyze</span>
        </button>
        <button
          className={`nav-btn ${
            activeSection === "job-description" ? "active" : ""
          }`}
          onClick={() => setActiveSection("job-description")}
          aria-label="Job Description"
        >
          <i className="fa-solid fa-briefcase"></i>
          <span>Job Description</span>
        </button>
        <button
          className={`nav-btn ${activeSection === "settings" ? "active" : ""}`}
          onClick={() => setActiveSection("settings")}
          aria-label="Settings"
        >
          <i className="fa-solid fa-gear"></i>
          <span>Settings</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="footer-info">
          <p>Job Hiring status:</p>
        </div>
        <div className="status-toggle">
          <label className="switch">
            <input
              type="checkbox"
              checked={status === "Completed"}
              onChange={toggleStatus}
              disabled={loading}
            />
            <span className="slider"></span>
          </label>
          <span className={`status-label ${status.toLowerCase()}`}>
            {loading ? "Updating..." : status}
          </span>
        </div>
      </div>
    </div>
  );
}
