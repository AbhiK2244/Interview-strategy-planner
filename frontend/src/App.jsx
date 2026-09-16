import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { Toaster } from "react-hot-toast";
import { ResumeReportProvider } from "./features/resumeReport/resumeReport.context.jsx";

function App() {

  return (
    <>
      <AuthProvider>
        <ResumeReportProvider>
          <RouterProvider router={router} />
        </ResumeReportProvider>
      </AuthProvider>
      <Toaster position="top-right" />
    </>
  )
}

export default App
