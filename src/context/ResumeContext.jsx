import { createContext, useState } from "react";

export const ResumeContext = createContext();

export function ResumeProvider({ children }) {
  const [resumeData, setResumeData] = useState(null);

  // Add these two fields to track counts:
  const [totalResumesPerProject, setTotalResumesPerProject] = useState({});

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        setResumeData,
        totalResumesPerProject,
        setTotalResumesPerProject,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}
