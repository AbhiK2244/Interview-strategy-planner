import React, { useRef, useState } from "react";
import { useResumeReport } from "../hooks/useResumeReport";
import { useNavigate } from "react-router";
import Loader from "../../auth/components/Loader";

const Home = () => {
  const { reports, generateReport, loading, loadingReports } = useResumeReport();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const resumeInputRef = useRef();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");


  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("");
    }
  };

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];
    try {
      const { data, success } = await generateReport(
        jobDescription,
        resumeFile,
        selfDescription,
      );
      if (success) {
        navigate(`/interview-report/${data?._id}`);
      }
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0d1117] px-4 py-8 text-[#e6edf3] sm:px-6 sm:py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8">
        {/* Page Header */}
        <header className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-[#e6edf3] sm:text-3xl md:text-4xl">
            Create Your Custom{" "}
            <span className="text-[#ff2d78]">Interview Plan</span>
          </h1>

          <p className="mx-auto max-w-120 text-sm leading-relaxed text-[#7d8590]">
            Let our AI analyze the job requirements and your unique profile to
            build a winning strategy.
          </p>
        </header>

        {/* Main Card */}
        <div className="w-full overflow-hidden rounded-2xl border border-[#2a3348] bg-[#161b22]">
          {/* Card Body */}
          <div className="flex min-h-130 flex-col md:flex-row">
            {/* Left Panel */}
            <div className="relative flex flex-1 flex-col gap-4 p-5 sm:p-6">
              {/* Panel Header */}
              <div className="mb-1 flex items-center gap-2">
                {/* Icon */}
                <span className="flex items-center text-[#ff2d78]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </span>

                <h2 className="flex-1 text-base font-semibold text-[#e6edf3]">
                  Target Job Description
                </h2>

                {/* Required Badge */}
                <span className="rounded-[0.3rem] border border-[#ff2d78]/30 bg-[#ff2d78]/15 px-2 py-[0.15rem] text-[0.7rem] font-semibold uppercase tracking-[0.03em] text-[#ff2d78]">
                  Required
                </span>
              </div>

              {/* Job Description */}
              <textarea
                className="min-h-87.5 flex-1 resize-none rounded-lg border border-[#2a3348] bg-[#1e2535] px-4 py-3 text-sm leading-relaxed text-[#e6edf3] outline-none transition-colors placeholder:text-[#7d8590] focus:border-[#ff2d78]"
                placeholder={`Paste the full job description here...
e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                maxLength={5000}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />

              {/* Character Counter */}
              <div className="pointer-events-none absolute bottom-9 right-8 text-xs text-[#7d8590]">
                {jobDescription.length} / 5000 chars
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full shrink-0 bg-[#2a3348] md:h-auto md:w-px" />

            {/* Right Panel */}
            <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
              {/* Panel Header */}
              <div className="mb-1 flex items-center gap-2">
                <span className="flex items-center text-[#ff2d78]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>

                <h2 className="flex-1 text-base font-semibold text-[#e6edf3]">
                  Your Profile
                </h2>
              </div>

              {/* Upload Resume */}
              <div className="flex flex-col gap-2">
                <label className="mb-1 flex items-center gap-2 text-sm font-medium text-[#e6edf3]">
                  Upload Resume
                  <span className="rounded-[0.3rem] border border-[#ff2d78]/30 bg-[#ff2d78]/15 px-2 py-[0.15rem] text-[0.7rem] font-semibold uppercase tracking-[0.03em] text-[#ff2d78]">
                    Best Results
                  </span>
                </label>

                <label
                  htmlFor="resume"
                  className="flex cursor-pointer flex-col items-center justify-center gap-[0.35rem] rounded-[0.6rem] border-2 border-dashed border-[#2a3348] bg-[#1e2535] px-4 py-6 transition-colors duration-200 hover:border-[#ff2d78] hover:bg-[#ff2d78]/5"
                >
                  <span className="mb-1 text-[#ff2d78]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="16 16 12 12 8 16" />
                      <line x1="12" y1="12" x2="12" y2="21" />
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    </svg>
                  </span>

                  <p className="m-0 text-sm font-medium text-[#e6edf3]">
                    Click to upload or drag & drop
                  </p>

                  <p className="m-0 text-xs text-[#7d8590]">
                    {!fileName
                      ? `PDF only, max 5MB`
                      : `Uploaded file: ${fileName}`}
                  </p>

                  <input
                    hidden
                    type="file"
                    id="resume"
                    name="resume"
                    accept=".pdf"
                    ref={resumeInputRef}
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-3 text-xs text-[#7d8590]">
                <span className="h-px flex-1 bg-[#2a3348]" />
                <span className="whitespace-nowrap">OR</span>
                <span className="h-px flex-1 bg-[#2a3348]" />
              </div>

              {/* Self Description */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="selfDescription"
                  className="mb-1 text-sm font-medium text-[#e6edf3]"
                >
                  Quick Self-Description
                </label>

                <textarea
                  id="selfDescription"
                  name="selfDescription"
                  className="h-24 w-full resize-none rounded-lg border border-[#2a3348] bg-[#1e2535] px-4 py-3 text-sm leading-relaxed text-[#e6edf3] outline-none transition-colors placeholder:text-[#7d8590] focus:border-[#ff2d78]"
                  placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                />
              </div>

              {/* Info Box */}
              <div className="flex items-start gap-2.5 rounded-lg border border-[#2d4a7a] bg-[#1b2a4a] px-4 py-3">
                <span className="mt-px shrink-0 text-[#4a90e2]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line
                      x1="12"
                      y1="8"
                      x2="12"
                      y2="12"
                      stroke="#1a1f27"
                      strokeWidth="2"
                    />
                    <line
                      x1="12"
                      y1="16"
                      x2="12.01"
                      y2="16"
                      stroke="#1a1f27"
                      strokeWidth="2"
                    />
                  </svg>
                </span>

                <p className="m-0 text-xs leading-relaxed text-[#8ab4f8]">
                  Either a <strong className="text-[#e6edf3]">Resume</strong> or
                  a <strong className="text-[#e6edf3]">Self Description</strong>{" "}
                  is required to generate a personalized plan.
                </p>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="flex flex-col gap-4 border-t border-[#2a3348] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span className="text-xs text-[#7d8590]">
              AI-Powered Strategy Generation • Approx 30s
            </span>

            <button
              type="button"
              onClick={handleGenerateReport}
              disabled={loading || (!fileName && !selfDescription)} // Disable if loading or if neither resume nor self-description is provided
              className="md:w-70 w-full flex items-center justify-center gap-2 rounded-lg bg-linear-to-br from-[#ff2d78] to-[#db0c59] px-6 py-3 text-sm font-semibold text-white cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 mx-auto md:mx-0"
            >
              {loading ? (
                <Loader />
              ) : (
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                  </svg>
                  Generate My Interview Strategy
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Recent Reports - Static UI Only */}
        <section className="flex w-full max-w-5xl flex-col gap-3">
          <h2 className="text-base font-semibold text-[#e6edf3] sm:text-lg">
            My Recent Resume Reports
          </h2>

          {loadingReports ? (
            <Loader />
          ) : reports.length === 0 ? (
            <div className="w-full h-20 flex justify-center items-center text-[#7d8590]">
              No Reports Found
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {/* Example Report 1 */}
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="flex min-w-0 flex-1 basis-70 cursor-pointer flex-col gap-2 rounded-lg border border-[#2a3348] bg-[#161b22] p-4 transition-colors hover:border-[#ff2d78]/50"
                  onClick={() => navigate(`/interview-report/${report._id}`)}
                >
                  <h3 className="text-sm font-semibold text-[#e6edf3]">
                    {report.title || "Untitled Report"}
                  </h3>

                  <p className="text-xs text-[#7d8590]">
                    Generated on {new Date(report.createdAt).toLocaleDateString()}
                  </p>

                  <p className="text-xs font-semibold text-[#ff2d78]">
                    {`Match Score: ${report.matchScore || 0}%`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a
            href="#"
            className="text-xs text-[#7d8590] transition-colors hover:text-[#e6edf3]"
          >
            Privacy Policy
          </a>

          <a
            href="#"
            className="text-xs text-[#7d8590] transition-colors hover:text-[#e6edf3]"
          >
            Terms of Service
          </a>

          <a
            href="#"
            className="text-xs text-[#7d8590] transition-colors hover:text-[#e6edf3]"
          >
            Help Center
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Home;
