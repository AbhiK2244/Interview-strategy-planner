import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import Loader from "../components/Loader.jsx";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin, loading } = useAuth();


  const handlesubmit = async (e) => {
    e.preventDefault();

    const success = await handleLogin({ email, password });

    if (success) {
      navigate("/");
    }
  };
  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <div className="min-w-87.5 flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Login</h1>

        <form onSubmit={handlesubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input
              className="border-none outline-none px-4 py-2 rounded-lg bg-[#f5f5f5] text-neutral-800"
              type="email"
              id="email"
              name="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              className="border-none outline-none px-4 py-2 rounded-lg bg-[#f5f5f5] text-neutral-800"
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? <Loader /> : "Login"}
          </button>
        </form>

        <p className="text-xs">
          Don't have an account?{" "}
          <span
            className="text-primary cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </main>
  );
};

export default Login;
