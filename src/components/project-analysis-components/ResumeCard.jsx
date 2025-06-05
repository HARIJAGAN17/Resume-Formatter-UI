// ResumeCard.jsx
import React from "react";

export default function ResumeCard({
  resume,
  idx,
  setAnalysisResults,
  postResumeToBackend,
  setSelectedResume,
  setActiveTab,
  setPreviewModalOpen,
  handlePreviewClick,
}) {
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
            setActiveTab("Reasoning");
            setPreviewModalOpen(true);
            handlePreviewClick(resume);
          }}
        >
          <i className="fa-solid fa-eye"></i> Preview
        </button>
      </div>
    </div>
  );
}
