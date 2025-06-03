// components/ProjectDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Api/api";
import "./projectDetail.css";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    async function fetchProject() {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    }
    fetchProject();
  }, [id]);

  if (!project) return <p>Loading...</p>;

  return (
    <div className="project-detail-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
      </aside>

      {/* Main Section */}
      <main className="main-content">
        <h1 className="job-title-heading">{project.name}</h1>
        <div className="underline" />

        <div className="stat-card-grid">
          <div className="stat-card">
            <div className="stat-card-title-row">
              <h3>Total Resumes</h3>
              <i className="fa-solid fa-user-plus"></i>
            </div>
            <p className="stat-value">{project.resume_count}</p>
          </div>
          <div className="stat-card">
            <div className="stat-card-title-row">
              <h3>Approved</h3>
              <i className="fa-solid fa-check"></i>
            </div>
            <p className="stat-value">0</p>
          </div>
          <div className="stat-card">
            <div className="stat-card-title-row">
              <h3>Rejected</h3>
              <i className="fa-solid fa-xmark"></i>
            </div>
            <p className="stat-value">0</p>
          </div>
        </div>

        <h2 className="resume-upload-title">Resume Management</h2>
        <div className="upload-box">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            multiple
            hidden
            id="resume-upload"
          />
          <label htmlFor="resume-upload" className="upload-area">
            <i className="lucide lucide-upload h-12 w-12"></i>
            <p className="text-lg mb-2">
              Drag & drop resume files here, or click to select
            </p>
            <p className="text-sm text-muted-foreground">
              Supports PDF, DOC, and DOCX files
            </p>
          </label>
        </div>
      </main>
    </div>
  );
}
