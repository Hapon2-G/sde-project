import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axios"; 
import { useAuth } from "../context/AuthContext"; 
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../App.css";

function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState(""); // Changed from email to emailOrUsername
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleLogin = async () => {
    try {
      const response = await axiosClient.post("/login", {
        email_or_username: emailOrUsername, // Send as email_or_username to backend
        password,
      });

      console.log("Login response:", response.data);

      const user = response.data.user || response.data.data?.user;
      const token = response.data.token || response.data.data?.token || response.data.data?.access_token;

      if (user && token) {
        
        login(user, token);

       
        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        console.log("✅ Logged in user:", user);
        navigate("/buyer-dashboard");
      } else {
        setError("Invalid login response: missing user or token.");
        console.error("Invalid login response:", response.data);
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Login failed: Invalid username/email or password.");
    }
  };

   return (
    <div className="flex flex-col w-screen h-screen items-center">
      {/* Header */}
      <div className="flex flex-col w-full h-1/3 font-[Poppins] items-center justify-end">
        <img src="/src/assets/logo.png" alt="Logo" className="max-w-40 max-h-40" />
        <span className="text-center text-[#183B4E] font-bold text-shadow-lg md:text-3xl lg:text-4xl">
          USTP MARKETPLACE FOR STUDENTS
        </span>
      </div>

      {/* Login Form */}
      <div className="flex flex-col w-full h-1/3 font-[Poppins] items-center justify-end">
        <div className="w-full max-w-xs space-y-3 relative">
          <input
            type="text" // Changed from email to text to accept both username and email
            placeholder="Email or Username" // Updated placeholder
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            className="w-full px-4 py-2 text-black placeholder-gray-500 bg-white border border-gray-300 rounded-md shadow-md"
          />

          {/* Password input with eye icon */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 text-black placeholder-gray-500 bg-white border border-gray-300 rounded-md shadow-md"
            />
            {password && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-black"
                tabIndex={-1} // avoid tab focus on button
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex text-[14px] text-gray-600 justify-between">
            <Link to="/create-account" className="hover:underline">Create account</Link>
            <Link to="/forgot-password" className="hover:underline">Forgot Password?</Link>
          </div>

          <div className="mt-4">
            <button
              onClick={handleLogin}
              className="w-full py-3 px-6 text-white font-bold bg-[#183B4E] rounded-lg shadow-md hover:bg-[#DDA853] hover:text-black"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col h-1/3 justify-end">
        <div className="w-full text-center text-xs text-gray-500 font-sans">
          © 2025 All Rights Reserved.
        </div>
      </div>
    </div>
  );
}

export default Login;