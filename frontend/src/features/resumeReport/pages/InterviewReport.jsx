import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useResumeReport } from "../hooks/useResumeReport.js";
import QuestionCard from "../components/QuestionCard.jsx";
import RoadMapDay from "../components/RoadMapDay.jsx";

// for the left navigation
const NAV_ITEMS = [
  {
    id: "technical",
    label: "Technical Questions",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },

  {
    id: "behavioral",
    label: "Behavioral Questions",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },

  {
    id: "roadmap",
    label: "Road Map",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    ),
  },
];


const InterviewReport = () => {
  const [activeNav, setActiveNav] = useState("technical");

  const { report, getReportById, loading, getResumePdf } = useResumeReport();

  const { interviewId } = useParams();

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  // Loading state
  if (loading || !report) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[#0d1117] px-4 text-[#e6edf3]">
        <h1 className="text-center text-xl font-semibold sm:text-2xl">
          Loading your interview plan...
        </h1>
      </main>
    );
  }

  // Match score color
  const scoreColor =
    report.matchScore >= 80
      ? "border-[#3fb950]"
      : report.matchScore >= 60
        ? "border-[#f5a623]"
        : "border-[#ff4d4d]";

  return (
    <div className="min-h-screen w-full bg-[#0d1117] p-3 text-[#e6edf3] sm:p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col overflow-hidden rounded-2xl border border-[#2a3348] bg-[#161b22] lg:min-h-[calc(100vh-3rem)] lg:flex-row">
        {/* LEFT NAVIGATION */}
        <nav className="flex w-full shrink-0 flex-col justify-between gap-1 border-b border-[#2a3348] p-4 sm:p-5 lg:w-[220px] lg:border-b-0 lg:p-7 lg:px-4">
          <div>
            <p className="mb-2 px-3 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[#7d8590]">
              Sections
            </p>

            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeNav === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveNav(item.id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg border-none px-3 py-2.5 text-left text-sm transition-colors duration-150 ${
                      isActive
                        ? "bg-[#ff2d78]/10 text-[#ff2d78]"
                        : "bg-transparent text-[#7d8590] hover:bg-[#1c2230] hover:text-[#e6edf3]"
                    }`}
                  >
                    <span className="flex shrink-0 items-center">
                      {item.icon}
                    </span>

                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Download Resume */}
          <button
            type="button"
            onClick={() => {
              getResumePdf(interviewId);
            }}
            className="primary-button mt-4 flex w-full items-center justify-center lg:mt-0"
          >
            <svg
              className="mr-2 h-3.5 w-3.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3522 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3522 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z" />
            </svg>

            Download Resume
          </button>
        </nav>

        {/* Divider */}
        <div className="hidden w-px shrink-0 bg-[#2a3348] lg:block" />

        {/* CENTER CONTENT */}

        <main className="min-w-0 flex-1 overflow-y-auto p-5 pb-20 sm:p-6 sm:pb-20 md:p-7 md:pb-20 lg:max-h-[calc(100vh-3rem)]">
          {/* Technical Questions */}
          {activeNav === "technical" && (
            <section className="min-h-full">
              <div className="mb-6 flex flex-wrap items-baseline gap-3 border-b border-[#2a3348] pb-4">
                <h2 className="m-0 text-[1.1rem] font-bold text-[#e6edf3]">
                  Technical Questions
                </h2>

                <span className="rounded-full border border-[#2a3348] bg-[#1c2230] px-2.5 py-0.5 text-xs text-[#7d8590]">
                  {report.technicalQuestions.length} questions
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {report.technicalQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* Behavioral Questions */}
          {activeNav === "behavioral" && (
            <section className="min-h-full">
              <div className="mb-6 flex flex-wrap items-baseline gap-3 border-b border-[#2a3348] pb-4">
                <h2 className="m-0 text-[1.1rem] font-bold text-[#e6edf3]">
                  Behavioral Questions
                </h2>

                <span className="rounded-full border border-[#2a3348] bg-[#1c2230] px-2.5 py-0.5 text-xs text-[#7d8590]">
                  {report.behavioralQuestions.length} questions
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {report.behavioralQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* Roadmap */}
          {activeNav === "roadmap" && (
            <section className="min-h-full">
              <div className="mb-6 flex flex-wrap items-baseline gap-3 border-b border-[#2a3348] pb-4">
                <h2 className="m-0 text-[1.1rem] font-bold text-[#e6edf3]">
                  Preparation Road Map
                </h2>

                <span className="rounded-full border border-[#2a3348] bg-[#1c2230] px-2.5 py-0.5 text-xs text-[#7d8590]">
                  {report.preparationPlan.length}-day plan
                </span>
              </div>

              <div className="relative flex flex-col">
                {/* Timeline */}
                <span className="absolute bottom-0 left-[27px] top-0 w-0.5 rounded-full bg-gradient-to-b from-[#ff2d78] to-[#ff2d78]/10" />

                {report.preparationPlan.map((day) => (
                  <RoadMapDay key={day.day} day={day} />
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Divider */}
        <div className="hidden w-px shrink-0 bg-[#2a3348] lg:block" />

        {/* RIGHT SIDEBAR */}
        <aside className="flex w-full shrink-0 flex-col gap-5 border-t border-[#2a3348] p-5 sm:p-6 lg:w-[240px] lg:border-t-0 lg:p-7 lg:px-5">
          {/* Match Score */}
          <div className="flex flex-col items-center gap-2.5">
            <p className="mb-0.5 self-start text-xs font-semibold uppercase tracking-[0.08em] text-[#7d8590]">
              Match Score
            </p>

            <div
              className={`flex h-[90px] w-[90px] flex-col items-center justify-center rounded-full border-4 ${scoreColor}`}
            >
              <span className="text-[1.6rem] font-extrabold leading-none text-[#e6edf3]">
                {report.matchScore}
              </span>

              <span className="-mt-0.5 text-xs text-[#7d8590]">%</span>
            </div>

            <p className="m-0 text-center text-xs text-[#3fb950]">
              Strong match for this role
            </p>
          </div>

          {/* Sidebar divider */}
          <div className="h-px w-full bg-[#2a3348]" />

          {/* Skill Gaps */}
          <div className="flex flex-col gap-3">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.08em] text-[#7d8590]">
              Skill Gaps
            </p>

            <div className="flex flex-wrap gap-2">
              {report.skillGaps.map((gap, i) => {
                const severityClasses = {
                  high: "border-[#ff4d4d]/25 bg-[#ff4d4d]/10 text-[#ff4d4d]",
                  medium:
                    "border-[#f5a623]/25 bg-[#f5a623]/10 text-[#f5a623]",
                  low: "border-[#3fb950]/25 bg-[#3fb950]/10 text-[#3fb950]",
                };

                return (
                  <span
                    key={i}
                    className={`cursor-default rounded-[0.4rem] border px-2.5 py-1.5 text-[0.775rem] font-medium ${
                      severityClasses[gap.severity] ||
                      "border-[#2a3348] bg-[#1c2230] text-[#7d8590]"
                    }`}
                  >
                    {gap.skill}
                  </span>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default InterviewReport;