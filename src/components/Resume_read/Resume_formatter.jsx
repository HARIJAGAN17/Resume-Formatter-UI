import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../Api/api";
import { useResume } from "../../hooks/useResume";
import "./ResumeFormatter.css";


function ResumeFormatter() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {setResumeData} = useResume();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleExtract = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsLoading(true);
      const response = await api.post("/upload-resume", formData);
      setResumeData(response.data);
      // console.log(response.data);
      navigate("preview"); // 👈 Relative navigation to /resume/preview
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Profile</h2>
        </div>
        <div className="sidebar-body"></div>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        <button className="burger" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>

        <div className="upload-title">
          <h2>Welcome to</h2>
          <div className="logo-grid">
            <span className="letter">U</span>
            <span className="dot" />
            <span className="letter">S</span>
            <span className="letter">T</span>
          </div>
        </div>

        <div className="upload-wrapper">
          <h2 className="page-title">Upload Doc here</h2>

          <div className="upload-border">
            <div className="upload-section">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
              />
              <button onClick={handleExtract}>Extract</button>
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
