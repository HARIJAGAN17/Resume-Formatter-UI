// PreviewModal.jsx (shortened)
import React from "react";
import ResumeDownload from "../ResumePreview/ResumeDownload";
import "./previewModal.css";
import { downloadResumeAsDocx } from "../../utility/docxDownload";
import { downloadResumeAsPdf } from "../../utility/pdfDownload";
import { useResume } from "../../hooks/useResume";

export default function PreviewModal({
  previewModalOpen,
  selectedResume,
  setPreviewModalOpen,
}) {
  const { resumeData } = useResume();
  if (!previewModalOpen) return null;

  const handleDocxDownload = async () => {
    await downloadResumeAsDocx(resumeData);
  };

  const handlePdfDownload = async () => {
    await downloadResumeAsPdf(resumeData);
  };

  return (
    <div className="preview-modal-overlay">
      <div className="preview-modal-box">
        <div className="modal-header">
          <div className="overlay-header-section">
            <p>{selectedResume.name} - Standard Format</p>
          </div>
          <div className="overlay-header-right">
            <button
              className="close-button"
              onClick={() => setPreviewModalOpen(false)}
            >
              &times;
            </button>
          </div>
        </div>

        {/* Only Standardized Tab */}
        <div className="formatted-container-outside">
          <div className="download-button-bar">
            <button onClick={handlePdfDownload}>Download as PDF</button>
            <button onClick={handleDocxDownload}>Download as DOCX</button>
          </div>
          <ResumeDownload resumeData={selectedResume} />
        </div>
      </div>
    </div>
  );
}
