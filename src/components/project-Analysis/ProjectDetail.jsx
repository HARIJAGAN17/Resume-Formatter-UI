import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../Api/api";
import "./projectDetail.css";
import { ResumeContext } from "../../context/ResumeContext";
import { useResume } from "../../hooks/useResume";
import ResumeDownload from "../ResumePreview/ResumeDownload";
import ProjectSidebar from "../project-analysis-components/ProjectSidebar";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const { setTotalResumesPerProject } = useContext(ResumeContext);
  const { setResumeData } = useResume();

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processingIndex, setProcessingIndex] = useState(null);
  const [analysisResults, setAnalysisResults] = useState([]);

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [activeTab, setActiveTab] = useState("standard"); // default tab

  const totalResumes = analysisResults.length;

  const approvedCount = analysisResults.filter(
    (r) => r.status === "approved"
  ).length;
  const rejectedCount = analysisResults.filter(
    (r) => r.status === "rejected"
  ).length;

  const [status, setStatus] = useState("Active"); // "Active" or "Completed"
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await api.get(`/projects/${id}`);
        setStatus(response.data.status || "Active");
      } catch (error) {
        console.error("Failed to fetch project status", error);
      }
    }
    if (id) fetchProject();
  }, [id]);

  const toggleStatus = async () => {
    const newStatus =
      status.toLowerCase() === "active" ? "Completed" : "Active";
    setLoading(true);

    try {
      await api.put(`/projects/${project.id}/status`, { status: newStatus });
      setStatus(newStatus);
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setUploadedFiles(filesArray);
  };

  const fetchParsedResumes = async () => {
    try {
      const res = await api.get(`/parsed-history/${id}`);
      const mapped = res.data.map((resume) => ({
        name: resume.resume_name,
        size: `${resume.file_size} KB`,
        score: `${resume.resume_score}%`,
        uploaded: new Date(resume.last_analyzed_timestamp).toLocaleDateString(
          "en-GB"
        ),
        status: resume.approval_status,
        resume_details: resume.resume_details,
        formatted_details: resume.formatted_details,
        summary_analysis: resume.summary_analysis,
        last_analyzed_timestamp: resume.last_analyzed_timestamp,
        raw: resume.resume_details, // to preserve for posting if needed again
      }));
      setAnalysisResults(mapped);
      setTotalResumesPerProject((prev) => ({
        ...prev,
        [id]: mapped.length,
      }));
    } catch (err) {
      console.error("Failed to fetch parsed history:", err);
    }
  };

  const getFileIconClass = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (ext === "pdf") return "fa-file-pdf";
    if (ext === "docx" || ext === "doc") return "fa-file-word";
    return "fa-file"; // fallback icon
  };

  const handlePreviewClick = (resume) => {
    setSelectedResume(resume);
    console.log(resume.formattedDetails);
    setResumeData(resume.formatted_details); // ✅ Set resume data for context
    setPreviewModalOpen(true);
  };

  const handleExtract = async (file, idx) => {
    if (!file || !project?.job_description) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", project.job_description);

    setProcessingIndex(idx);

    try {
      // Analyze the resume
      const response = await api.post("/analyze-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const result = response.data;
      const score = parseFloat(result.job_score?.replace("%", "") || "0");
      console.log(project.threshold);
      console.log(score);
      const threshold = project.threshold;
      const percentage = (score / threshold) * 100;

      let status = null;
      if (percentage >= 80) {
        status = "approved";
      } else if (percentage < 60) {
        status = "rejected";
      } else {
        status = null;
      }

      console.log("Approval Status:", status);

      // Get formatted details separately
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      const formattedRes = await api.post("/upload-resume", uploadForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const formattedDetails = formattedRes.data;

      const analyzedEntry = {
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        score: result.job_score || "N/A",
        uploaded: new Date().toLocaleDateString("en-GB"),
        status,
        resume_details: result,
        formatted_details: formattedDetails,
        summary_analysis: result.summary || [],
        raw: result,
        last_analyzed_timestamp: new Date().toISOString(),
      };

      setAnalysisResults((prev) => [...prev, analyzedEntry]);

      if (status) {
        await postResumeToBackend(analyzedEntry, status);
      }
    } catch (error) {
      console.error(
        "Error analyzing or uploading resume:",
        error?.response?.data || error.message
      );
    } finally {
      setProcessingIndex(null);
    }
  };

  const postResumeToBackend = async (resume, status) => {
    const payload = {
      resume_name: resume.name,
      resume_details: resume.resume_details || {},
      formatted_details: resume.formatted_details || {},
      resume_score: parseFloat(resume.score),
      file_size: parseFloat(resume.size),
      summary_analysis: resume.summary_analysis || [],
      last_analyzed_timestamp: resume.last_analyzed_timestamp,
      approval_status: status,
      project_id: parseInt(id),
      user_id: 1, // Replace with real logged-in user ID if available
    };

    try {
      console.log("Sending payload:", payload);
      await api.post("/parsed-history", payload);
    } catch (err) {
      console.error(
        "Failed to POST parsed resume:",
        err?.response?.data || err
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes] = await Promise.all([api.get(`/projects/${id}`)]);
        setProject(projectRes.data);
        await fetchParsedResumes(); // Fetch previously analyzed resumes
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [id]);

  if (!project) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <ProjectSidebar
        status={status}
        toggleStatus={toggleStatus}
        loading={loading}
      />

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

          {/* File List - Shown BELOW the upload box */}
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

        <div className="resume-list">
          {analysisResults.map((resume, idx) => {
            const isApproved = resume.status === "approved";
            const isRejected = resume.status === "rejected";
            const isPending = resume.status == null;

            return (
              <div className="resume-card" key={idx}>
                <div className="resume-left">
                  <i className="fa-solid fa-file-lines resume-icon"></i>
                  <div className="resume-details">
                    <p className="resume-name">
                      {resume.name}
                      {isApproved && (
                        <i
                          className="fa-solid fa-circle-check"
                          style={{ color: "#28a745", marginLeft: "10px" }}
                        ></i>
                      )}
                      {isRejected && (
                        <i
                          className="fa-solid fa-circle-xmark"
                          style={{ color: "#dc2626", marginLeft: "10px" }}
                        ></i>
                      )}
                    </p>
                    <div className="resume-meta-row">
                      <span>{resume.size}</span>
                      <span>Uploaded {resume.uploaded}</span>
                    </div>
                  </div>
                </div>

                <div className="resume-right">
                  <div className="resume-score">{resume.score}</div>

                  {isPending && (
                    <>
                      <button
                        className="preview-button"
                        onClick={async () => {
                          const updated = { ...resume, status: "approved" };
                          setAnalysisResults((prev) => {
                            const copy = [...prev];
                            copy[idx] = updated;
                            return copy;
                          });
                          await postResumeToBackend(updated, "approved");
                        }}
                      >
                        Approve
                      </button>
                      <button
                        className="preview-button"
                        style={{ backgroundColor: "#ef4444" }}
                        onClick={async () => {
                          const updated = { ...resume, status: "rejected" };
                          setAnalysisResults((prev) => {
                            const copy = [...prev];
                            copy[idx] = updated;
                            return copy;
                          });
                          await postResumeToBackend(updated, "rejected");
                        }}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  <button
                    className="preview-button"
                    onClick={() => {
                      setSelectedResume(resume);
                      setActiveTab("standard");
                      setPreviewModalOpen(true);
                      handlePreviewClick(resume);
                    }}
                  >
                    <i className="fa-solid fa-eye"></i> Preview
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {previewModalOpen && (
        <div className="preview-modal-overlay">
          <div className="preview-modal-box">
            <div className="modal-header">
              <div className="overlay-header-section">
                <div className="name-status-class">
                  <p>{selectedResume.name}</p>
                  <div>
                    {selectedResume.status == "approved" ? (
                      <i
                        className="fa-solid fa-circle-check"
                        style={{ color: "#28a745", marginLeft: "10px" }}
                      ></i>
                    ) : (
                      <i
                        className="fa-solid fa-circle-xmark"
                        style={{ color: "#dc2626", marginLeft: "10px" }}
                      ></i>
                    )}
                  </div>
                </div>

                <div className="score-data-class">
                  <p>Score:{selectedResume.score}</p>
                  <p>.Uploaded {selectedResume.uploaded}</p>
                </div>
              </div>

              <div className="overlay-header-right">
                <p
                  className={
                    selectedResume.status == "approved"
                      ? "approved"
                      : "rejected"
                  }
                >
                  {selectedResume.status}
                </p>
                <div>
                  <button
                    className="close-button"
                    onClick={() => setPreviewModalOpen(false)}
                  >
                    &times;
                  </button>
                </div>
              </div>
            </div>

            <div className="tab-buttons">
              <button
                className={activeTab === "standard" ? "active" : ""}
                onClick={() => setActiveTab("standard")}
              >
                Original
              </button>
              <button
                className={activeTab === "formatted" ? "active" : ""}
                onClick={() => setActiveTab("formatted")}
              >
                Standardized
              </button>
              <button
                className={activeTab === "analysis" ? "active" : ""}
                onClick={() => setActiveTab("analysis")}
              >
                Analysis
              </button>
            </div>

            <div className="tab-content">
              {activeTab === "standard" && (
                <pre>
                  {JSON.stringify(selectedResume?.resume_details, null, 2)}
                </pre>
              )}
              {activeTab === "formatted" && <ResumeDownload />}

              {activeTab === "analysis" && selectedResume?.resume_details && (
                <div className="analysis-section">
                  <h3>Compatibility Score:</h3>
                  <div className="score-list">
                    <div className="score-row">
                      <span>Technical Skills</span>
                      <span>
                        {selectedResume.resume_details.compatibility_score
                          ?.technical_skills || "N/A"}
                      </span>
                    </div>
                    <div className="score-row">
                      <span>Experience Level</span>
                      <span>
                        {selectedResume.resume_details.compatibility_score
                          ?.experience_level || "N/A"}
                      </span>
                    </div>
                    <div className="score-row">
                      <span>Education</span>
                      <span>
                        {selectedResume.resume_details.compatibility_score
                          ?.education || "N/A"}
                      </span>
                    </div>
                    <div className="score-row">
                      <span>Keywords Match</span>
                      <span>
                        {selectedResume.resume_details.compatibility_score
                          ?.keywords_match || "N/A"}
                      </span>
                    </div>
                  </div>

                  <h3>Key Strengths:</h3>
                  <ul className="summary-list">
                    {selectedResume.resume_details.summary?.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
