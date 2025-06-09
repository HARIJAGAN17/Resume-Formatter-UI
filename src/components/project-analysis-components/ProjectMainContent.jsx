import React from "react";
import "./projectMainContent.css";

export default function ProjectMainContent({
  project,
  totalResumes,
  approvedCount,
  rejectedCount,
}) {
  return (
    <div className="project-main">
      <h1 className="project-title">
        <i className="fa-solid fa-file"></i> {project.name}
      </h1>

      <div className="project-description">
        <h4>{project.project_description}</h4>
      </div>

      <div className="divider" />

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-header">
            <h3>Total Resumes</h3>
            <i className="fa-solid fa-user-plus"></i>
          </div>
          <p className="stat-value">{totalResumes}</p>
        </div>

        <div className="stat-box">
          <div className="stat-header">
            <h3>Approved</h3>
            <i className="fa-solid fa-thumbs-up"></i>
          </div>
          <p className="stat-value">{approvedCount}</p>
        </div>

        <div className="stat-box">
          <div className="stat-header">
            <h3>Rejected</h3>
            <i className="fa-solid fa-thumbs-down"></i>
          </div>
          <p className="stat-value">{rejectedCount}</p>
        </div>
      </div>
    </div>
  );
}
