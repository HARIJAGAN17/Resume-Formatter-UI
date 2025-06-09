import React from "react";
import "./resumeAnalyze.css";

export default function ResumeAnalyze({ analysisResults }) {
  const resumesPerPage = 4;
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedResumes, setSelectedResumes] = React.useState([]);

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

  return (
    <div className="resume-analyze-container">
      <h2 className="ra-analyze-header">
        <i className="fa-solid fa-magnifying-glass-chart"></i> Analyze Resumes
      </h2>
      <p className="ra-analyze-subtext">Review analyzed resumes</p>
      <div className="ra-divider" />

      <div className="ra-topbar">
        <div className="ra-left-topbar">
          <input
            type="checkbox"
            checked={currentResumes.every((r) => selectedResumes.includes(r))}
            onChange={handleSelectAll}
          />
          <p>Select All</p>
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
          <div
            className="ra-resume-card"
            key={idx}
            onClick={() => console.log("fileId:", resume.fileId)}
          >
            <div className="ra-resume-left">
              <input
                type="checkbox"
                checked={isResumeSelected(resume)}
                onChange={(e) => {
                  e.stopPropagation();
                  handleCheckboxChange(resume);
                }}
              />
              <div className="ra-resume-icon">📄</div>

              <div className="ra-resume-info">
                <div className="ra-resume-name">
                  {resume.name}{" "}
                  <i
                    className={`fa-solid ${
                      resume.status === "approved"
                        ? "fa-circle-check ra-icon-approved"
                        : "fa-circle-xmark ra-icon-rejected"
                    }`}
                  />
                </div>

                <div className="ra-resume-meta">
                  <span className="ra-meta-item">
                    <i className="fa-solid fa-calendar-days"></i>
                    {new Date(resume.last_analyzed_timestamp).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </span>
                  <span className="ra-meta-item">
                    <i className="fa-solid fa-chart-column"></i>
                    {parseFloat(resume.score).toFixed(0)}/100
                  </span>
                </div>
              </div>
            </div>

            <div className="ra-resume-right">
              <span
                className={`ra-status-pill ${
                  resume.status === "approved"
                    ? "ra-pill-approved"
                    : "ra-pill-rejected"
                }`}
              >
                {resume.status === "approved" ? "Passed" : "Failed"}
              </span>
              <div className="ra-analyze-score">{resume.score}</div>
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
