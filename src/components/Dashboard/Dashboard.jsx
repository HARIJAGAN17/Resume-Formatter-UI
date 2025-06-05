// components/Dashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import CreateProjectDialog from "../Dashboard-components/CreateProjectDialog";
import api from "../../Api/api";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ResumeContext } from "../../context/ResumeContext";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { totalResumesPerProject, setTotalResumesPerProject } =
    useContext(ResumeContext);
  const [OverallResumeCount, setOverallResumeCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  // Normalize project object (API → UI)
  const normalizeProject = (p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    jobTitle: p.job_title,
    resumeCount: p.resume_count,
    avgScore: p.avg_score,
    threshold: p.threshold,
    createdAt: p.created_at,
    status: p.status?.toLowerCase() || "active",
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await api.get("/projects");
        const userProjects = res.data
          .filter((p) => p.user_id === user.user_id) // ✅ filter by user_id
          .map(normalizeProject);
        setProjects(userProjects);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const resResumes = await api.get("/parsed-history");
        const userResumes = resResumes.data.filter(
          (resume) => resume.user_id === user.user_id
        );

        setOverallResumeCount(userResumes.length);

        // Calculate resume count per project for the current user
        const counts = {};
        userResumes.forEach((resume) => {
          const pid = resume.project_id;
          counts[pid] = (counts[pid] || 0) + 1;
        });
        setTotalResumesPerProject(counts);
      } catch (error) {
        console.error("Failed to fetch projects or resumes:", error);
      }
    };

    fetchAllData();
  }, [setTotalResumesPerProject]);

  const handleCreateProject = async (data) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await api.post("/projects", {
        user_id: user.user_id,
        name: data.name,
        project_description: data.description,
        job_description: data.jobDescription,
        job_title: data.jobTitle,
        resume_count: 0,
        avg_score: 0,
        threshold: data.threshold || 0,
      });
      const newProject = normalizeProject(res.data);
      setProjects((prev) => [newProject, ...prev]);
      setShowCreateDialog(false);
    } catch (err) {
      console.error("Failed to create project:", err);
      alert("Error creating project.");
    }
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthProjects = projects.filter((project) => {
    const createdDate = new Date(project.createdAt);
    return (
      createdDate.getMonth() === currentMonth &&
      createdDate.getFullYear() === currentYear
    );
  });

  const filteredProjects =
    filterStatus === "all"
      ? projects
      : projects.filter((p) => p.status === filterStatus);

  return (
    <div className="background-dashboard">
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">HR Resume Analysis Platform</h1>
            <p className="dashboard-subtitle">
              Streamline your hiring process with AI-powered resume analysis
            </p>
          </div>
          <div>
            <div className="Header-buttons">
              <button
                className="primary-button"
                onClick={() => setShowCreateDialog(true)}
              >
                <i className="fa-solid fa-plus"></i> New Project
              </button>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
            <CreateProjectDialog
              open={showCreateDialog}
              onOpenChange={setShowCreateDialog}
              onCreateProject={handleCreateProject}
            />
          </div>
        </div>

        <div className="stat-card-grid">
          <div className="stat-card">
            <div className="stat-card-title-row">
              <h3>Total Projects</h3>
              <i className="fa-solid fa-file"></i>
            </div>
            <p className="stat-value">{projects.length}</p>
            <span className="stat-caption">
              {projects.filter((p) => p.status === "active").length} active
            </span>
          </div>
          <div className="stat-card">
            <div className="stat-card-title-row">
              <h3>Total Resumes</h3>
              <i className="fa-solid fa-user-plus"></i>
            </div>
            <p className="stat-value">{OverallResumeCount}</p>
            <span className="stat-caption">Across all projects</span>
          </div>
          <div className="stat-card">
            <div className="stat-card-title-row">
              <h3>This Month</h3>
              <i className="fa-solid fa-clock"></i>
            </div>
            <p className="stat-value">{thisMonthProjects.length}</p>
            <span className="stat-caption">New projects created</span>
          </div>
        </div>

        <div className="projects-header">
          <h2>Recent Projects</h2>
          <div className="filters">
            {["all", "active", "completed"].map((status) => (
              <button
                key={status}
                className={`filter ${filterStatus === status ? "active" : ""}`}
                onClick={() => setFilterStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="projects-grid">
          {filteredProjects.map((p) => (
            <div
              className="project-card"
              key={p.id}
              onClick={() => navigate(`/resume/project/${p.id}`)} // absolute path
            >
              <div className="project-header">
                <div className="projectTitleContainer">
                  <h3 className="project-title">{p.name}</h3>
                  <span className={`status-badge ${p.status}`}>{p.status}</span>
                </div>
              </div>

              <p className="project-description">{p.description}</p>

              <div className="job-title-row">
                <span>Job Title</span>
                <strong>{p.jobTitle}</strong>
              </div>

              <div className="project-meta">
                <span>
                  <i className="fas fa-user"></i>{" "}
                  {totalResumesPerProject[p.id] || 0} Resumes
                </span>
              </div>

              <div className="score-bar-wrapper">
                <div className="score-bar-label">
                  <span>Threshold value</span>
                  <span>
                    <i className="fa-solid fa-arrow-trend-up"></i>{" "}
                    {p.threshold || 100}%/100
                  </span>
                </div>
                <div className="score-bar">
                  <div
                    className="score-bar-fill"
                    style={{
                      width: `${p.threshold ? (p.threshold / 100) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div className="project-date">Created: {p.createdAt}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
