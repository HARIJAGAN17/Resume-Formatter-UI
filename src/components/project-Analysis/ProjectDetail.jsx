import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../Api/api";
import "./projectDetail.css";
import { ResumeContext } from "../../context/ResumeContext";
import { useResume } from "../../hooks/useResume";
import ProjectSidebar from "../project-analysis-components/ProjectSidebar";
import ProjectMainContent from "../project-analysis-components/ProjectMainContent";
import PreviewModal from "../project-analysis-components/PreviewModal";
import AnalysisSection from "../project-analysis-components/AnalysisSection";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const { setTotalResumesPerProject } = useContext(ResumeContext);
  const { setResumeData } = useResume();

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analysisResults, setAnalysisResults] = useState([]);

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [activeTab, setActiveTab] = useState("standard"); // default tab
  const [activeSection, setActiveSection] = useState("resumes"); // maincontent area changes
  const [isBulkUpload, setIsBulkUpload] = useState(false); // bulk upload check


  const totalResumes = analysisResults.length;

  const approvedCount = analysisResults.filter(
    (r) => r.status === "approved"
  ).length;
  const rejectedCount = analysisResults.filter(
    (r) => r.status === "rejected"
  ).length;

  const [status, setStatus] = useState("Active"); // "Active" or "Completed"
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await api.get(`/projects/${id}`);
        setStatus(response.data.status || "Active");
      } catch (error) {
        console.error("Failed to fetch project status", error);
      }
    }
    if (id) fetchProject();
  }, [id]);

  const toggleStatus = async () => {
    const newStatus =
      status.toLowerCase() === "active" ? "Completed" : "Active";
    setLoading(true);

    try {
      await api.put(`/projects/${project.id}/status`, { status: newStatus });
      setStatus(newStatus);
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(files);
    setIsBulkUpload(files.length > 1);
  };

  const fetchParsedResumes = async () => {
    try {
      const res = await api.get(`/parsed-history/${id}`);
      const mapped = res.data.map((resume) => ({
        name: resume.resume_name,
        size: `${resume.file_size} KB`,
        score: `${resume.resume_score}%`,
        uploaded: new Date(resume.last_analyzed_timestamp).toLocaleDateString(
          "en-GB"
        ),
        status: resume.approval_status,
        resume_details: resume.resume_details,
        formatted_details: resume.formatted_details,
        summary_analysis: resume.summary_analysis,
        last_analyzed_timestamp: resume.last_analyzed_timestamp,
        raw: resume.resume_details, // to preserve for posting if needed again
      }));
      setAnalysisResults(mapped);
      setTotalResumesPerProject((prev) => ({
        ...prev,
        [id]: mapped.length,
      }));
    } catch (err) {
      console.error("Failed to fetch parsed history:", err);
    }
  };

  const getFileIconClass = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (ext === "pdf") return "fa-file-pdf";
    if (ext === "docx" || ext === "doc") return "fa-file-word";
    return "fa-file"; // fallback icon
  };

  const handlePreviewClick = (resume) => {
    setSelectedResume(resume);
    console.log(resume.formattedDetails);
    setResumeData(resume.formatted_details); // ✅ Set resume data for context
    setPreviewModalOpen(true);
  };

  const handleExtract = async (file) => {
    if (!file || !project?.job_description) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", project.job_description);

    try {
      // Analyze the resume
      const response = await api.post("/analyze-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const result = response.data;
      const score = parseFloat(result.job_score?.replace("%", "") || "0");
      console.log(project.threshold);
      console.log(score);
      const threshold = project.threshold;
      const percentage = (score / threshold) * 100;

      let status = null;
      if (percentage >= 80) {
        status = "approved";
      } else if (percentage < 60) {
        status = "rejected";
      } else {
        status = null;
      }

      console.log("Approval Status:", status);

      // Get formatted details separately
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      const formattedRes = await api.post("/upload-resume", uploadForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const formattedDetails = formattedRes.data;

      const analyzedEntry = {
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        score: result.job_score || "N/A",
        uploaded: new Date().toLocaleDateString("en-GB"),
        status,
        resume_details: result,
        formatted_details: formattedDetails,
        summary_analysis: result.summary || [],
        raw: result,
        last_analyzed_timestamp: new Date().toISOString(),
      };

      setAnalysisResults((prev) => [...prev, analyzedEntry]);

      if (status) {
        await postResumeToBackend(analyzedEntry, status);
      }
    } catch (error) {
      console.error(
        "Error analyzing or uploading resume:",
        error?.response?.data || error.message
      );
    }
  };

  const postResumeToBackend = async (resume, status) => {
    const payload = {
      resume_name: resume.name,
      resume_details: resume.resume_details || {},
      formatted_details: resume.formatted_details || {},
      resume_score: parseFloat(resume.score),
      file_size: parseFloat(resume.size),
      summary_analysis: resume.summary_analysis || [],
      last_analyzed_timestamp: resume.last_analyzed_timestamp,
      approval_status: status,
      project_id: parseInt(id),
      user_id: 1, // Replace with real logged-in user ID if available
    };

    try {
      console.log("Sending payload:", payload);
      await api.post("/parsed-history", payload);
    } catch (err) {
      console.error(
        "Failed to POST parsed resume:",
        err?.response?.data || err
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes] = await Promise.all([api.get(`/projects/${id}`)]);
        setProject(projectRes.data);
        await fetchParsedResumes(); // Fetch previously analyzed resumes
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [id]);

  if (!project) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <ProjectSidebar
        status={status}
        toggleStatus={toggleStatus}
        loading={loading}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {activeSection === "resumes" && (
        <ProjectMainContent
          project={project}
          totalResumes={totalResumes}
          approvedCount={approvedCount}
          rejectedCount={rejectedCount}
          uploadedFiles={uploadedFiles}
          handleFileChange={handleFileChange}
          getFileIconClass={getFileIconClass}
          handleExtract={handleExtract}
          setUploadedFiles={setUploadedFiles}
          analysisResults={analysisResults}
          setAnalysisResults={setAnalysisResults}
          postResumeToBackend={postResumeToBackend}
          setSelectedResume={setSelectedResume}
          setActiveTab={setActiveTab}
          setPreviewModalOpen={setPreviewModalOpen}
          handlePreviewClick={handlePreviewClick}
          isBulkUpload= {isBulkUpload}
          setIsBulkUpload={setIsBulkUpload}
        />
      )}

      {activeSection === "analysis" && (
        <AnalysisSection
          scoreData={[
            { range: "90-100%", count: 1 },
            { range: "80-89%", count: 1 },
            { range: "70-79%", count: 1 },
          ]}
          issuesData={[
            { issue: "Broken LinkedIn links", count: 1 },
            { issue: "Missing skills", count: 2 },
            { issue: "Format inconsistency", count: 1 },
          ]}
        />
      )}

      {activeSection === "job-description" && (
        <div className="project-main-content">
          <h2>Job Description Editor</h2>
        </div>
      )}

      {activeSection === "settings" && (
        <div className="project-main-content">
          <h2>Settings</h2>
          <p>Settings options will go here.</p>
        </div>
      )}

      <PreviewModal
        previewModalOpen={previewModalOpen}
        setPreviewModalOpen={setPreviewModalOpen}
        selectedResume={selectedResume}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
