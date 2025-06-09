import React from "react";
import ResumeDownload from "../ResumePreview/ResumeDownload";
import "./previewModal.css";

export default function PreviewModal({
  previewModalOpen,
  selectedResume,
  setPreviewModalOpen,
  activeTab,
  setActiveTab,
}) {
  if (!previewModalOpen) return null;
  console.log(activeTab);

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
              {selectedResume.status === "approved" ? "Passed" : "Failed"}
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
            className={activeTab === "Reasoning" ? "active" : ""}
            onClick={() => setActiveTab("Reasoning")}
          >
            Reasoning
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
          <div className="tab-content">
            {activeTab === "Reasoning" && (
              <div className="reasoning-container">
                <div className="overall-reasoning reasoning-section">
                  <h3>Overall Score Reasoning</h3>
                  <p>
                    {selectedResume?.resume_details?.job_score_reasoning
                      ?.overall || "No data available"}
                  </p>
                  <p className="improvement">
                    Improvement:{" "}
                    {selectedResume?.resume_details?.job_score_reasoning
                      ?.overall_improvement || "No data available"}
                  </p>
                </div>

                <div className="skill-reasoning reasoning-section">
                  <h3>Technical Skills</h3>
                  <p>
                    {selectedResume?.resume_details?.job_score_reasoning
                      ?.technical_skills || "No data available"}
                  </p>
                  <p className="improvement">
                    Improvement:{" "}
                    {selectedResume?.resume_details?.job_score_reasoning
                      ?.technical_skills_improvement || "No data available"}
                  </p>
                </div>

                <div className="skill-reasoning reasoning-section">
                  <h3>Experience Level</h3>
                  <p>
                    {selectedResume?.resume_details?.job_score_reasoning
                      ?.experience_level || "No data available"}
                  </p>
                  <p className="improvement">
                    Improvement:{" "}
                    {selectedResume?.resume_details?.job_score_reasoning
                      ?.experience_level_improvement || "No data available"}
                  </p>
                </div>

                <div className="skill-reasoning reasoning-section">
                  <h3>Education</h3>
                  <p>
                    {selectedResume?.resume_details?.job_score_reasoning
                      ?.education || "No data available"}
                  </p>
                  <p className="improvement">
                    Improvement:{" "}
                    {selectedResume?.resume_details?.job_score_reasoning
                      ?.education_improvement || "No data available"}
                  </p>
                </div>

                <div className="skill-reasoning reasoning-section">
                  <h3>Keywords Match</h3>
                  <p>
                    {selectedResume?.resume_details?.job_score_reasoning
                      ?.keywords_match || "No data available"}
                  </p>
                  <p className="improvement">
                    Improvement:{" "}
                    {selectedResume?.resume_details?.job_score_reasoning
                      ?.keywords_match_improvement || "No data available"}
                  </p>
                </div>
              </div>
            )}
          </div>

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
