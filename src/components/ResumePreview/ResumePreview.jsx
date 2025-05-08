import { useResume } from "../../hooks/useResume";

function ResumePreview() {
  const { resumeData } = useResume();

  return (
    <div className="main-containter">
      <h2>Resume Preview</h2>
      {resumeData ? (
        <pre>{JSON.stringify(resumeData, null, 2)}</pre>
      ) : (
        <p>No resume data available. Please upload a file.</p>
      )}
    </div>
  );
}

export default ResumePreview;
