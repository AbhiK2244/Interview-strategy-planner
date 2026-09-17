const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {upload} = require("../middlewares/file.middleware");
const interviewController = require("../controllers/interviewReport.controller");


const interviewRouter = express.Router();


/**
 * @route POST /api/interview/generate
 * @desc Generate an interview report based on the job description, resume pdf, and self-description
 * @body { selfDescription: string, resume: pdf file, jobDescription: string }
 * @access Private
 */
interviewRouter.post("/generate", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController);


/**
 * @route GET /api/interview/report/:interviewId
 * @desc Get an interview report by its ID
 * @access Private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController);


/**
 * @route GET /api/interview/
 * @desc Get all interview reports for the authenticated user
 * @access Private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController);


/**
 * @route POST /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)

module.exports = interviewRouter;
