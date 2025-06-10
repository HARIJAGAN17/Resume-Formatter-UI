import { generateResumeDocx } from "./generateResumeDoc";
/**
 * Triggers DOCX download for given resume data.
 * @param {Object} resumeData - The resume object
 */
export const downloadResumeAsDocx = async (resumeData) => {
  if (!resumeData) {
    console.error("No resume data provided");
    return;
  }

  try {
    await generateResumeDocx(resumeData);
  } catch (error) {
    console.error("Failed to generate DOCX:", error);
  }
};
