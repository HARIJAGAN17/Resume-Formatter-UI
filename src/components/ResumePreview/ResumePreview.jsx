import { useResume } from "../../hooks/useResume";
import "./ResumePreview.css";
import { useNavigate } from "react-router-dom";
import useLogo from "../../assets/ust-logo.jpg";

function ResumePreview() {
  const { resumeData } = useResume();
  const navigate = useNavigate();

  if (!resumeData) {
    return <div className="resume-container">No resume data available.</div>;
  }

  const {
    name = "",
    summary = [],
    education = {},
    technicalExpertise = {},
    certifications = [],
    experience = [],
  } = resumeData;

  return (
    <div className="main-container">
      {/* Action Buttons */}
      <div id="no-print" className="button-bar">
        <button className="action-button" onClick={() => navigate("/resume")}>
          ← Back
        </button>
        <div className="download-buttons">
          <button
            className="action-button"
            onClick={() => navigate("/resume/download")}
          >
            Download as PDF
          </button>
          <button
            className="action-button"
            onClick={() => navigate("/resume/download-docx")}
          >
            Download as DOCX
          </button>
        </div>
      </div>

      {/* Resume Content */}
      <div id="print-area">
        <div className="resume-container">
          {/* Header */}
          <div className="resume-header">
            <div className="resume-logo">
              <img
                src={useLogo}
                alt="Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <h2>{name}</h2>
          </div>

          {/* First Page Content */}
          <div className="resume-top-page">
            <div className="left-section">
              <div className="section">
                <h3>Education:</h3>
                <p>
                  {education.degree || "N/A"} from {education.university || "N/A"}
                </p>
              </div>

              <div className="section">
                <h3>Technical Expertise:</h3>
                {technicalExpertise && Object.keys(technicalExpertise).length > 0 ? (
                  <ul>
                    {Object.entries(technicalExpertise).map(([key, values]) => (
                      <li key={key}>
                        <strong>{key}:</strong>{" "}
                        {Array.isArray(values) ? values.join(", ") : values}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No technical expertise listed.</p>
                )}
              </div>

              <div className="section">
                <h3>Certifications:</h3>
                {certifications.length > 0 ? (
                  <ul>
                    {certifications.map((cert, idx) => (
                      <li key={idx}>{cert}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No certifications listed.</p>
                )}
              </div>
            </div>

            <div className="right-section">
              <div className="section">
                <h3>Profile Summary</h3>
                {summary.length > 0 ? (
                  <ul>
                    {summary.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No summary available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Second Page - Experience */}
          {experience.length > 0 && (
            <div className="second-page-start">
              <h3>Professional Experience</h3>
              {experience.map((job, idx) => (
                <div className="section" key={idx}>
                  <p><strong>• Company:</strong> {job.company || "N/A"}</p>
                  <p><strong>• Date:</strong> {job.date || "N/A"}</p>
                  <p><strong>• Role:</strong> {job.role || "N/A"}</p>
                  {job.clientEngagement && (
                    <p><strong>• Client Engagement:</strong> {job.clientEngagement}</p>
                  )}
                  {job.program && (
                    <p><strong>• Program:</strong> {job.program}</p>
                  )}
                  <p><strong>RESPONSIBILITIES:</strong></p>
                  {job.responsibilities?.length > 0 ? (
                    <ul>
                      {job.responsibilities.map((res, i) => (
                        <li key={i}>{res}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No responsibilities listed.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumePreview;
