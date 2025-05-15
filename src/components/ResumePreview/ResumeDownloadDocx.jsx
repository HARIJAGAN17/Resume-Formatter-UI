import React, { useEffect } from "react";
import { useResume } from "../../hooks/useResume";
import { generateResumeDocx } from "../../utility/generateResumeDoc.js";
import { useNavigate } from "react-router-dom";

function ResumeDownloadDocx() {
  const { resumeData } = useResume();
  const navigate = useNavigate();

  useEffect(() => {
    if (resumeData) {
      generateResumeDocx(resumeData).then(() => {
        setTimeout(() => navigate(-1), 1500);
      });
    }
  }, [resumeData, navigate]);

  return (
    <div>
      <div>Preparing your docx download...</div>
      {!resumeData && <p>Loading resume data...</p>}
    </div>
  );
}

export default ResumeDownloadDocx;
