import { pdf } from "@react-pdf/renderer";
import ResumeDocument from "../components/ResumePreview/ResumeDocument";
import React from "react";

export const downloadResumeAsPdf = async (resumeData) => {
  if (!resumeData) return;

  try {
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
  } catch (err) {
    console.error("Error generating PDF:", err);
  }
};
