import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import ResumeDocument from "./ResumeDocument";
import { useResume } from "../../hooks/useResume";

const ResumeDownload = () => {
  const { resumeData } = useResume();

  if (!resumeData) {
    return <div>Loading resume...</div>;
  }

  return (
    <div style={{ height: "100vh" }}>
      <PDFViewer width="100%" height="100%" showToolbar={false}>
        <ResumeDocument data={resumeData} />
      </PDFViewer>
    </div>
  );
};

export default ResumeDownload;
