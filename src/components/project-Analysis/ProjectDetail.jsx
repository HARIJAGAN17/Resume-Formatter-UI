import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import api from "../../Api/api";
import "./projectDetail.css";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        setProject(res.data);
      } catch (error) {
        console.error("Failed to fetch project:", error);
      }
    };
    fetchProject();
  }, [id]);

  if (!project) return <div>Loading...</div>;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`project-sidebar`}>
        <div className="sidebar-header">
          <div className="sidebar-backButton" onClick={()=>{navigate(-1)}}> 
            <i className="fa-solid fa-arrow-left-long"></i>
          </div>
          <div className="user-avatar">
            <i className="fa-solid fa-user"></i>
          </div>
        </div>
        <div className="sidebar-body">{/* Future sidebar content */}</div>
      </div>

      {/* Main Content */}
      <div className="main-content">

        <h1 className="page-title">{project.name}</h1>
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
              <i className="fa-solid fa-thumbs-up"></i>
            </div>
            <p className="stat-value">0</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-title-row">
              <h3>Rejected</h3>
              <i className="fa-solid fa-thumbs-down"></i>
            </div>
            <p className="stat-value">0</p>
          </div>
        </div>

        {/* Upload Section */}
        <h2 className="upload-header">Resume Management</h2>
        <div className="upload-box">
          <input type="file" multiple />
          <p className="upload-title">
            Drag & drop resume files here, or click to select
          </p>
          <p className="upload-subtitle">Supports PDF, DOC, and DOCX files</p>
        </div>
      </div>
    </div>
  );
}
