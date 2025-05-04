import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../Api/api';

function ResumeFormatter() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
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
    <div>
      <h2>Resume Landing Page</h2>
      <button onClick={handleLogout}>Logout</button>

      <hr />

      <div>
        <label htmlFor="fileUpload"><strong>Upload Resume:</strong></label>
        <input
          type="file"
          id="fileUpload"
          accept=".pdf,.docx"
          onChange={handleFileChange}
        />
        <button onClick={handleExtract} style={{ marginLeft: '10px' }}>
          Extract
        </button>
      </div>

      {resumeData && (
        <div style={{ marginTop: '20px' }}>
          <h3>Parsed Resume Data:</h3>
          <pre>{JSON.stringify(resumeData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ResumeFormatter;
