import {
  generateInterviewReport,
  generateResumePdf,
  getAllInterviewReports,
  getInterviewReportById,
} from "../services/resumeReport.api";
import { useContext, useEffect } from "react";
import { toast } from "react-hot-toast";
import { ResumeReportContext } from "../resumeReport.context";
import { useParams } from "react-router";

export const useResumeReport = () => {
  const {
    loading,
    setLoading,
    report,
    setReport,
    reports,
    setReports,
    loadingReports,
    setLoadingReports,
    downloadingResume,
    setDownloadingResume,
  } = useContext(ResumeReportContext);

  const { interviewId } = useParams();

  const generateReport = async (
    jobDescription,
    resumeFile,
    selfDescription,
  ) => {
    setLoading(true);
    try {
      const response = await generateInterviewReport(
        jobDescription,
        resumeFile,
        selfDescription,
      );
      setReport(response.interviewReport);
      toast.success("Report generated successfully!");
      return { data: response.interviewReport, success: true };
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to generate report. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const getAllReports = async () => {
    setLoadingReports(true);
    try {
      const response = await getAllInterviewReports();
      setReports(response.interviewReports);
      return response.interviewReports;
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch reports. Please try again.",
      );
    } finally {
      setLoadingReports(false);
    }
  };

  const getReportById = async (interviewId) => {
    setLoading(true);
    try {
      const response = await getInterviewReportById(interviewId);
      setReport(response.interviewReport);
      return response.interviewReport;
    } catch (error) {
      console.error("Error fetching report by ID:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch report. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const getResumePdf = async (interviewReportId) => {
    setDownloadingResume(true);
    let response = null;
    try {
      response = await generateResumePdf({ interviewReportId });
      const url = window.URL.createObjectURL(
        new Blob([response], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${interviewReportId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error);
    } finally {
      setDownloadingResume(false);
    }
  };

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getAllReports();
    }
  }, [interviewId]);

  return {
    generateReport,
    getAllReports,
    getReportById,
    getResumePdf,
    loading,
    loadingReports,
    downloadingResume,
    report,
    reports,
  };
};
