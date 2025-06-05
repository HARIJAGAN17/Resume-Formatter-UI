import { useNavigate } from "react-router-dom";
import "./projectSidebar.css";

export default function ProjectSidebar({ status, toggleStatus, loading }) {
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
          className="nav-btn"
          onClick={() => navigate("/resumes")}
          aria-label="Resumes"
        >
          <i className="fa-solid fa-file-lines"></i>
          <span>Resumes</span>
        </button>
        <button
          className="nav-btn"
          onClick={() => navigate("/analysis")}
          aria-label="Analysis"
        >
          <i className="fa-solid fa-chart-line"></i>
          <span>Analysis</span>
        </button>
        <button
          className="nav-btn"
          onClick={() => navigate("/job-description")}
          aria-label="Job Description"
        >
          <i className="fa-solid fa-briefcase"></i>
          <span>Job Description</span>
        </button>
        <button
          className="nav-btn"
          onClick={() => navigate("/settings")}
          aria-label="Settings"
        >
          <i className="fa-solid fa-gear"></i>
          <span>Settings</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="footer-info"><p>Job Hiring status:</p></div>
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
