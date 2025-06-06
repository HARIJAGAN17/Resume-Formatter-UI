import React, { useState } from "react";
import "./analysisSection.css";

export default function AnalysisSection({ scoreData, analysisResults }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalResumes = analysisResults.length;

  if (totalResumes === 0) {
    return (
      <div className="main-content">
        <h1 className="page-title">
          <i className="fa-solid fa-chart-line"></i> Analysis Results
        </h1>
        <p>No resumes found for analysis.</p>
      </div>
    );
  }

  const currentResume = analysisResults[currentIndex];
  const { externalLinks = [], contact = {} } =
    currentResume.formatted_details || {};

  const linkRegex = /^https?:\/\/[\w.-]+\.[a-z]{2,}/i;
  let validLinks = 0,
    brokenLinks = 0;
  externalLinks.forEach((link) => {
    if (linkRegex.test(link)) validLinks++;
    else brokenLinks++;
  });

  const sanitizedPhone = (contact.phone || "").replace(/\s+/g, "");

  const hasGoodContact =
    typeof contact.email === "string" &&
    contact.email.includes("@") &&
    /^\+?\d{10,15}$/.test(sanitizedPhone);

  const issuesData = [
    { issue: "Broken external links", count: brokenLinks },
    { issue: "Valid external links", count: validLinks },
    {
      issue: hasGoodContact ? "Good Contact Info" : "Missing/Invalid Contact",
      count: 1,
    },
  ];

  return (
    <div className="main-content">
      {/* Header */}
      <h1 className="page-title">
        <i className="fa-solid fa-chart-line"></i> Analysis Results
      </h1>
      <div className="analysis-description">
        <h4>Detailed analysis of all resumes in this project</h4>
      </div>
      <div className="underline" />

      {/* Card-like content */}
      <div className="analysis-card analysis-flex-container">
        {/* Left side: Score Distribution */}
        <div className="analysis-score-box">
          <h2 className="analysis-overview-title">Score Distribution</h2>
          <p className="analysis-overview-desc">
            Comprehensive analysis of all submitted resumes
          </p>
          <ul>
            {scoreData.map((item, idx) => (
              <li key={idx} className="analysis-list-item">
                <span className="analysis-label">{item.range}</span>
                <span className="analysis-value">
                  {item.count} resume{item.count > 1 ? "s" : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right side: Common Issues per Resume */}
        <div className="analysis-issues-box">
          <h2 className="analysis-overview-title">Common Issues</h2>
          <h3 className="resume-name">
            Resume: <em>{currentResume.name}</em>
          </h3>
          <ul>
            {issuesData.map((issue, idx) => (
              <li key={idx} className="analysis-list-item">
                <span className="analysis-label">{issue.issue}</span>
                <span className="analysis-value">{issue.count}</span>
              </li>
            ))}
          </ul>

          {/* Navigation */}
          <div className="navigation">
            <button
              aria-label="Previous resume"
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
            >
              Previous
            </button>

            <button
              aria-label="Next resume"
              onClick={() =>
                setCurrentIndex((i) => Math.min(totalResumes - 1, i + 1))
              }
              disabled={currentIndex === totalResumes - 1}
            >
              Next
            </button>
          </div>

          <div className="page-number">
            {currentIndex + 1} / {totalResumes}
          </div>
        </div>
      </div>
    </div>
  );
}
