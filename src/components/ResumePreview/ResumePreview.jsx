import { useResume } from "../../hooks/useResume";
import "./ResumePreview.css";

function ResumePreview() {
  const { resumeData } = useResume();

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
    <div className="resume-container">
      {/* Top bar */}
      <div className="resume-header">
        <div className="ust-logo">
          <span className="letter">U</span>
          <span className="dot" />
          <span className="letter">S</span>
          <span className="letter">T</span>
        </div>
        <h1 className="resume-name">{name}</h1>
      </div>

      {/* First Page */}
      <div className="resume-page">
        <div className="left-column">
          <div className="section">
            <h3>Education:</h3>
            <p>
              {education.degree || "N/A"} - {education.university || "N/A"}
            </p>
          </div>

          <div className="section">
            <h3>Technical Expertise:</h3>
            {technicalExpertise && Object.keys(technicalExpertise).length > 0 ? (
              <ul>
                {Object.entries(technicalExpertise).map(([key, values]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {Array.isArray(values) ? values.join(", ") : values}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No technical expertise listed.</p>
            )}
          </div>

          <div className="section">
            <h3>Certifications:</h3>
            {Array.isArray(certifications) && certifications.length > 0 ? (
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

        <div className="right-column">
          <div className="section">
            <h3>Summary</h3>
            {summary && summary.length > 0 ? (
              <ul>
                {(Array.isArray(summary) ? summary : [summary]).map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            ) : (
              <p>No summary available.</p>
            )}
          </div>
        </div>
      </div>

      {/* New Page for Experience Header */}
      <div className="resume-page new-page">
        <div className="section">
          <h3>Professional Experience</h3>
        </div>
      </div>

      {/* Experience Entries */}
      {Array.isArray(experience) && experience.length > 0 ? (
        experience.map((job, idx) => (
          <div className="resume-page" key={idx}>
            <div className="section">
              <h3>Role: {job.role || "Role not specified"}</h3>
              <p className="company">
                <strong>Company:</strong> {job.company || "N/A"}
              </p>
              {job.clientEngagement && (
                <p>
                  <strong>Client:</strong> {job.clientEngagement}
                </p>
              )}
              {job.program && (
                <p>
                  <strong>Program:</strong> {job.program}
                </p>
              )}
              <p>
                <strong>Date:</strong> {job.date || "N/A"}
              </p>
              <ul>
                {Array.isArray(job.responsibilities) &&
                job.responsibilities.length > 0 ? (
                  job.responsibilities.map((item, id) => (
                    <li key={id}>{item}</li>
                  ))
                ) : (
                  <li>No responsibilities listed.</li>
                )}
              </ul>
            </div>
          </div>
        ))
      ) : (
        <div className="resume-page">
          <p>No experience listed.</p>
        </div>
      )}
    </div>
  );
}

export default ResumePreview;
