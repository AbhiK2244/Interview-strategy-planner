const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod/v3");
const { zodToJsonSchema } = require("zod-to-json-schema");
const generatePdfFromHtml = require("./pdfgeneration.service");

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const interviewReportSchema = z.object({
  title: z
    .string()
    .describe("The title of the job for which interview report is generated"),
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
const interviewReportJsonSchema = zodToJsonSchema(interviewReportSchema, {
  target: "jsonSchema7", // Use JSON Schema Draft 7
});

async function generateInterviewReport({
  selfDescription,
  resume,
  jobDescription,
}) {
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

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    html: z
      .string()
      .describe(
        "The HTML content of the resume which can be converted to PDF using any library like puppeteer",
      ),
  });

  // Convert the Zod schema to JSON Schema
  const resumePdfJsonSchema = zodToJsonSchema(resumePdfSchema, {
    target: "jsonSchema7", // Use JSON Schema Draft 7
  });

  const prompt =
    `Generate a professional, ATS-friendly resume for the candidate using the information provided below.

### Candidate Information

  **Existing Resume:**
  ${resume}

  **Self Description:**
  ${selfDescription}

  **Job Description:**
  ${jobDescription}

### Objective

  Create a **job-specific resume** tailored to the given Job Description while remaining completely truthful to the candidate's actual background.

  Analyze the Job Description carefully and identify:

  * Required and preferred technical skills
  * Relevant responsibilities
  * Important keywords and terminology
  * Experience and qualifications the employer is looking for
  * Technologies, tools, frameworks, and concepts relevant to the role

  Then tailor the candidate's resume around the strongest and most relevant evidence from the provided resume and self-description.

### Content Rules

  1. **Do not invent information.**

    * Do not create fake work experience, projects, education, certifications, achievements, responsibilities, metrics, companies, technologies, or qualifications.
    * Only use information explicitly available in the provided candidate information.
    * If a skill appears in the existing resume but is not relevant to the job, it does not need to be emphasized.
    * Do not assume proficiency in a technology simply because it is mentioned in the Job Description.

  2. **Tailor the resume to the Job Description.**

    * Prioritize experience, projects, skills, and achievements that are directly relevant to the target role.
    * Naturally incorporate relevant Job Description keywords when they accurately describe the candidate's existing experience.
    * Do not keyword-stuff or repeat keywords unnaturally.
    * Reorder sections, skills, projects, and bullet points when necessary to improve relevance.

  3. **Keep the content concise.**

    * Target approximately **1 page**, but allow **up to 2 pages** when the candidate has enough relevant information.
    * Remove redundant, generic, outdated, or low-value information.
    * Do not sacrifice important relevant information merely to make the resume shorter.
    * Focus on high-impact and job-relevant content.

  4. **Write naturally.**

    * The resume should read like it was written by an experienced human resume writer.
    * Avoid generic AI-style phrases such as "passionate professional," "results-driven," "dynamic individual," "proven track record," or similar unnecessary buzzwords.
    * Use clear, direct, professional language.
    * Avoid exaggerated claims.
    * Use strong action verbs where appropriate.
    * Vary sentence structure so that bullet points do not sound repetitive or templated.

  5. **Improve the existing content rather than simply copying it.**

    * Rewrite weak or repetitive bullet points.
    * Make descriptions more specific and concise.
    * Emphasize the candidate's actual contribution and relevant technologies.
    * Preserve factual accuracy.
    * Do not change facts simply to make the resume sound stronger.

  6. **Professional Summary**

    * Write a short, targeted professional summary based on the candidate's actual experience.
    * The summary should immediately communicate the candidate's relevant background, technical strengths, and fit for the role.
    * Avoid generic objective statements.

  7. **Skills**

    * Organize skills into clear categories such as Languages, Frontend, Backend, Databases, Tools, etc., when appropriate.
    * Prioritize skills relevant to the Job Description.
    * Do not add skills that are not present in the candidate information.

  8. **Projects and Experience**

    * Prioritize the most relevant projects and experience.
    * Mention the technologies used when they are relevant.
    * Use concise bullet points.
    * Where the source information contains measurable outcomes, preserve them.
    * Never fabricate metrics or impact.

  9. **Education and other sections**

    * Include relevant education, internships, certifications, achievements, and other sections from the candidate information when they add value.
    * Do not create empty sections.
    * Do not include unnecessary personal information.

  ### ATS Requirements

    The resume must be highly ATS-friendly.

    * Use standard section headings such as:
      **Professional Summary, Skills, Experience, Projects, Education, Certifications, Achievements**
    * Use normal text instead of text embedded in images.
    * Avoid tables for the main resume structure.
    * Avoid complex multi-column layouts that may cause ATS parsing problems.
    * Avoid icons or decorative symbols for important information.
    * Keep contact information as selectable text.
    * Use standard, readable fonts.
    * Maintain a logical reading order.
    * Use bullet points for experience and project descriptions.
    * Ensure important keywords remain in normal text.
    * Do not use unnecessary graphics, progress bars, skill ratings, charts, or decorative elements.

  ### HTML and PDF Layout Requirements

    Return a complete, self-contained HTML document suitable for conversion to an A4 PDF using Puppeteer.

    The HTML and CSS MUST follow these rules:

    - The document must be designed specifically for A4 paper.
    - Use:
      @page {
        size: A4;
        margin: 12mm 14mm;
      }

    - Use:
      * {
        box-sizing: border-box;
      }

    - The page content must never exceed the printable width of the A4 page.
    - Set the main resume container to:
      width: 100%;
      max-width: 100%;
    - Do NOT use fixed pixel widths for the main container or sections.
    - Do NOT use CSS that can cause horizontal overflow.
    - Do NOT use "white-space: nowrap" for resume content.
    - All text must be allowed to wrap naturally.
    - Long text such as URLs, email addresses, technology lists, project names,
      company names, dates, and locations must wrap safely when necessary.
    - Use:
      overflow-wrap: anywhere;
      word-break: normal;
      where appropriate.
    - Never hide overflowing resume content using "overflow: hidden".
    - No text may be clipped, cut off, or extend beyond the right or left edge
      when rendered as an A4 PDF.

    For rows containing content on both the left and right sides, such as:
    - company name and employment dates
    - job title and location
    - project name and technology stack

    use a flexible layout that cannot overflow. For example, when using flexbox:
    - use "display: flex"
    - use "justify-content: space-between"
    - use "gap"
    - allow both children to shrink
    - apply "min-width: 0" to flex children
    - allow long content to wrap
    - do not force either side to remain on a single line

    If the combined left and right content cannot fit comfortably on one line,
    allow it to wrap or move the secondary information to the next line rather
    than shrinking, clipping, or overflowing the content.

    Keep the design compact enough for a 1–2 page resume, but NEVER reduce
    readability or clip content just to fit the page count.

    Use print-friendly CSS and verify that:
    1. Every section remains inside the A4 printable area.
    2. No horizontal scrolling or overflow exists.
    3. No text is clipped on either side.
    4. Long skill lists and URLs wrap correctly.
    5. Flexbox/Grid children do not force the document wider than the page.
    6. The layout remains correct when rendered by Puppeteer.
    7. Include all styling inside a <style> tag.

### Quality Check Before Returning

  Before generating the final response, internally verify that:

  * All information is factually supported by the provided candidate information.
  * No skills, experience, achievements, or metrics have been invented.
  * The resume is specifically tailored to the Job Description.
  * Relevant ATS keywords are naturally included.
  * The resume is concise and not unnecessarily repetitive.
  * Grammar, spelling, punctuation, and capitalization are correct.
  * Dates, company names, degree names, technologies, and other factual details are preserved accurately.
  * The HTML is valid and self-contained.
  * The design is professional and suitable for PDF conversion.
  * The final result is stronger and more targeted than the source resume without changing its facts.

### Output Format

  Return **ONLY** a valid JSON object with exactly one field:
    {
      "html": "<complete self-contained HTML document>"
    }

  Do not include Markdown fences, explanations, comments outside the JSON object, or any additional fields.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: resumePdfJsonSchema,
      },
    });
    const parsedResponse = JSON.parse(response.text);
    const pdfBuffer = await generatePdfFromHtml(parsedResponse.html);
    return pdfBuffer;
  } catch (error) {
    console.error(
      "Error generating resume PDF:",
      error.ApiError ? error.ApiError.message : error.message,
    );
    throw error;
  }
}

module.exports = { generateInterviewReport, generateResumePdf };
