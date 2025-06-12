// InsightsModal.jsx
import React from "react";
import "./previewModal.css"; // reuse existing styles

export default function InsightsModal({
  show,
  onClose,
  selectedResume,
  activeTab,
  setActiveTab,
}) {
  if (!show) return null;

  const reasoning = selectedResume?.resume_details?.job_score_reasoning || {};
  const scores = selectedResume?.resume_details?.compatibility_score || {};
  const summary = selectedResume?.resume_details?.summary || [];

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
                  />
                ) : (
                  <i
                    className="fa-solid fa-circle-xmark"
                    style={{ color: "#dc2626", marginLeft: "10px" }}
                  />
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
            <button className="close-button" onClick={onClose}>
              &times;
            </button>
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
            className={activeTab === "analysis" ? "active" : ""}
            onClick={() => setActiveTab("analysis")}
          >
            Analysis
          </button>
        </div>

        {activeTab === "Reasoning" && (
          <div className="reasoning-container-outside">
            <div className="reasoning-container">
              {[
                "overall",
                "technical_skills",
                "experience_level",
                "education",
                "keywords_match",
              ].map((section) => (
                <div key={section} className="reasoning-section">
                  <h3>
                    {section
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </h3>
                  <p>{reasoning?.[section] || "No data available"}</p>
                  <p className="improvement">
                    Improvement:{" "}
                    {reasoning?.[`${section}_improvement`] ||
                      "No data available"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="analysis-container-outside">
            <div className="analysis-section">
              <h3>Compatibility Score:</h3>
              <div className="score-list">
                {[
                  "technical_skills",
                  "experience_level",
                  "education",
                  "keywords_match",
                ].map((score) => (
                  <div className="score-row" key={score}>
                    <span>
                      {score
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                    <span>{scores[score] || "N/A"}</span>
                  </div>
                ))}
              </div>

              <h3>Key Strengths:</h3>
              <ul className="summary-list">
                {summary.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
