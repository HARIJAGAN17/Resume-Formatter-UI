import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Api/api";
import "./projectDetail.css";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processingIndex, setProcessingIndex] = useState(null);
  const [analysisResults, setAnalysisResults] = useState([]);

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setUploadedFiles(filesArray);
  };

  const getFileIconClass = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (ext === "pdf") return "fa-file-pdf";
    if (ext === "docx" || ext === "doc") return "fa-file-word";
    return "fa-file"; // fallback icon
  };

  const handleExtract = async (file, idx) => {
    if (!file || !project?.description) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", project.description);

    setProcessingIndex(idx);

    try {
      const response = await api.post("/analyze-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = response.data;

      const newEntry = {
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        score: result.job_score || "N/A",
        uploaded: new Date().toLocaleDateString("en-GB"),
      };

      setAnalysisResults((prev) => [...prev, newEntry]);
    } catch (error) {
      if (error.response) {
        console.error("Error:", error.response.data.detail);
      } else {
        console.error("Request failed:", error.message);
      }
    } finally {
      setProcessingIndex(null);
    }
  };

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
      <div className={`project-sidebar`}>
        <div className="sidebar-header">
          <div className="sidebar-backButton" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left-long"></i>
          </div>
          <div className="user-avatar">
            <i className="fa-solid fa-user"></i>
          </div>
        </div>
        <div className="sidebar-body" />
      </div>

      <div className="main-content">
        <h1 className="page-title">
          <i className="fa-solid fa-file"></i> {project.name}
        </h1>
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

        <h2 className="upload-header">Resume Management</h2>
        <div className="upload-box">
          <input
            type="file"
            id="resume-upload"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
          />

          {uploadedFiles.length === 0 ? (
            <label htmlFor="resume-upload" className="upload-label">
              <i className="fa-solid fa-cloud-arrow-up fa-2x upload-icon"></i>
              <p className="upload-title">
                Drag & drop resume files here, or click to select
              </p>
              <p className="upload-subtitle">
                Supports PDF, DOC, and DOCX files
              </p>
            </label>
          ) : (
            <>
              <div className="uploaded-files-list">
                {uploadedFiles.map((file, idx) => (
                  <div className="uploaded-file-item" key={idx}>
                    <i
                      className={`fa-solid ${getFileIconClass(
                        file.name
                      )} file-icon`}
                    />
                    <span className="file-name">{file.name}</span>

                    <button
                      className="remove-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFiles((prevFiles) =>
                          prevFiles.filter((_, i) => i !== idx)
                        );
                      }}
                    >
                      Remove
                    </button>

                    <button
                      className="extract-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExtract(file, idx);
                      }}
                    >
                      {processingIndex === idx ? "Extracting..." : "Extract"}
                    </button>

                    {processingIndex === idx && (
                      <div className="extract-progress">
                        <div className="spinner"></div>
                        <div className="progress-bar">
                          <div className="progress-bar-fill" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <label htmlFor="resume-upload" className="add-more-label">
                <i className="fa-solid fa-plus"></i> Change file
              </label>
            </>
          )}
        </div>

        <div className="resume-list">
          {analysisResults.map((resume, idx) => (
            <div className="resume-card" key={idx}>
              <div className="resume-left">
                <i className="fa-solid fa-file-lines resume-icon"></i>
                <div className="resume-details">
                  <p className="resume-name">{resume.name}</p>
                  <div className="resume-meta-row">
                    <span>{resume.size}</span>
                    <span>Uploaded {resume.uploaded}</span>
                  </div>
                </div>
              </div>
              <div className="resume-right">
                <div className="resume-score">{resume.score}</div>
                <button className="preview-button">Preview</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
