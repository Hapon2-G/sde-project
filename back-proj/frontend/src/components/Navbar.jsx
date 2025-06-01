import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaBell, FaShoppingCart, FaChevronDown } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { user, logout, userImage } = useAuth(); // 👈 include userImage from context

  const userDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  const notifications = [
    "Order #1234 has been shipped.",
    "Your item is out for delivery.",
    "New message from seller.",
    "Order #5678 has been delivered.",
  ];

  const handleNavigation = (path) => {
    setShowDropdown(false);
    setShowNotifications(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-row w-full h-[70px] p-4 text-white bg-[#213567] shadow-xl items-center justify-between pl-20 pr-20">
      <img
        src={logo}
        alt="Logo"
        className="h-10 w-auto cursor-pointer"
        onClick={() => navigate("/buyer-dashboard")}
      />

      <div className="flex flex-row gap-20 items-center">
        <div onClick={() => navigate("/buyer-dashboard")} className="cursor-pointer hover:text-[#DDA853]">
          <FaHome size={25} />
        </div>

        <div ref={notificationDropdownRef} className="relative cursor-pointer hover:text-[#DDA853]">
          <FaBell size={25} onClick={() => setShowNotifications(!showNotifications)} />
          {showNotifications && (
            <div className="absolute top-8 -right-28 w-64 bg-white text-black rounded-lg shadow-xl z-50">
              <div className="px-4 py-2 text-sm font-semibold bg-gray-200 rounded-t-lg">
                Notifications
              </div>
              {notifications.map((note, i) => (
                <div key={i} className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                  {note}
                </div>
              ))}
            </div>
          )}
        </div>

        <FaShoppingCart size={25} className="cursor-pointer hover:text-[#DDA853]"
        onClick={() => navigate("/my-cart")} />
      </div>

      <input
        type="text"
        placeholder="Search"
        className="w-[600px] px-4 py-1 placeholder-gray-500 text-[14px] text-black bg-white rounded-2xl shadow-inner focus:outline-none focus:ring-1 focus:ring-[#ffa618]"
      />

      <div className="flex flex-row h-11 mr-8 items-center">
        <div ref={userDropdownRef} className="relative">
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex cursor-pointer items-center gap-2"
          >
            {userImage ? (
              <img src={userImage} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <MdAccountCircle size={40} />
            )}
            <div className="flex items-center gap-1">
              <span>{user?.first_name || "User"}</span>
              <FaChevronDown size={16} className={`transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </div>
          </div>

          {showDropdown && (
            <div className="absolute top-12 -right-3 w-48 py-2 text-black bg-white rounded-lg shadow-xl z-50">
              <div onClick={() => handleNavigation("/profile")} className="block py-2 px-4 hover:bg-gray-100 cursor-pointer">
                Profile Information
              </div>
              <div onClick={() => handleNavigation("/profile-page-address")} className="block py-2 px-4 hover:bg-gray-100 cursor-pointer">
                My Address
              </div>
              <div onClick={() => handleNavigation("/purchase-history")} className="block py-2 px-4 hover:bg-gray-100 cursor-pointer">
                Purchase History
              </div>
              <div onClick={() => handleNavigation("/myshop-info")} className="block py-2 px-4 hover:bg-gray-100 cursor-pointer">
                My Shop
              </div>
              <div onClick={() => handleNavigation("/reg")} className="block py-2 px-4 hover:bg-gray-100 cursor-pointer">
                Start Selling Here
              </div>
              <div onClick={handleLogout} className="block py-2 px-4 text-red-500 hover:bg-gray-100 cursor-pointer">
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
