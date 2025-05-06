import { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Username:", username);
    console.log("Password:", password);
    window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  };

  return (
    <>
      <div className="flex flex-col w-screen h-screen items-center">
        
        <div className="flex flex-col w-full h-1/3 font-[Poppins] items-center justify-end">
          <img
            src="/src/assets/logo.png"
            alt="Logo"
            className="max-w-40 max-h-40"
          />
          <span className="text-center text-[#183B4E] font-bold text-shadow-lg md:text-3xl lg:text-4xl">
            USTP MARKETPLACE FOR STUDENTS
          </span>
        </div>

        
        <div className="flex flex-col w-full h-1/3 font-[Poppins] items-center justify-end">
          <div className="w-full max-w-xs space-y-3">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 text-black placeholder-gray-500 bg-white border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-black placeholder-gray-500 bg-white border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="flex text-[14px] text-gray-600 justify-between">
              <Link to="/create-account" className="hover:underline">
                Create account
              </Link>
              <Link to="/forgot-password" className="hover:underline">
                Forgot Password?
              </Link>
            </div>

            <div className="mt-16">
              <button
                onClick={handleLogin}
                className="w-full py-3 px-4 text-white font-bold bg-[#183B4E] rounded-lg transition-transform shadow-md hover:scale-102 hover:bg-[#DDA853] hover:text-black"
              >
                Login
              </button>
            </div>
          </div>
        </div>

        
        <div className="flex flex-col h-1/3 justify-end">
          <div className="w-full text-center text-xs text-gray-500 font-sans">
            © 2025 All Rights Reserved.
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
