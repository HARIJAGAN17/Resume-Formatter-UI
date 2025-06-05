import React, { useState } from "react";
import ResumeCard from "./ResumeCard";
import { toast } from "react-toastify";
export default function ProjectMainContent({
  project,
  totalResumes,
  approvedCount,
  rejectedCount,
  uploadedFiles,
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
  isBulkUpload,
  setIsBulkUpload,
}) {
  const [analyzeAllProcessing, setAnalyzeAllProcessing] = useState(false);
  const [fileSpinners, setFileSpinners] = useState({}); // spinner per file
  const [analyzedCount, setAnalyzedCount] = useState(0); //no of completed for multiple files

  const handleAnalyzeAll = async () => {
    setAnalyzeAllProcessing(true);
    setAnalyzedCount(0);
    const files = [...uploadedFiles];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setFileSpinners((prev) => ({ ...prev, [file.name]: true }));

      try {
        await handleExtract(file, i);
      } catch (err) {
        console.log(err);
        console.error("Failed to analyze file:", file.name);
      }

      setFileSpinners((prev) => ({ ...prev, [file.name]: false }));
      setUploadedFiles((prev) => prev.filter((f) => f.name !== file.name));
      setAnalyzedCount((prev) => prev + 1); // ✅ Increment progress
    }

    setAnalyzeAllProcessing(false);
    setAnalyzedCount(0); // ✅ Reset after completion

    toast.success("All resumes analyzed successfully!", {
      autoClose: false,
      closeOnClick: true,
    });
  };

  const handleSingleAnalyze = async (file, idx) => {
    setFileSpinners({ [file.name]: true });
    try {
      await handleExtract(file, idx);
    } catch (err) {
      console.log(err);
      console.error("Failed to analyze file:", file.name);
    }
    setFileSpinners({});
    setUploadedFiles([]);

    toast.success("Resume analysis completed!", {
      autoClose: false,
      closeOnClick: true,
    });
  };

  return (
    <div className="main-content">
      <h1 className="page-title">
        <i className="fa-solid fa-file"></i> {project.name}
      </h1>
      <div className="proejct_description">
        <h4>{project.project_description}</h4>
      </div>
      <div className="underline" />

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
                  {fileSpinners[file.name] && (
                    <span className="spinner-inline ml-8"></span>
                  )}
                </div>
              </div>
            ))}

            {!isBulkUpload && uploadedFiles.length === 1 && (
              <div className="file-actions">
                <button
                  className="analyze-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSingleAnalyze(uploadedFiles[0], 0);
                  }}
                  disabled={fileSpinners[uploadedFiles[0].name]}
                >
                  Analyze
                  {fileSpinners[uploadedFiles[0].name] && (
                    <span className="spinner-inline ml-8"></span>
                  )}
                </button>
                <button
                  className="remove-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFiles([]);
                  }}
                >
                  Remove
                </button>
              </div>
            )}

            {isBulkUpload && uploadedFiles.length > 0 && (
              <div className="bulk-actions">
                <button
                  className="analyze-button"
                  onClick={handleAnalyzeAll}
                  disabled={analyzeAllProcessing}
                >
                  Analyze All
                  {analyzeAllProcessing && (
                    <span className="spinner-inline ml-8"></span>
                  )}
                </button>

                <button
                  className="remove-button"
                  onClick={() => {
                    setUploadedFiles([]);
                    setIsBulkUpload(false);
                  }}
                  disabled={analyzeAllProcessing}
                >
                  Remove All
                </button>

                {analyzeAllProcessing && (
                  <div className="analyze-progress-wrapper">
                    <div className="analyze-progress-text">
                      Analyzing resumes: {analyzedCount} /{" "}
                      {uploadedFiles.length + analyzedCount}
                    </div>
                    <div className="analyze-progress-track">
                      <div
                        className="analyze-progress-fill"
                        style={{
                          width: `${
                            (analyzedCount /
                              (uploadedFiles.length + analyzedCount)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

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
