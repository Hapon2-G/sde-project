import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const existingEmails = ["student1@ustp.edu.ph", "test@ustp.edu.ph"];

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email) || !existingEmails.includes(email.trim())) {
      setError("Invalid email");
    } else {
      setError("");
      console.log("Recovery email sent to:", email);
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen font-sans bg-[#f9f3e5]">
      <header className="flex h-[70px] w-full px-10 py-5 text-white bg-[#213567] justify-between items-center">
        <div className="flex flex-col items-center">
          <img
            src="/src/assets/logo.png"
            alt="Logo"
            className="h-[42px] w-[42px]"
          />
        </div>
        <div className="flex items-center gap-6 text-white">
          <Link to="/login" className="text-[13px] hover:underline">
            Log in
          </Link>
          <button className="text-[13px] hover:underline">
            Start selling here
          </button>
        </div>
      </header>

      <main className="flex-1 flex px-4 items-center justify-center">
        <div className="max-w-md w-full p-10 text-center bg-white rounded-3xl shadow-xl">
         
          <h2 className="mb-3 text-[#213567] text-[28px] font-extrabold leading-snug">
            Find your
            <br />
            account
          </h2>

         
          <form
            onSubmit={handleSubmit}
            className="py-6 px-6 bg-white rounded-2xl shadow-md"
          >
            <div className="mb-5 text-left">
              <p className="mb-2 text-[14px] text-[#374151] leading-tight">
                Enter your email to recover your account
              </p>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 px-4 mb-2 text-[15px] placeholder-[#9ca3af] text-[#213567] border border-[#cbd5e1] rounded-full focus:outline-none focus:ring-2 focus:ring-[#213567]"
              />
              {error && (
                <p className="px-1 mt-1 text-red-600 text-sm text-left">
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 text-white text-[15px] font-semibold bg-[#213567] rounded-full hover:opacity-90 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
