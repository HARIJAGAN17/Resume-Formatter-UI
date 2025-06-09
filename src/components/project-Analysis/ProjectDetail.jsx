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
import JobDescription from "../project-analysis-components/JobDescription";
import UploadFilesOnly from "../project-analysis-components/UploadFilesOnly";
import ResumeAnalyze from "../project-analysis-components/ResumeAnalyze";
import { toast } from "react-toastify";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const { setTotalResumesPerProject } = useContext(ResumeContext);
  const { setResumeData } = useResume();
  const [analysisResults, setAnalysisResults] = useState([]);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [activeTab, setActiveTab] = useState("formatted");
  const [activeSection, setActiveSection] = useState("resumes");
  const [status, setStatus] = useState("Active");
  const [loading, setLoading] = useState(false);

  const totalResumes = analysisResults.length;
  const approvedCount = analysisResults.filter(
    (r) => r.status === "approved"
  ).length;
  const rejectedCount = analysisResults.filter(
    (r) => r.status === "rejected"
  ).length;

  const handlePreviewClick = (resume) => {
    if (
      !resume.formatted_details ||
      Object.keys(resume.formatted_details).length === 0
    ) {
      toast.error("Please convert the resume first before previewing.");
      return;
    }

    setSelectedResume(resume);
    setResumeData(resume.formatted_details);
    setPreviewModalOpen(true);
  };

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

  const fetchParsedResumes = async () => {
    try {
      const res = await api.get(`/parsed-history/${id}`);
      const mapped = res.data.map((resume) => ({
        fileId: resume.file_id,
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
        raw: resume.resume_details,
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

  const handleExtract = async (file, fileId) => {
    if (!file || !project?.job_description) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", project.job_description);

    try {
      const response = await api.post("/analyze-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const result = response.data;
      const score = parseFloat(result.job_score?.replace("%", "") || "0");
      const threshold = project.threshold;
      let status = null;
      if (score >= threshold) status = "approved";
      else if (score < threshold) status = "rejected";

      const analyzedEntry = {
        name: file.name,
        file_id: fileId,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        score: result.job_score || "N/A",
        uploaded: new Date().toLocaleDateString("en-GB"),
        status,
        resume_details: result,
        formatted_details: {},
        summary_analysis: result.summary || [],
        raw: result,
        last_analyzed_timestamp: new Date().toISOString(),
      };

      setAnalysisResults((prev) => [...prev, analyzedEntry]);
      await postResumeToBackend(analyzedEntry, status);
    } catch (error) {
      console.error(
        "Error analyzing or uploading resume:",
        error?.response?.data || error.message
      );
    }
  };

  const postResumeToBackend = async (resume, status) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const payload = {
      file_id: resume.file_id,
      resume_name: resume.name,
      resume_details: resume.resume_details || {},
      formatted_details: resume.formatted_details || {},
      resume_score: parseFloat(resume.score),
      file_size: parseFloat(resume.size),
      summary_analysis: resume.summary_analysis || [],
      last_analyzed_timestamp: resume.last_analyzed_timestamp,
      approval_status: status,
      project_id: parseInt(id),
      user_id: user.user_id,
    };

    try {
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
        await fetchParsedResumes();
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [id]);

  if (!project) return <div>Loading...</div>;

  const scoreBuckets = {
    "0-50%": 0,
    "50-80%": 0,
    "80-100%": 0,
  };

  analysisResults.forEach((resume) => {
    const score = parseFloat(resume.score?.replace("%", "") || "0");
    if (score < 50) scoreBuckets["0-50%"]++;
    else if (score < 80) scoreBuckets["50-80%"]++;
    else scoreBuckets["80-100%"]++;
  });

  const scoreData = Object.entries(scoreBuckets).map(([range, count]) => ({
    range,
    count,
  }));

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
        />
      )}

      {activeSection === "analysis" && (
        <AnalysisSection
          scoreData={scoreData}
          analysisResults={analysisResults}
        />
      )}

      {activeSection === "Analyze" && (
        <ResumeAnalyze
          analysisResults={analysisResults}
          setAnalysisResults={setAnalysisResults}
          setSelectedResume={setSelectedResume}
          handlePreviewClick={handlePreviewClick}
          projectId={id}
        />
      )}

      {activeSection === "job-description" && (
        <JobDescription project={project} />
      )}

      {activeSection === "Upload" && (
        <UploadFilesOnly
          projectId={id}
          handleExtract={handleExtract}
        />
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
