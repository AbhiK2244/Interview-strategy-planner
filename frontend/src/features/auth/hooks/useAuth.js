// import { useContext, useEffect } from "react";
// import { AuthContext } from "../auth.context";
// import { login, logout, register, getMe } from "../services/auth.api.js";

// export const useAuth = () => {
//   const { user, setUser, loading, setLoading } = useContext(AuthContext);

//   const handleLogin = async ({ email, password }) => {
//     setLoading(true);
//     try {
//       const data = await login({ email, password });
//       setUser(data?.user);
//       // return data;
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     setLoading(true);
//     try {
//       const data = await logout();
//       setUser(null);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRegister = async ({ username, email, password }) => {
//     setLoading(true);
//     try {
//       const data = await register({ username, email, password });
//       setUser(data?.user);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch user data using the cookie token when the component mounts
//   useEffect(() => {
//     const fetchUserUsingCookieToken = async () => {
//       try {
//         const data = await getMe();
//         console.log("Fetched user data:", data);
//         setUser(data?.user);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching user data:", error?.response|| error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserUsingCookieToken();
//   }, []);

//   return {
//     user,
//     loading,
//     handleLogin,
//     handleLogout,
//     handleRegister,
//   };
// };

import { useContext, useEffect } from "react";
import { toast } from "react-hot-toast";
import { AuthContext } from "../auth.context";
import { login, logout, register, getMe } from "../services/auth.api.js";

export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useContext(AuthContext);

  const handleLogin = async ({ email, password }) => {
    setLoading(true);

    try {
      const data = await login({ email, password });

      setUser(data?.user);
      toast.success("Logged in successfully!");

      return true; // Login successful
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";

      toast.error(message);

      return false; // Login failed
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      await logout();
      setUser(null);
      toast.success("Logged out successfully!");
    } catch (error) {
      const message =
        error.response?.data?.message || "Logout failed. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);

    try {
      const data = await register({
        username,
        email,
        password,
      });

      setUser(data?.user);
      toast.success("Registered successfully!");

      return true;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      toast.error(message);

      return false;
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  const fetchUserUsingCookieToken = async () => {
    try {
      const data = await getMe();

      setUser(data?.user);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to fetch user data.";

      // Optional: Don't show a toast for an expected
      // unauthenticated initial session. Means the user is not logged in, which is normal.
      if (error.response?.status !== 401) {
        toast.error(message);
      }

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  fetchUserUsingCookieToken();
}, []);

  return {
    user,
    loading,
    handleLogin,
    handleLogout,
    handleRegister,
  };
};
