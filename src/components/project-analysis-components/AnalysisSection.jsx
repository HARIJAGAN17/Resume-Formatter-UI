import React from "react";
import "./analysisSection.css";

export default function AnalysisSection({ scoreData, issuesData }) {
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
      <div className="analysis-card">
        <h2 className="analysis-overview-title">Analysis Overview</h2>
        <p className="analysis-overview-desc">
          Comprehensive analysis of all submitted resumes
        </p>

        <div className="analysis-main-content">
          <div className="analysis-score-box">
            <h3 className="analysis-section-title">Score Distribution</h3>
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

          <div className="analysis-issues-box">
            <h3 className="analysis-section-title">Common Issues</h3>
            <ul>
              {issuesData.map((issue, idx) => (
                <li key={idx} className="analysis-list-item">
                  <span className="analysis-label">{issue.issue}</span>
                  <span className="analysis-value">{issue.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
