import React, { useEffect } from "react";
import { useResume } from "../../hooks/useResume";
import {generateResumeDocx} from '../../utility/generateResumeDoc.js';

function ResumeDownloadDocx() {
    const { resumeData } = useResume();
  
    useEffect(() => {
      if (resumeData) {
        generateResumeDocx(resumeData); // Trigger the DOCX generation
      }
    }, [resumeData]);
  
    return (
      <div>
        <h2>Download Resume as DOCX</h2>
        {!resumeData && <p>Loading resume data...</p>}
      </div>
    );
  }
  
  export default ResumeDownloadDocx;
  