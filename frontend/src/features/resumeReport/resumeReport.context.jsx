import { createContext,  useState } from "react";

export const ResumeReportContext = createContext();

export const ResumeReportProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [reports, setReports] = useState([]);
    const [loadingReports, setLoadingReports] = useState(false);
    const [downloadingResume, setDownloadingResume] = useState(false);

  return (
    <ResumeReportContext.Provider value={{ loading, setLoading, report, setReport, reports, setReports, loadingReports, setLoadingReports, downloadingResume, setDownloadingResume }}>
      {children}
    </ResumeReportContext.Provider>
  );
};
