import { useState } from "react";

function CreateAccount() {
  const [step, setStep] = useState(1);

 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirm] = useState("");
  const [email, setEmail] = useState("");

  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (step === 1) {
      
      setStep(2);
    } else {
      
      console.log({
        username,
        password,
        email,
        firstName,
        lastName,
        dob,
        address,
      });
      alert("Account created!");
    }
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
          Step {step}: {step === 1 ? "Account Credentials" : "Personal Details"}
        </p>

        
        <div className="mt-2 flex mb-4 justify-center">
          <div
            className={`w-2 h-2 mx-1 rounded-full ${
              step === 1 ? "bg-blue-900" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`w-2 h-2 mx-1 rounded-full ${
              step === 2 ? "bg-blue-900" : "bg-gray-300"
            }`}
          ></div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 border-1 border-amber-300 space-y-4"
        >
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 text-left">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 text-[14px] text-black placeholder-gray-500 border rounded-md shadow-[inset_0px_2px_3px_rgba(0,0,0,0.2)]"
                />
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
                  className="w-full px-4 py-2 text-[14px] text-black placeholder-gray-500 border rounded-md shadow-[inset_0px_2px_3px_rgba(0,0,0,0.2)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-left">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmpassword}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-4 py-2 text-[14px] text-black placeholder-gray-500 border rounded-md shadow-[inset_0px_2px_3px_rgba(0,0,0,0.2)]"
                />
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
                  className="w-full px-4 py-2 text-[14px] text-black placeholder-gray-500 border rounded-md shadow-[inset_0px_2px_3px_rgba(0,0,0,0.2)]"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 text-left">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 text-[14px] text-black placeholder-gray-500 border rounded-md shadow-[inset_0px_2px_3px_rgba(0,0,0,0.2)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-left">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 text-[14px] text-black placeholder-gray-500 border rounded-md shadow-[inset_0px_2px_3px_rgba(0,0,0,0.2)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-left">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-2 text-[14px] text-black placeholder-gray-500 border rounded-md shadow-[inset_0px_2px_3px_rgba(0,0,0,0.2)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-left">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 text-[14px] text-black placeholder-gray-500 border rounded-md shadow-[inset_0px_2px_3px_rgba(0,0,0,0.2)]"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-2 mt-2 text-white font-semibold bg-blue-900 rounded-full shadow-md hover:bg-blue-800"
          >
            {step === 1 ? "Next" : "Submit"}
          </button>

          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-center text-black hover:underline"
            >
              Back
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateAccount;
