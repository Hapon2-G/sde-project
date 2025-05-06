import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaBell, FaShoppingCart, FaChevronDown } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";

function ProfilePage2() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState("User");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCancel = () => {
    navigate("/profile");
  };

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate("/profile");
    }, 1500);
  };

  return (
    <div className="flex flex-col w-screen h-screen font-sans overflow-hidden">
      
      <div className="flex flex-row w-full h-[70px] p-4 text-white bg-[#213567] gap-10 items-center justify-between shadow-xl">
        <div className="flex flex-row gap-20 items-center transition duration-200 ml-8">
          <Link to="/dashboard">
            <FaHome size={25} className="cursor-pointer hover:text-[#DDA853] text-white" />
          </Link>
          <FaBell size={25} className="cursor-pointer hover:text-[#DDA853]" />
          <FaShoppingCart size={25} className="cursor-pointer hover:text-[#DDA853]" />
        </div>

        <div className="flex flex-row">
          <input
            type="text"
            placeholder="Search"
            className="w-[600px] px-4 py-1 placeholder-gray-500 text-[14px] text-black bg-white rounded-2xl"
          />
        </div>

        <div className="flex flex-row items-center h-11 gap-5 mr-8">
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <MdAccountCircle size={40} />
              <div className="flex items-center gap-1">
                <span>{username}</span>
                <FaChevronDown
                  size={16}
                  className={`transform transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                />
              </div>
            </div>

            {showDropdown && (
              <div className="absolute top-12 right-0 bg-white text-black rounded-lg shadow-xl py-2 w-48 z-50">
                <Link to="/profile" className="py-2 px-4 hover:bg-gray-100 block text-[#213567] font-medium" onClick={() => setShowDropdown(false)}>Profile Information</Link>
                <Link to="/address" className="py-2 px-4 hover:bg-gray-100 block" onClick={() => setShowDropdown(false)}>My Address</Link>
                <Link to="/purchase-history" className="py-2 px-4 hover:bg-gray-100 block" onClick={() => setShowDropdown(false)}>Purchase History</Link>
                <Link to="/my-shop" className="py-2 px-4 hover:bg-gray-100 block" onClick={() => setShowDropdown(false)}>My Shop</Link>
                <Link to="/logout" className="py-2 px-4 hover:bg-gray-100 block text-red-500" onClick={() => setShowDropdown(false)}>Logout</Link>
              </div>
            )}
          </div>
          <span className="cursor-pointer underline ml-4">Start selling here</span>
        </div>
      </div>

      
      <div className="flex-1 bg-[#FAEBD7] overflow-hidden">
        <div className="flex h-full overflow-y-auto overflow-x-hidden px-20 py-6 gap-6 justify-center">
          
          <div className="w-48 bg-white shadow-md rounded-sm">
            <div className="flex flex-col text-gray-700">
              <Link to="/profile" className="py-4 px-6 bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600 text-lg">
                Profile Information
              </Link>
              <Link to="/address" className="py-4 px-6 hover:bg-gray-50 text-lg text-blue-600">
                My Address
              </Link>
              <Link to="/purchase-history" className="py-4 px-6 hover:bg-gray-50 text-lg text-blue-600">
                Purchase History
              </Link>
              <Link to="/my-shop" className="py-4 px-6 hover:bg-gray-50 text-lg text-blue-600">
                My Shop
              </Link>
            </div>
          </div>

          
          <div className="flex-1 bg-white rounded-2xl border border-black shadow-md overflow-hidden max-w-4xl">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-2xl font-medium text-gray-800 text-left">Profile Information</h2>
            </div>

            {showSuccess && (
              <div className="px-6 pt-4 text-green-700 bg-green-100 border border-green-300 rounded">
                Profile edited successfully!
              </div>
            )}

            <div className="p-6 flex">
              <div className="flex-1 space-y-4 pr-6">
                <div className="flex flex-col items-start">
                  <label className="text-sm text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="flex flex-col items-start">
                  <label className="text-sm text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="flex flex-col items-start">
                  <label className="text-sm text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="flex flex-col items-start">
                  <label className="text-sm text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="flex gap-4 w-full">
                  <div className="flex flex-col items-start w-1/2">
                    <label className="text-sm text-gray-700 mb-1">Gender</label>
                    <input
                      type="text"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex flex-col items-start w-1/2">
                    <label className="text-sm text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="text"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-4 justify-start">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-[#213567] text-white rounded hover:bg-[#172648] transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>

              <div className="w-64 flex flex-col items-center justify-start pt-4">
                <div className="w-32 h-32 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100">
                  
                </div>
                <button className="mt-4 px-4 py-2 bg-[#213567] text-white rounded">
                  Select Image
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage2;