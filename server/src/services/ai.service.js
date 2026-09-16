const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod/v3");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const interviewReportSchema = z.object({
  title: z.string().describe("The title of the job for which interview report is generated"),
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "A score indicating how well the candidate's profile matches the job description, on a scale from 0 to 100",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The technical question can be asked during the interview. Generate realistic technical questions based on the job description and candidate's profile and make sure to cover the most important requirements from the job description.",
          ),
        answer: z
          .string()
          .describe(
            "Give the answer based on how to answer this question, what points to cover, which approach to take etc. Make sure to answer as if you are the candidate and you are answering the question.",
          ),
        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking the question, e.g., to assess problem-solving skills, technical knowledge, etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intension and what to answer them. Make sure to ask atleast 5 important technical questions.",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The behavioral question can be asked during the interview. Generate realistic behavioral questions.",
          ),
        answer: z
          .string()
          .describe(
            "Give the answer based on how to answer this question, what points to cover, which approach to take etc. Make sure to answer as if you are the candidate and you are answering the question.",
          ),
        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking the question, e.g., to assess problem-solving skills, technical knowledge, etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intension and what to answer them. Make sure to ask atleast 5 important behavioral questions based on the job description and candidate's profile.",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z
          .string()
          .describe(
            "The skill that the candidate is lacking or needs improvement in",
          ),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of the skill gap, indicating how critical it is for the role",
          ),
      }),
    )
    .describe(
      "Skill gaps identified in the candidate's profile along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z.number().describe("The day number in the preparation plan"),
        focus: z
          .string()
          .describe(
            "The main focus or topic for that day in pereparation plan. e.g., Data Structures, Algorithms, System Design, etc.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "A list of tasks or activities to be completed on that day. e.g., practice coding problems, read articles, watch tutorials, etc.",
          ),
      }),
    )
    .describe(
      "A detailed preparation plan for the candidate, outlining what to focus on each day and the tasks to complete",
    ),
});

// Convert the Zod schema to JSON Schema
const interviewReportJsonSchema = zodToJsonSchema(
  interviewReportSchema,
  {
    target: "jsonSchema7", // Use JSON Schema Draft 7
  }
);



async function generateInterviewReport({ selfDescription, resume, jobDescription }) {
  const prompt = `
    You are an expert career coach and interviewer. 
    Based on the following job description, candidate resume, and self-description, generate a comprehensive interview report in JSON format.
    The report should include a title, matchScore, technicalQuestions and behavioralQuestions with answers and intentions, identified skill gaps with severity, and a detailed preparation plan.
    Job Description: ${jobDescription}
    Resume: ${resume}
    Self Description: ${selfDescription}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: interviewReportJsonSchema,
      },
    });
    const parsedResponse = JSON.parse(response.text);
    return parsedResponse;

  } catch (error) {
    console.error(
      "Error generating interview report:",
      error.ApiError ? error.ApiError.message : error.message,
    );
    throw error;
  }
}

module.exports = generateInterviewReport;