const pdfParse = require("pdf-parse");
const generateInterviewReport = require("../services/ai.service");
const InterviewReportModel = require("../models/interviewReport.model");


/**
 *@description Controller to handle the generation of interview report based on self-description, resume pdf, and job description.
 *@route POST /api/interview/generate
 *@access Private
 */
async function generateInterviewReportController(req, res) {
  try {
    const resumeFile = req.file;
    const resumeContentExtracted = await (new pdfParse.PDFParse(Uint8Array.from(resumeFile.buffer))).getText();
    const resumeText = resumeContentExtracted.text;
    const { selfDescription, jobDescription } = req.body;

    const interviewReportByAI = await generateInterviewReport({
      selfDescription,
      resume: resumeText,
      jobDescription,
    });

    const interviewReport = await InterviewReportModel.create({
      user: req.user.id,
      jobDescription,
      resume: resumeText,
      selfDescription,
      ...interviewReportByAI,
    });

    return res.status(201).json({ message: "Interview report generated successfully.", interviewReport });
  } catch (error) {
    console.error("Error generating interview report:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}


/**
 * @description Controller to fetch an interview report by its ID.
 * @route GET /api/interview/report/:interviewId
 * @access Private
 */
async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;
    const interviewReport = await InterviewReportModel.findById(interviewId);

    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found." });
    }

    return res.status(200).json({ message: "Interview report fetched successfully.", interviewReport });
  } catch (error) {
    console.error("Error fetching interview report:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}


/**
 * @description Controller to fetch all interview reports for the authenticated user.
 */
async function getAllInterviewReportsController(req, res) {
  try {
    const userId = req.user.id;
    const interviewReports = await InterviewReportModel.find({ user: userId }).sort({ createdAt: -1 }).select("-__v -updatedAt -resume -selfDescription -jobDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"); // Exclude unnecessary fields

    return res.status(200).json({ message: "Interview reports fetched successfully.", interviewReports });
  } catch (error) {
    console.error("Error fetching interview reports:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

module.exports = {generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController};