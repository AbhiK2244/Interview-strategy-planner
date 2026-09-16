import {createBrowserRouter, Navigate} from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import PublicRoute from "./features/auth/components/PublicRoute";
import Home from "./features/resumeReport/pages/Home";
import InterviewReport from "./features/resumeReport/pages/InterviewReport";


export const router = createBrowserRouter([
    {
        path: "/login",
        element: <PublicRoute><Login /></PublicRoute>
    },
    {
        path: "/register",
        element: <PublicRoute><Register /></PublicRoute>
    },
    {
        path: "/",
        element: <Protected><Home /></Protected>
    },
    {
        path: "/interview-report/:interviewId",
        element: <Protected><InterviewReport /></Protected>
    }

])