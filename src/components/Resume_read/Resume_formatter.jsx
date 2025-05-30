import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../Api/api";
import { useResume } from "../../hooks/useResume";
import { User } from "lucide-react";
import { toast } from "react-toastify";
import "./ResumeFormatter.css";

function ResumeFormatter() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { setResumeData } = useResume();

  const [selectedFile, setSelectedFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadIntervalRef = useRef(null);
  const abortControllerRef = useRef(null);
  const cancelledRef = useRef(false);
  const fileInputRef = useRef(null);

  const capitalize = (name) =>
    name ? name.charAt(0).toUpperCase() + name.slice(1) : "";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleCancel = () => {
    cancelledRef.current = true;
    if (abortControllerRef.current) abortControllerRef.current.abort();
    clearInterval(uploadIntervalRef.current);
    setIsLoading(false);
    setUploadProgress(0);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleExtract = async () => {
    if (!selectedFile) {
      toast.warning("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsLoading(true);
      setUploadProgress(0);
      cancelledRef.current = false;

      let progress = 0;
      uploadIntervalRef.current = setInterval(() => {
        progress += 1;
        setUploadProgress(progress);
        if (progress >= 98) clearInterval(uploadIntervalRef.current);
      }, 220);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response = await api.post("/upload-resume", formData, {
        signal: controller.signal,
      });

      clearInterval(uploadIntervalRef.current);
      setUploadProgress(100);

      setTimeout(() => {
        setResumeData(response.data);
        navigate("preview");
      }, 500);
    } catch (error) {
      clearInterval(uploadIntervalRef.current);

      if (error.name === "CanceledError" || error.name === "AbortError") {
        if (cancelledRef.current) {
          toast.info("Upload cancelled by user.");
        } else {
          toast.warn("Upload cancelled unexpectedly.");
        }
      } else {
        console.error("Error uploading file:", error);
        toast.error("Upload failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearInterval(uploadIntervalRef.current);
  }, []);

  return (
    <div className="app-container">
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className={`user-avatar ${sidebarOpen ? "animate-avatar" : ""}`}>
            <User size={22} color="white" />
          </div>
          <div className="user-name">{capitalize(user?.username)}</div>
        </div>

        <div className="sidebar-body">
          <div className="glow-box-container">
            <div className="animated-border-box-glow"></div>
            <div className="animated-border-box">
              <div className="welcome-message">
                <p>
                  Hi <strong>{capitalize(user?.username) || "there"}</strong>,
                  welcome to the
                </p>
                <p>
                  <strong>AI-powered Resume Converter</strong> ✨
                </p>
                <p>Upload your resume and get structured data instantly!</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="main-content">
        <button className="burger" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>

        <div className="upload-title">
          <div className="logo-grid">
            <span className="letter">U</span>
            <span className="dot" />
            <span className="letter">S</span>
            <span className="letter">T</span>
          </div>
        </div>

        <div className="upload-wrapper">
          <h2 className="page-title">Upload Doc here</h2>

          {isLoading && (
            <div className="progress-bar-wrapper">
              <div
                className="progress-bar"
                style={{ width: `${uploadProgress}%` }}
              />
              <span className="progress-text">{uploadProgress}%</span>
            </div>
          )}

          <div className="upload-border">
            <div className="uploda-container">
              <div className="upload-section">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  ref={fileInputRef}
                />
                <button onClick={handleExtract} disabled={isLoading}>
                  Extract
                </button>
              </div>

              {isLoading && (
                <div className="Cancel-button">
                  <button onClick={handleCancel}>X</button>
                </div>
              )}
            </div>
            <p>Upload a .pdf/.docx file</p>
          </div>

          {isLoading && (
            <div className="loading-spinner">
              <div className="spinner" />
              <span>Uploading and extracting...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumeFormatter;
