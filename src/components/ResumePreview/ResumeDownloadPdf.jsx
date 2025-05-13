import React, { useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import ResumeDocument from "./ResumeDocument";
import { useResume } from "../../hooks/useResume";

const ResumeDownloadPdf = () => {
  const { resumeData } = useResume();

  useEffect(() => {
    const generateAndDownload = async () => {
      if (!resumeData) return;

      const blob = await pdf(<ResumeDocument data={resumeData} />).toBlob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      const safeName = resumeData.name
        ? resumeData.name.replace(/\s+/g, "_")
        : "resume";

      link.href = url;
      link.download = `${safeName}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    generateAndDownload();
  }, [resumeData]);

  return <div>Preparing your PDF download...</div>;
};

export default ResumeDownloadPdf;
