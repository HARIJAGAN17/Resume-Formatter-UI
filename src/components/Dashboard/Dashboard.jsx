// components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import CreateProjectDialog from "../Dashboard-components/CreateProjectDialog";
import api from "../../Api/api";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

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
        const res = await api.get("/projects");
        setProjects(res.data.map(normalizeProject));
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async (data) => {
    try {
      const res = await api.post("/projects", {
        name: data.name,
        description: data.description,
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

  const totalResumes = projects.reduce((sum, p) => sum + p.resumeCount, 0);

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
            <button
              className="primary-button"
              onClick={() => setShowCreateDialog(true)}
            >
              <i className="fa-solid fa-plus"></i> New Project
            </button>
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
            <p className="stat-value">{totalResumes}</p>
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
              onClick={() => navigate(`/project/${p.id}`)}
            >
              <div className="project-header">
                <div className="projectTitleContainer">
                  <h3 className="project-title">{p.name}</h3>
                  <span className={`status-badge ${p.status}`}>{p.status}</span>
                </div>
              </div>

              <p className="project-description">{p.description}</p>

              <div className="job-title-row">
                <span>Job Title:</span>
                <strong>{p.jobTitle}</strong>
              </div>

              <div className="project-meta">
                <span>
                  <i className="fas fa-user"></i> {p.resumeCount} Resumes
                </span>
                <span>
                  <i className="fa-solid fa-arrow-trend-up"></i> {p.avgScore}%
                  avg
                </span>
              </div>

              <div className="score-bar-wrapper">
                <div className="score-bar-label">
                  <span>Score vs Threshold</span>
                  <span>
                    {p.avgScore}% / {p.threshold || 100}%
                  </span>
                </div>
                <div className="score-bar">
                  <div
                    className="score-bar-fill"
                    style={{
                      width: `${
                        p.threshold ? (p.avgScore / p.threshold) * 100 : 0
                      }%`,
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
