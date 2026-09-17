import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/interview",
  withCredentials: true,
});


/**
 * @description Generate an interview report
 * @param {string} jobDescription
 * @param {File} resumeFile
 * @param {string} selfDescription
 * @returns {Promise<Object>}
 */
export const generateInterviewReport = async (
  jobDescription,
  resumeFile,
  selfDescription,
) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("resume", resumeFile);

  const response = await api.post("/generate", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


/**
 * @description Get an interview report by ID
 * @param {string} interviewId
 * @returns {Promise<Object>}
 */
export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/report/${interviewId}`);
  return response.data;
};


/**
 * @description Get all interview reports
 * @returns {Promise<Array>}
 */
export const getAllInterviewReports = async () => {
  const response = await api.get("/");
  return response.data;
};


/**
 * @description Generate a resume PDF based on the interview report ID
 * @param {string} interviewReportId
 * @returns {Promise<Blob>}
 */
export const generateResumePdf = async ({interviewReportId}) => {
  const response = await api.post(`/resume/pdf/${interviewReportId}`, null, { // null because no body is needed
    responseType: "blob", // Important for handling binary data
  });
  return response.data;
};