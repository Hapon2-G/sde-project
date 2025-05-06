import { FaHome, FaBell, FaShoppingCart, FaChevronDown } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { useState } from "react";
import { Link } from "react-router-dom";

function BuyerDashboard() {
  const [showDropdown, setShowDropdown] = useState(false);
  const products = Array(20).fill({
    name: "Sample Item",
    price: "₱123.45",
    image: "/img.jpg",
  });

  return (
    <div className="flex flex-col overflow-clip w-screen h-screen font-sans">
      
      <div className="flex flex-row w-full h-[70px] p-4 text-white bg-[#213567] gap-10 items-center justify-between shadow-xl">
        <div className="flex flex-row gap-20 items-center transition duration-200 ml-8">
          <FaHome size={25} className="cursor-pointer hover:text-[#DDA853]" />
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
                <span>User</span>
                <FaChevronDown 
                  size={16} 
                  className={`transform transition-transform duration-200 ${
                    showDropdown ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>
            
            {showDropdown && (
              <div className="absolute top-12 right-0 bg-white text-black rounded-lg shadow-xl py-2 w-48 z-50">
                <Link 
                  to="/profile" 
                  className="py-2 px-4 hover:bg-gray-100 cursor-pointer block"
                  onClick={() => setShowDropdown(false)}
                >
                  Profile Information
                </Link>
                <div className="py-2 px-4 hover:bg-gray-100 cursor-pointer">My Address</div>
                <div className="py-2 px-4 hover:bg-gray-100 cursor-pointer">Purchase History</div>
                <div className="py-2 px-4 hover:bg-gray-100 cursor-pointer">My Shop</div>
                <div className="py-2 px-4 hover:bg-gray-100 cursor-pointer text-red-500">Logout</div>
              </div>
            )}
          </div>
          <span className="cursor-pointer underline ml-4">
            Start selling here
          </span>
        </div>
      </div>

      
      <div className="flex flex-1 overflow-hidden">
       
        <div className="w-[200px] p-4">
          <img
            src="ad.jpg"
            alt="Ad"
            className="w-full h-full bg-amber-200 rounded-lg object-cover"
          />
        </div>

      
        <div
          className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
            overflow-auto no-scrollbar mt-4 ml-2 mr-4 bg-[#FAEBD7] gap-2 p-4"
          style={{ maxHeight: "calc(100vh - 70px)" }}
        >
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow text-center text-sm hover:shadow-lg transition p-2"
            >
              <div className="w-full aspect-square overflow-hidden rounded">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="mt-2">{product.name}</h3>
              <p className="text-orange-600 font-bold">{product.price}</p>
            </div>
          ))}
        </div>
      </div>

      
      <button className="w-[125px] p-4 bg-[#F6B24D] rounded-xl shadow-lg fixed bottom-10 right-10 flex items-center justify-center">
        <FaShoppingCart size={30} color="black" />
      </button>
    </div>
  );
}

export default BuyerDashboard;