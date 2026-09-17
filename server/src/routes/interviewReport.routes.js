import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/file.middleware.js";
import {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
} from "../controllers/interviewReport.controller.js";

const interviewController = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
};


const interviewRouter = express.Router();


/**
 * @route POST /api/interview/generate
 * @desc Generate an interview report based on the job description, resume pdf, and self-description
 * @body { selfDescription: string, resume: pdf file, jobDescription: string }
 * @access Private
 */
interviewRouter.post("/generate",authUser, upload.single("resume"), interviewController.generateInterviewReportController);


/**
 * @route GET /api/interview/report/:interviewId
 * @desc Get an interview report by its ID
 * @access Private
 */
interviewRouter.get("/report/:interviewId", authUser, interviewController.getInterviewReportByIdController);


/**
 * @route GET /api/interview/
 * @desc Get all interview reports for the authenticated user
 * @access Private
 */
interviewRouter.get("/", authUser, interviewController.getAllInterviewReportsController);


/**
 * @route POST /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authUser, interviewController.generateResumePdfController)

export default interviewRouter;