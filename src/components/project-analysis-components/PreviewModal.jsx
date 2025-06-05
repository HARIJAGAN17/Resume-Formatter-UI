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
          {activeTab === "Reasoning" && (
            <div className="reasoning-container p-4 space-y-4">
              {/* Score Reasoning Section */}
              <div>
                <h2 className="text-xl font-semibold mb-2">Score Reasoning:</h2>
                <p className="bg-gray-100 p-3 rounded text-gray-800 shadow">
                  {selectedResume.resume_details.job_score_reasoning}
                </p>
              </div>

              {/* External Links and Contact Issues Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-white p-4 rounded-xl shadow-md border">
                {/* Left Column: External Links */}
                <div>
                  <h3 className="text-lg font-medium mb-2">External Links</h3>
                  {selectedResume?.formatted_details?.externalLinks?.length >
                  0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {selectedResume.formatted_details.externalLinks.map(
                        (link, index) => (
                          <li key={index}>
                            <a
                              href={link}
                              className="text-blue-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {link}
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">
                      No external links provided.
                    </p>
                  )}
                </div>

                {/* Right Column: Contact Issues */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Contact Issues</h3>
                  <ul className="list-disc list-inside space-y-1 text-red-600">
                    {Object.entries(
                      selectedResume.formatted_details.contact
                    ).map(([key, value]) =>
                      !value ? <li key={key}>{key} is missing</li> : null
                    )}
                  </ul>
                </div>
              </div>
            </div>
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
