import React from "react";
import "./jobDescription.css";

export default function JobDescription({ project }) {
  return (
    <div className="main-content">
      {/* Header */}
      <h1 className="page-title">
        <i className="fa-solid fa-chart-line"></i> Job description
      </h1>

      <div className="proejct_description">
        <h4>Detailed Job description of this project</h4>
      </div>
      <div className="underline" />


      {/* Job Description Box */}
      <div className="job-description-box">
        {project?.job_description ? (
          <pre>{project.job_description}</pre>
        ) : (
          <p>No job description available.</p>
        )}
      </div>
    </div>
  );
}
