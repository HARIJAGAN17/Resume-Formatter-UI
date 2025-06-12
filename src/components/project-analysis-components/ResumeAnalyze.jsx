import React from "react";
import "./resumeAnalyze.css";
import { toast } from "react-toastify";
import api from "../../Api/api";
import InsightsModal from "./InsightsModal";

export default function ResumeAnalyze({
  analysisResults,
  setAnalysisResults,
  handlePreviewClick,
}) {
  const resumesPerPage = 4;
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedResumes, setSelectedResumes] = React.useState([]);
  const [formattedStatus, setFormattedStatus] = React.useState({});
  const [showInsightsModal, setShowInsightsModal] = React.useState(false);
  const [insightsTab, setInsightsTab] = React.useState("Reasoning");
  const [insightsResume, setInsightsResume] = React.useState(null);

  const totalPages = Math.ceil(analysisResults.length / resumesPerPage);

  const handlePreviewClickWithSpinner = async (resume) => {
    try {
      await handlePreviewClick(resume);
    } catch (error) {
      console.error(error);
    }
  };

  const currentResumes = analysisResults.slice(
    (currentPage - 1) * resumesPerPage,
    currentPage * resumesPerPage
  );

  React.useEffect(() => {
    const status = {};
    analysisResults.forEach((r) => {
      status[r.file_id] =
        !!r.formatted_details && Object.keys(r.formatted_details).length > 0;
    });
    setFormattedStatus(status);
  }, [analysisResults]);

  const handleCheckboxChange = (resume) => {
    console.log("Checkbox toggled for resume:", resume);
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

  const updateFormattedDetails = async (file_id, formattedDetails) => {
    try {
      await api.put(`/parsed-history/file/${file_id}`, {
        formatted_details: formattedDetails,
      });
      return true;
    } catch (error) {
      console.error("Error updating formatted details:", error);
      return false;
    }
  };

  const handleConvertSelected = async () => {
    {
      setConversionProgress({
        active: true,
        current: 0,
        total: selectedResumes.length,
        isSingle: selectedResumes.length === 1,
      });

      let successCount = 0;

      for (let i = 0; i < selectedResumes.length; i++) {
        const resume = selectedResumes[i];
        setConversionProgress((prev) => ({
          ...prev,
          current: i + 1,
        }));

        try {
          const fileRes = await api.get(`/get-pdf/${resume.file_id}`);
          const fileData = fileRes.data.file_data;

          if (!fileData || !resume.name || !resume.file_id) {
            toast.error(
              `Missing data for resume "${resume.name || "Unknown"}".`
            );
            continue;
          }

          const byteCharacters = atob(fileData);
          const byteArrays = [];

          for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = Array.from(slice, (char) => char.charCodeAt(0));
            byteArrays.push(new Uint8Array(byteNumbers));
          }

          const blob = new Blob(byteArrays, { type: "application/pdf" });
          const file = new File([blob], resume.name, {
            type: "application/pdf",
          });

          const formData = new FormData();
          formData.append("file", file);

          const response = await api.post("/upload-resume", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          const formattedDetails = response.data;

          const success = await updateFormattedDetails(
            resume.file_id,
            formattedDetails
          );

          if (success) {
            successCount++;
            setFormattedStatus((prev) => ({ ...prev, [resume.file_id]: true }));
            setAnalysisResults((prevResults) =>
              prevResults.map((r) =>
                r.file_id === resume.file_id
                  ? { ...r, formatted_details: formattedDetails }
                  : r
              )
            );
          } else {
            toast.error(
              `Failed to update formatted details for "${resume.name}".`
            );
          }
        } catch (error) {
          console.error("Error processing resume:", error);
          toast.error(`Conversion failed for "${resume.name}".`);
        }
      }

      setSelectedResumes([]);

      if (successCount === 1) {
        toast.success("Resume converted successfully.");
      } else if (successCount > 1) {
        toast.success("All resumes converted successfully.");
      }

      // Immediately hide the conversion progress
      setConversionProgress({
        active: false,
        current: 0,
        total: 0,
        isSingle: false,
      });
    }
  };

  const [conversionProgress, setConversionProgress] = React.useState({
    active: false,
    current: 0,
    total: 0,
    isSingle: false,
  });

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

        <div className="ra-conversion-container">
          {conversionProgress.active && (
            <div className="ra-conversion-spinner">
              <div className="ra-inline-spinner" />

              {conversionProgress.isSingle ? (
                <>
                  <span className="ra-conversion-text">Converting</span>
                  <div className="ra-progress-bar">
                    <div className="ra-progress-bar-fill animated" />
                  </div>
                </>
              ) : (
                <>
                  <span className="ra-conversion-text">
                    Converting {conversionProgress.current}/
                    {conversionProgress.total}
                  </span>
                  <div className="ra-progress-bar">
                    <div
                      className="ra-progress-bar-fill"
                      style={{
                        width: `${
                          (conversionProgress.current /
                            conversionProgress.total) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {selectedResumes.length > 0 && (
            <button
              className="ra-convert-button"
              onClick={handleConvertSelected}
            >
              Convert ({selectedResumes.length})
            </button>
          )}
        </div>
      </div>

      <div className="ra-resume-list">
        {currentResumes.map((resume, idx) => (
          <div
            className="ra-resume-card"
            key={idx}
            onClick={() => console.log("file_id:", resume.file_id)}
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
                    {new Date(
                      resume.last_analyzed_timestamp
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
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
              <div className="ra-analyze-score">
                {parseFloat(resume.score).toFixed(0)}%
              </div>
              <button
                className="ra-analysis-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setInsightsResume(resume);
                  setInsightsTab("Reasoning");
                  setShowInsightsModal(true);
                }}
              >
                Analysis
              </button>

              {formattedStatus[resume.file_id] ? (
                <button
                  className="ra-preview-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviewClickWithSpinner(resume);
                  }}
                >
                  Preview
                </button>
              ) : null}
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

      <InsightsModal
        show={showInsightsModal}
        onClose={() => setShowInsightsModal(false)}
        selectedResume={insightsResume}
        activeTab={insightsTab}
        setActiveTab={setInsightsTab}
      />
    </div>
  );
}
