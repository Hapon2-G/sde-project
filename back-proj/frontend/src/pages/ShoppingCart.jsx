import React, { useState, useEffect, useRef } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function ShoppingCart() {
  const navigate = useNavigate();
  const [cartStep, setCartStep] = useState(1); // 1: Cart View, 2: Payment Method, 3: Payment Process
  const [selectedPayment, setSelectedPayment] = useState("gcash");

  const checkoutRef = useRef(null);

  const cartItems = [
    { id: 1, name: "Item Name and Specifications", price: 9000, quantity: 1 },
    { id: 2, name: "Item Name and Specifications", price: 15000, quantity: 1 },
  ];

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalOrders = cartItems.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (checkoutRef.current && !checkoutRef.current.contains(event.target)) {
        setCartStep(1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderCartItems = () =>
    cartItems.map((item) => (
      <div key={item.id} className="border border-gray-200 rounded-sm p-4 mb-4 flex items-start">
        <input type="checkbox" className="mt-8 mr-4" />
        <div className="w-16 h-16 bg-white border border-gray-200 flex-shrink-0"></div>
        <div className="ml-4 flex-grow">
          <div className="text-black text-sm">{item.name}</div>
          <div className="flex justify-between items-center mt-3">
            <div className="text-black font-semibold">₱{item.price.toLocaleString()}</div>
            <div className="flex items-center gap-2">
              <button className="w-6 h-6 border border-gray-300 rounded-sm flex items-center justify-center text-black">
                <FaMinus size={10} />
              </button>
              <input
                type="text"
                value={item.quantity}
                className="w-8 h-6 text-center border border-gray-300 text-xs text-black"
                readOnly
              />
              <button className="w-6 h-6 border border-gray-300 rounded-sm flex items-center justify-center text-black">
                <FaPlus size={10} />
              </button>
            </div>
          </div>
        </div>
        <button className="text-xs text-black ml-4">Delete</button>
      </div>
    ));

  const renderPaymentMethod = () => (
    <div className="flex-grow flex justify-center">
      <div
        ref={checkoutRef}
        className="w-72 p-4 border border-gray-200 rounded-sm mt-4 bg-white shadow-lg"
      >
        <h2 className="text-center font-bold mb-6 text-black">PAYMENT METHOD</h2>
        <div
          className={`border p-3 mb-4 flex items-center cursor-pointer rounded-sm ${
            selectedPayment === "gcash" ? "border-blue-500" : "border-gray-300"
          }`}
          onClick={() => setSelectedPayment("gcash")}
        >
          <div className="w-10 h-10 flex items-center justify-center bg-white mr-4 rounded-full overflow-hidden">
            <svg viewBox="0 0 40 40" className="w-8 h-8">
              <circle cx="20" cy="20" r="20" fill="#0074E0" />
              <text x="20" y="25" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">
                G
              </text>
            </svg>
          </div>
          <span className="text-black">G-Cash</span>
        </div>
        <div
          className={`border p-3 mb-6 flex items-center justify-center cursor-pointer rounded-sm ${
            selectedPayment === "cod" ? "border-blue-500" : "border-gray-300"
          }`}
          onClick={() => setSelectedPayment("cod")}
        >
          <span className="text-black">Cash on Delivery Service</span>
        </div>
        <button
          className="bg-[#213567] text-white w-full py-2 rounded-sm"
          onClick={() => setCartStep(3)}
        >
          Submit
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen w-screen overflow-hidden bg-[#FAEBD7] font-sans">
      <Navbar />

      <div className="flex flex-grow">
        <div className="flex-grow p-6 bg-gray-50">
          <div className="bg-white border rounded-sm shadow-sm overflow-hidden mx-auto max-w-6xl">
            <div className="p-4 border-b border-gray-200">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-black">Select All</span>
              </label>
            </div>

            <div className="flex">
              <div className="flex-grow p-4">
                {cartStep === 1 && renderCartItems()}
                {cartStep === 2 && renderPaymentMethod()}
              </div>

              <div className="w-64 p-4 border-l border-gray-200">
                <div className="mb-2 text-black">Total Orders: {totalOrders}</div>
                <div className="mb-2">
                  <div className="flex justify-between">
                    <span className="text-black">Total Price</span>
                    <span className="text-black">₱{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="border-b border-gray-200 my-2"></div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between">
                    <span className="text-black">Total:</span>
                    <span className="font-bold text-black">₱{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  className="bg-[#213567] text-white w-full py-2 rounded-sm"
                  onClick={() => setCartStep(2)}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
