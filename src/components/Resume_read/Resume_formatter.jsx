import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../Api/api';
import './ResumeFormatter.css';

function ResumeFormatter() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleExtract = async () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await api.post('/upload-resume', formData);
      console.log('Response:', response.data);
      setResumeData(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="app-container">
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
        </div>
        <div className="sidebar-body">
          {/* Future items here */}
        </div>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="main-content">
        <button className="burger" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>

        <h2>Resume Parser</h2>

        <div className="upload-section">
          <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
          <button onClick={handleExtract}>Extract</button>
        </div>

        {resumeData && (
          <div className="resume-card">
            <h3>Parsed Resume Data</h3>
            <div className="resume-data">
              {Object.entries(resumeData).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong>{" "}
                  <span>
                    {Array.isArray(value)
                      ? value.map((v, i) => <li key={i}>{JSON.stringify(v)}</li>)
                      : typeof value === 'object'
                      ? JSON.stringify(value)
                      : value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeFormatter;
