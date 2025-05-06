import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function CreateAccount2() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    
    if (!username || !password || !confirmpassword || !email) {
      alert("Please fill out all fields.");
      return;
    }

    if (password !== confirmpassword) {
      alert("Passwords do not match.");
      return;
    }

    
    setAccountCreated(true);

    
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div
      style={{ backgroundImage: "url('/src/assets/bg-ustp.png')" }}
      className="flex w-screen h-screen bg-cover bg-center bg-no-repeat items-center justify-end"
    >
      <div className="text-left text-[#DDA853] font-extrabold text-5xl leading-tight text-shadow-lg absolute bottom-20 left-10">
        <div>YOUR</div>
        <div>JOURNEY</div>
        <div>BEGINS HERE</div>
      </div>

      <div className="flex flex-col w-[550px] h-[700px] p-8 mr-50 bg-[#F9F9F9] rounded-3xl shadow-2xl">
        <h1 className="mb-2 text-4xl font-bold text-blue-900 text-center">
          Sign Up
        </h1>
        <p className="text-sm text-center text-gray-700">
          Step 1: Provide Username, Password
          <br />
          and Email
        </p>

        
        <div className="mt-2 flex mb-4 justify-center">
          <div className="w-2 h-2 mx-1 bg-blue-900 rounded-full"></div>
          <div className="w-2 h-2 mx-1 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 mx-1 bg-gray-300 rounded-full"></div>
        </div>

        
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 placeholder-gray-500 text-[14px] text-black border rounded-md shadow-[inset_0px_2px_3px_rgba(0,0,0,0.2)] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-pink-600 font-bold text-xl absolute right-3 top-2.5">
                i
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 placeholder-gray-500 text-[14px] text-black border rounded-md shadow-[inset_0px_2px_3px_rgba(0,0,0,0.2)] focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmpassword}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-2 placeholder-gray-500 text-[14px] text-black border rounded-md shadow-[inset_0px_2px_3px_rgba(0,0,0,0.2)] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-pink-600 font-bold text-xl absolute right-3 top-2.5">
                i
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 placeholder-gray-500 text-[14px] text-black border rounded-md shadow-[inset_0px_2px_3px_rgba(0,0,0,0.2)] focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 text-white font-semibold bg-blue-900 rounded-full shadow-md hover:bg-blue-800"
          >
            Create Account
          </button>

          {accountCreated && (
            <div className="text-green-600 font-semibold text-center mt-2">
              Account created! Redirecting to login...
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateAccount2;
