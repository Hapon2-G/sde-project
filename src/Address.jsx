import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaHome, FaBell, FaShoppingCart, FaChevronDown } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";

function AddressPage() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [username] = useState("Van Owen");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    houseAndWard: "",
    districtAndProvince: "",
    phone: ""
  });

  const [addresses, setAddresses] = useState([
    {
      fullName: "Van Owen Dal",
      address: "Block 12 Lot 1, Bella Vita, Indahag, Cagayan de Oro City, Misamis Oriental, 9000",
      phone: "09922996007",
      isDefault: true,
    },
    {
      fullName: "Van Owen Dal",
      address: "Block 12 Lot 1, Bella Vita, Indahag, Cagayan de Oro City, Misamis Oriental, 9000",
      phone: "09922996007",
      isDefault: false,
    }
  ]);

  const handleAddNewAddress = () => {
    setShowNewAddressForm(true);
  };

  const handleCancel = () => {
    setShowNewAddressForm(false);
    setNewAddress({
      fullName: "",
      houseAndWard: "",
      districtAndProvince: "",
      phone: ""
    });
  };

  const handleSubmit = () => {
    // Create new address from form data
    const fullAddress = `${newAddress.houseAndWard}, ${newAddress.districtAndProvince}`;
    
    // Add the new address to the addresses array
    setAddresses([
      ...addresses,
      {
        fullName: newAddress.fullName,
        address: fullAddress,
        phone: newAddress.phone,
        isDefault: false
      }
    ]);
    
    // Reset form and hide it
    handleCancel();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: value
    });
  };

  const handleSetDefault = (index) => {
    const updatedAddresses = addresses.map((addr, idx) => ({
      ...addr,
      isDefault: idx === index
    }));
    setAddresses(updatedAddresses);
  };

  const handleDelete = (index) => {
    const updatedAddresses = [...addresses];
    updatedAddresses.splice(index, 1);
    setAddresses(updatedAddresses);
  };

  return (
    <div className="flex flex-col w-screen h-screen font-sans overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="flex flex-row w-full h-[70px] p-4 text-white bg-[#213567] gap-10 items-center justify-between shadow-xl">
        <div className="flex flex-row gap-20 items-center transition duration-200 ml-8">
          <Link to="/dashboard">
            <FaHome size={25} className="cursor-pointer hover:text-[#DDA853]" />
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
                <Link to="/profile" className="py-2 px-4 hover:bg-gray-100 block">Profile Information</Link>
                <Link to="/address" className="py-2 px-4 hover:bg-gray-100 block">My Address</Link>
                <Link to="/purchase-history" className="py-2 px-4 hover:bg-gray-100 block">Purchase History</Link>
                <Link to="/my-shop" className="py-2 px-4 hover:bg-gray-100 block">My Shop</Link>
                <Link to="/logout" className="py-2 px-4 hover:bg-gray-100 block text-red-500">Logout</Link>
              </div>
            )}
          </div>
          <span className="cursor-pointer underline ml-4">Start selling here</span>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex-1 bg-[#FAEBD7] overflow-hidden">
        <div className="flex h-full overflow-y-auto overflow-x-hidden px-20 py-6 gap-6 justify-center">
          {/* Sidebar */}
          <div className="w-48 bg-white shadow-md rounded-sm">
            <div className="flex flex-col text-gray-700">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? "py-4 px-6 bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600 text-lg"
                    : "py-4 px-6 hover:bg-gray-50 text-lg text-blue-600"
                }
              >
                Profile Information
              </NavLink>
              <NavLink
                to="/address"
                className={({ isActive }) =>
                  isActive
                    ? "py-4 px-6 bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600 text-lg"
                    : "py-4 px-6 hover:bg-gray-50 text-lg text-blue-600"
                }
              >
                My Address
              </NavLink>
              <NavLink
                to="/purchase-history"
                className={({ isActive }) =>
                  isActive
                    ? "py-4 px-6 bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600 text-lg"
                    : "py-4 px-6 hover:bg-gray-50 text-lg text-blue-600"
                }
              >
                Purchase History
              </NavLink>
              <NavLink
                to="/my-shop"
                className={({ isActive }) =>
                  isActive
                    ? "py-4 px-6 bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600 text-lg"
                    : "py-4 px-6 hover:bg-gray-50 text-lg text-blue-600"
                }
              >
                My Shop
              </NavLink>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-2xl border border-black shadow-md overflow-hidden max-w-5xl">
            {!showNewAddressForm ? (
              <>
                {/* Address List View */}
                <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-2xl font-medium text-gray-800 text-left">My Address</h2>
                  <button 
                    onClick={handleAddNewAddress}
                    className="flex items-center bg-[#213567] text-white px-4 py-2 rounded-md hover:bg-[#2c4684]"
                  >
                    + Add New Address
                  </button>
                </div>
                
                <div className="p-6 overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="px-6 py-3 w-1/6">Full Name</th>
                        <th className="px-6 py-3 w-2/5">Address</th>
                        <th className="px-6 py-3 w-1/6">Phone Number</th>
                        <th className="px-6 py-3 w-1/5">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addresses.map((addr, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-6 py-4 text-black break-words">{addr.fullName}</td>
                          <td className="px-6 py-4 text-black break-words">{addr.address}</td>
                          <td className="px-6 py-4 text-black break-words">{addr.phone}</td>
                          <td className="px-6 py-4 flex flex-wrap gap-2 items-center">
                            <button className="text-blue-600 hover:underline">Edit</button>
                            <button 
                              className="text-red-600 hover:underline"
                              onClick={() => handleDelete(index)}
                            >
                              Delete
                            </button>
                            {!addr.isDefault && (
                              <button 
                                className="text-gray-600 border border-gray-400 rounded px-2 py-1 hover:bg-gray-100 text-xs"
                                onClick={() => handleSetDefault(index)}
                              >
                                Set as Default
                              </button>
                            )}
                            {addr.isDefault && (
                              <span className="text-green-600 text-xs ml-2 font-medium">Default</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              /* Add New Address Form View */
              <div className="flex items-center justify-center h-full w-full p-8">
                <div className="w-full max-w-md bg-white border border-gray-200 rounded p-6">
                  <h3 className="text-xl font-medium mb-6 text-center">NEW ADDRESS</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={newAddress.fullName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2 text-black"
                        placeholder="Full Name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">House# & Ward</label>
                      <input
                        type="text"
                        name="houseAndWard"
                        value={newAddress.houseAndWard}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2 text-black"
                        placeholder="Street/Block Lot/Barangay"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">District and Province</label>
                      <input
                        type="text"
                        name="districtAndProvince"
                        value={newAddress.districtAndProvince}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2 text-black"
                        placeholder="City Municipality/Region"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={newAddress.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2 text-black"
                        placeholder="+63"
                      />
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <button
                        onClick={handleCancel}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 w-24"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="bg-[#213567] text-white px-6 py-2 rounded hover:bg-[#2c4684] w-24"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddressPage;