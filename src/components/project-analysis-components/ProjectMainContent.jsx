import React from "react";
import ResumeCard from "./ResumeCard";

export default function ProjectMainContent({
  project,
  totalResumes,
  approvedCount,
  rejectedCount,
  uploadedFiles,
  processingIndex,
  handleFileChange,
  getFileIconClass,
  handleExtract,
  setUploadedFiles,
  analysisResults,
  setAnalysisResults,
  postResumeToBackend,
  setSelectedResume,
  setActiveTab,
  setPreviewModalOpen,
  handlePreviewClick,
}) {
  return (
    <div className="main-content">
      {/* Project header */}
      <h1 className="page-title">
        <i className="fa-solid fa-file"></i> {project.name}
      </h1>
      <div className="proejct_description">
        <h4>{project.project_description}</h4>
      </div>
      <div className="underline" />

      {/* Stats cards */}
      <div className="stat-card-grid">
        <div className="stat-card">
          <div className="stat-card-title-row">
            <h3>Total Resumes</h3>
            <i className="fa-solid fa-user-plus"></i>
          </div>
          <p className="stat-value">{totalResumes}</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-title-row">
            <h3>Approved</h3>
            <i className="fa-solid fa-thumbs-up"></i>
          </div>
          <p className="stat-value">{approvedCount}</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-title-row">
            <h3>Rejected</h3>
            <i className="fa-solid fa-thumbs-down"></i>
          </div>
          <p className="stat-value">{rejectedCount}</p>
        </div>
      </div>

      {/* Upload section */}
      <h2 className="upload-header">Resume Management</h2>
      <div className="uploading-section-container">
        <div
          className="upload-box"
          onClick={() => document.getElementById("resume-upload").click()}
        >
          <input
            type="file"
            id="resume-upload"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
          />
          <i className="fa-solid fa-cloud-arrow-up fa-2x upload-icon"></i>
          <p className="upload-title">
            Drag & drop resume files here, or click to select
          </p>
          <p className="upload-subtitle">Supports PDF, DOC, and DOCX files</p>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="uploaded-files-list">
            <h4 className="selected-title">Selected Files</h4>
            {uploadedFiles.map((file, idx) => (
              <div className="uploaded-file-row" key={idx}>
                <div className="file-info">
                  <i
                    className={`fa-solid ${getFileIconClass(
                      file.name
                    )} file-icon`}
                  />
                  <span className="file-name">{file.name}</span>
                </div>
                <div className="file-actions">
                  <div className="analyze-wrapper">
                    <button
                      className="analyze-button"
                      disabled={processingIndex === idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExtract(file, idx);
                      }}
                    >
                      Analyze
                      {processingIndex === idx && (
                        <span className="spinner-inline ml-8"></span>
                      )}
                    </button>
                    {processingIndex === idx && (
                      <div className="progress-bar-container below-button">
                        <div className="progress-bar-fill animate"></div>
                      </div>
                    )}
                  </div>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Render the resume cards using ResumeCard component */}
      <div className="resume-list">
        {analysisResults.map((resume, idx) => (
          <ResumeCard
            key={idx}
            resume={resume}
            idx={idx}
            setAnalysisResults={setAnalysisResults}
            postResumeToBackend={postResumeToBackend}
            setSelectedResume={setSelectedResume}
            setActiveTab={setActiveTab}
            setPreviewModalOpen={setPreviewModalOpen}
            handlePreviewClick={handlePreviewClick}
          />
        ))}
      </div>
    </div>
  );
}
