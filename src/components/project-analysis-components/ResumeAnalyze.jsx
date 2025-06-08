import React, { useState } from "react";
import "./resumeAnalyze.css";

export default function ResumeAnalyze() {
  const mockResumes = [
    {
      resume_name: "John_Doe_Resume.pdf",
      approval_status: "approved",
      resume_score: 87,
      uploaded_at: "2025-06-06 10:30 AM",
    },
    {
      resume_name: "Jane_Smith_CV.pdf",
      approval_status: "rejected",
      resume_score: 62,
      uploaded_at: "2025-06-06 09:45 AM",
    },
    {
      resume_name: "Alice_Junior_Dev.pdf",
      approval_status: "approved",
      resume_score: 91,
      uploaded_at: "2025-06-05 05:15 PM",
    },
    {
      resume_name: "Bob_Project_Manager.pdf",
      approval_status: "rejected",
      resume_score: 69,
      uploaded_at: "2025-06-04 02:00 PM",
    },
    {
      resume_name: "Charlie_TechLead.pdf",
      approval_status: "approved",
      resume_score: 95,
      uploaded_at: "2025-06-03 11:00 AM",
    },
  ];

  const [analysisResults] = useState(mockResumes);
  const [selectedResumes, setSelectedResumes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [analyzedResumes, setAnalyzedResumes] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(null);

  const resumesPerPage = 4;
  const totalPages = Math.ceil(analysisResults.length / resumesPerPage);
  const currentResumes = analysisResults.slice(
    (currentPage - 1) * resumesPerPage,
    currentPage * resumesPerPage
  );

  const handleCheckboxChange = (resume) => {
    if (selectedResumes.includes(resume)) {
      setSelectedResumes(selectedResumes.filter((r) => r !== resume));
    } else {
      setSelectedResumes([...selectedResumes, resume]);
    }
  };

  const handleSelectAll = () => {
    const allSelected = currentResumes.every((r) =>
      selectedResumes.includes(r)
    );
    if (allSelected) {
      setSelectedResumes(
        selectedResumes.filter((r) => !currentResumes.includes(r))
      );
    } else {
      const updated = [
        ...selectedResumes,
        ...currentResumes.filter((r) => !selectedResumes.includes(r)),
      ];
      setSelectedResumes(updated);
    }
  };

  const isResumeSelected = (resume) => selectedResumes.includes(resume);
  const isAnalyzed = (resume) => analyzedResumes.includes(resume);

  const handleAnalyze = (index, resume) => {
    setLoadingIndex(index);
    setTimeout(() => {
      setLoadingIndex(null);
      setAnalyzedResumes([...analyzedResumes, resume]);
    }, 1000);
  };

  return (
    <div className="resume-analyze-container">
      <h2 className="ra-analyze-header">
        <i className="fa-solid fa-magnifying-glass-chart"></i> Analyze Resumes
      </h2>
      <p className="ra-analyze-subtext">Analyze your resume here</p>
      <div className="ra-divider" />

      <div className="ra-topbar">
        <div className="ra-left-topbar">
          <input
            type="checkbox"
            checked={currentResumes.every((r) => selectedResumes.includes(r))}
            onChange={handleSelectAll}
          />
          <label>Select All</label>
        </div>
        {selectedResumes.length > 0 && (
          <button
            className="ra-convert-button"
            onClick={() => console.log("Selected Resumes:", selectedResumes)}
          >
            Convert ({selectedResumes.length})
          </button>
        )}
      </div>

      <div className="ra-resume-list">
        {currentResumes.map((resume, idx) => (
          <div className="ra-resume-card" key={idx}>
            <div className="ra-resume-left">
              <input
                type="checkbox"
                checked={isResumeSelected(resume)}
                onChange={() => handleCheckboxChange(resume)}
              />
              <div className="ra-resume-icon">📄</div>
              <div className="ra-resume-name">
                {resume.resume_name}
                {resume.approval_status === "approved" ? (
                  <span className="ra-status-icon ra-status-approved">✔</span>
                ) : (
                  <span className="ra-status-icon ra-status-rejected">✖</span>
                )}
              </div>
              <div className="ra-uploaded-time">
                Uploaded: {resume.uploaded_at}
              </div>
            </div>
            <div className="ra-resume-right">
              {!isAnalyzed(resume) ? (
                <button
                  className="ra-analyze-button"
                  onClick={() => handleAnalyze(idx, resume)}
                  disabled={loadingIndex === idx}
                >
                  {loadingIndex === idx ? (
                    <div className="ra-spinner"></div>
                  ) : (
                    "Analyze"
                  )}
                </button>
              ) : (
                <div className="ra-analyze-score">{resume.resume_score}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="ra-pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`ra-page-btn ${currentPage === num ? "active" : ""}`}
            onClick={() => setCurrentPage(num)}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}
