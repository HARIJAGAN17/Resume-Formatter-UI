// components/Dashboard.jsx
import React, { useState } from "react";
import CreateProjectDialog from "../Dashboard-components/CreateProjectDialog";
import "./dashboard.css";

const mockProjects = [
  {
    id: "1",
    name: "Senior Frontend Developer",
    description: "Looking for experienced React developers",
    jobTitle: "Senior Frontend Developer",
    resumeCount: 24,
    avgScore: 78,
    status: "active",
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
  {
    id: "4",
    name: "UX Designer",
    description: "Creative UX designer for mobile apps",
    jobTitle: "UX Designer",
    resumeCount: 12,
    avgScore: 72,
    status: "completed",
    createdAt: "2024-01-20",
    threshold: 70,
  },
];

export default function Dashboard() {
  const [projects] = useState(mockProjects);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const totalResumes = projects.reduce((sum, p) => sum + p.resumeCount, 0);
  const avgScore =
    projects.length > 0
      ? Math.round(
          projects.reduce((sum, p) => sum + p.avgScore, 0) / projects.length
        )
      : 0;
  const handleCreateProject = (data) => {
    console.log("Project Created:", data);
    // handle saving project logic here
  };

  return (
    <div className="dashboard">
      {/* Header Section */}
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
            New Project
          </button>

          <CreateProjectDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            onCreateProject={handleCreateProject}
          />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-card-grid">
        <div className="stat-card">
          <h3>Total Projects</h3>
          <p className="stat-value">{projects.length}</p>
          <span className="stat-caption">
            {projects.filter((p) => p.status === "active").length} active
          </span>
        </div>
        <div className="stat-card">
          <h3>Total Resumes</h3>
          <p className="stat-value">{totalResumes}</p>
          <span className="stat-caption">Across all projects</span>
        </div>
        <div className="stat-card">
          <h3>Average Score</h3>
          <p className="stat-value">{avgScore}%</p>
          <span className="stat-caption">Overall compatibility</span>
        </div>
        <div className="stat-card">
          <h3>This Month</h3>
          <p className="stat-value">3</p>
          <span className="stat-caption">New projects created</span>
        </div>
      </div>

      {/* Filter + Recent Projects Header */}
      <div className="projects-header">
        <h2>Recent Projects</h2>
        <div className="filters">
          <button className="filter active">All</button>
          <button className="filter">Active</button>
          <button className="filter">Completed</button>
        </div>
      </div>

      {/* Projects List */}
      <div className="projects-grid">
        {projects.map((p) => (
          <div className="project-card" key={p.id}>
            <div className="project-header">
              <div>
                <h3 className="project-title">{p.name}</h3>
                <p className="project-description">{p.description}</p>
              </div>
            </div>

            <div className="job-title-row">
              <span>Job Title:</span>
              <strong>{p.jobTitle}</strong>
            </div>

            <div className="project-meta">
              <span>
                <i className="fas fa-user"></i> {p.resumeCount} Resumes
              </span>
              <span>
                <i class="fa-solid fa-arrow-trend-up"></i> {p.avgScore}% avg
              </span>
            </div>

            <div className="score-bar-wrapper">
              <div className="score-bar-label">
                <span>Score vs Threshold</span>
                <span>
                  {p.avgScore}% / {p.threshold}%
                </span>
              </div>
              <div className="score-bar">
                <div
                  className="score-bar-fill"
                  style={{ width: `${(p.avgScore / p.threshold) * 100}%` }}
                />
              </div>
            </div>

            <div className="project-date">Created: {p.createdAt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
