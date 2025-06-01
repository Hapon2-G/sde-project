import { useState } from "react";
import { useNavigate } from "react-router-dom";
import productImage from "./assets/img.jpg";
import Navbar from "./components/Navbar";

export default function ShopInfoPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("customize");

  const tabs = [
    { key: "customize", label: "Customize product variation" },
    { key: "orders", label: "Orders" },
    { key: "returned", label: "Returned Items" },
  ];

  return (
    <div className="flex flex-col overflow-hidden w-screen h-screen font-sans">
      
      <Navbar />

      {/* Main Section */}
      <main className="flex-1 overflow-auto bg-[#FAEBD7] p-8 flex justify-center items-start">
        <section className="w-full max-w-4xl bg-white rounded-xl shadow-md border border-black">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 text-center text-sm font-medium">
            {tabs.map((tab) => (
              <div
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 cursor-pointer py-3 ${
                  activeTab === tab.key
                    ? "text-indigo-700 border-b-2 border-indigo-700"
                    : "text-gray-500"
                }`}
              >
                {tab.label}
              </div>
            ))}
          </div>

          <div className="p-4">
            {/* Add New Item Button - Only for Customize */}
            {activeTab === "customize" && (
              <div className="flex justify-end">
                <button
                  onClick={() => navigate("/product-info")}
                  className="px-6 py-2 text-white bg-[#213567] rounded-md text-sm hover:bg-[#1a2c4d]"
                >
                  Add New Item
                </button>
              </div>
            )}

            {/* Tab Content */}
            <div className="border-t border-gray-200 mt-4 px-6 py-4">
              {/* Customize Tab */}
              {activeTab === "customize" && (
                <div className="text-black">
                  <div className="grid grid-cols-4 gap-4 font-medium border-b pb-3">
                    <div>Item Name</div>
                    <div className="text-right pr-8">Quantity</div>
                    <div className="text-right pr-8">Price</div>
                    <div className="text-right pr-8">Total</div>
                  </div>

                  <div className="py-4 border-b">
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 border rounded">
                          <img
                            src={productImage}
                            alt="Product"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-black">View Seller's specific</p>
                          <p className="text-black">variation preference</p>
                          <p className="text-black mt-2">Designated Location</p>
                        </div>
                      </div>
                      <div className="text-black text-right pr-8">2</div>
                      <div className="text-black text-right pr-8">₱1,000</div>
                      <div className="text-right pr-8">
                        <div className="text-black">₱2,000</div>
                        <div className="mt-4 flex justify-end">
                          <button className="px-4 py-1 text-white bg-[#213567] rounded-md text-sm">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="text-black">
                  <div className="grid grid-cols-4 gap-4 font-medium border-b pb-3">
                    <div>Item Name</div>
                    <div className="text-right pr-8">Quantity</div>
                    <div className="text-right pr-8">Price</div>
                    <div className="text-right pr-8">Total</div>
                  </div>

                  <div className="py-4 border-b">
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 border rounded">
                          <img
                            src={productImage}
                            alt="Product"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-black">View Seller's specific</p>
                          <p className="text-black">variation preference</p>
                          <p className="text-black mt-2">Designated Location</p>
                        </div>
                      </div>
                      <div className="text-black text-right pr-8">2</div>
                      <div className="text-black text-right pr-8">₱1,000</div>
                      <div className="text-right pr-8">
                        <div className="text-black">₱2,000</div>
                        <div className="mt-4 flex justify-end space-x-2">
                          <button className="px-4 py-1 text-white bg-green-600 rounded-md text-sm">
                            Accept
                          </button>
                          <button className="px-4 py-1 text-white bg-red-600 rounded-md text-sm">
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Returned Tab */}
              {activeTab === "returned" && (
                <div className="text-black">
                  <div className="grid grid-cols-4 gap-4 font-medium border-b pb-3">
                    <div>Item Name</div>
                    <div className="text-right pr-8">Quantity</div>
                    <div className="text-right pr-8">Price</div>
                    <div className="text-right pr-8">Total</div>
                  </div>

                  <div className="py-4 border-b">
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 border rounded">
                          <img
                            src={productImage}
                            alt="Product"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-black">View Buyer's specific</p>
                          <p className="text-black">variation preference</p>
                          <p className="text-black mt-2">Designated Location</p>
                        </div>
                      </div>
                      <div className="text-black text-right pr-8">2</div>
                      <div className="text-black text-right pr-8">₱1,000</div>
                      <div className="text-right pr-8">
                        <div className="text-black">₱2,000</div>
                        <div className="mt-4 flex justify-end">
                          <button className="px-4 py-1 text-white bg-[#213567] rounded-md text-sm">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
