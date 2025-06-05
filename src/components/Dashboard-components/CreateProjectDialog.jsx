import React, { useEffect } from "react";
import "./createProjectDialog.css";
import api from "../../Api/api";

export default function CreateProjectDialog({
  open,
  onOpenChange,
  onCreateProject,
}) {
  const [loadingJobDesc, setLoadingJobDesc] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    jobTitle: "",
    description: "",
    jobDescription: "",
    threshold: 75,
  });

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("dialog-overlay")) {
      onOpenChange(false);
    }
  };

  const handleJobDescriptionUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoadingJobDesc(true); // show spinner

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/job-description-extraction", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const extractedText = response.data.job_description;
      setFormData((prev) => ({
        ...prev,
        jobDescription: extractedText,
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to read the uploaded file.");
    } finally {
      setLoadingJobDesc(false); // hide spinner
    }
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateProject(formData);
    setFormData({
      name: "",
      jobTitle: "",
      description: "",
      jobDescription: "",
      threshold: 75,
    });
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={handleOutsideClick}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create New Project</h2>
        <p className="dialog-description">
          Set up a new hiring project with job requirements and analysis
          criteria.
        </p>
        <form className="dialog-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData({ ...formData, jobTitle: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Project Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>
              Job Description{" "}
              <span className="upload-span">
                <i className="fa-solid fa-upload"></i>
                <span className="upload-text">Type or Upload</span>
                {loadingJobDesc && <span className="spinner" />}
                <input
                  type="file"
                  accept=".txt,.pdf,.docx"
                  className="hidden-file-input"
                  onChange={handleJobDescriptionUpload}
                />
              </span>
            </label>

            <textarea
              value={formData.jobDescription}
              onChange={(e) =>
                setFormData({ ...formData, jobDescription: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Approval Threshold: {formData.threshold}%</label>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={formData.threshold}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  threshold: parseInt(e.target.value),
                })
              }
            />
            <small>
              Resumes scoring above this threshold will be marked for approval.
            </small>
          </div>

          <div className="dialog-actions">
            <button
              type="button"
              className="btn cancel"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn create">
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
