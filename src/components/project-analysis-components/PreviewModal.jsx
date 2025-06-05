import React from "react";
import ResumeDownload from "../ResumePreview/ResumeDownload";

export default function PreviewModal({
  previewModalOpen,
  selectedResume,
  setPreviewModalOpen,
  activeTab,
  setActiveTab,
}) {
  if (!previewModalOpen) return null;

  return (
    <div className="preview-modal-overlay">
      <div className="preview-modal-box">
        <div className="modal-header">
          <div className="overlay-header-section">
            <div className="name-status-class">
              <p>{selectedResume.name}</p>
              <div>
                {selectedResume.status === "approved" ? (
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
              <p>Score: {selectedResume.score}</p>
              <p>.Uploaded {selectedResume.uploaded}</p>
            </div>
          </div>

          <div className="overlay-header-right">
            <p
              className={
                selectedResume.status === "approved" ? "approved" : "rejected"
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
            <pre>{JSON.stringify(selectedResume?.resume_details, null, 2)}</pre>
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
  );
}
