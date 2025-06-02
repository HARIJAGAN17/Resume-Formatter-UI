// components/Dashboard.jsx
import React, { useState } from "react";
import CreateProjectDialog from "../Dashboard-components/CreateProjectDialog";
import "./dashboard.css";

const initialProjects = [
  {
    id: "1",
    name: "Senior Frontend Developer",
    description: "Looking for experienced React developers",
    jobTitle: "Senior Frontend Developer",
    resumeCount: 24,
    avgScore: 78,
    status: "completed",
    createdAt: "2024-01-15",
    threshold: 80,
  },
  {
    id: "2",
    name: "Product Manager Q1",
    description: "Product management role for new initiatives",
    jobTitle: "Product Manager",
    resumeCount: 18,
    avgScore: 85,
    status: "completed",
    createdAt: "2024-01-10",
    threshold: 75,
  },
  {
    id: "3",
    name: "UX Designer",
    description: "Creative UX designer for mobile apps",
    jobTitle: "UX Designer",
    resumeCount: 12,
    avgScore: 72,
    status: "active",
    createdAt: "2024-01-20",
    threshold: 70,
  },
];

export default function Dashboard() {
  const [projects, setProjects] = useState(initialProjects);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  //   current month project
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
  const avgScore =
    projects.length > 0
      ? Math.round(
          projects.reduce((sum, p) => sum + p.avgScore, 0) / projects.length
        )
      : 0;

  const handleCreateProject = (data) => {
    const newProject = {
      ...data,
      id: Date.now().toString(), // simple unique ID
      createdAt: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      resumeCount: 0,
      avgScore: 0,
      status: "active",
    };
    setProjects((prev) => [newProject, ...prev]);
    console.log(newProject);
    setShowCreateDialog(false);
  };

  return (
    <div className="background-dashboard">
      <div className="dashboard">
        {/* Header */}
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

        {/* Stats */}
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
              <h3>Average Score</h3>
              <i className="fa-solid fa-arrow-trend-up"></i>
            </div>
            <p className="stat-value">{avgScore}%</p>
            <span className="stat-caption">Overall compatibility</span>
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

        {/* Filter Header */}
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

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((p) => (
            <div className="project-card" key={p.id}>
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
