import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";

export default function PurchaseHistory() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("purchased");
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    fetchPurchases();
  }, [activeTab, page]);

  const fetchPurchases = () => {
    setLoading(true);
    axios
      .get(`http://localhost:8000/api/purchases?page=${page}&status=${activeTab}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setPurchases(res.data.data);
        setLastPage(res.data.last_page);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching purchases:", err);
        setLoading(false);
      });
  };

  const handleAction = (id, action) => {
    axios
      .post(
        `http://localhost:8000/api/purchases/${id}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then(() => fetchPurchases());
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="p-5 text-center text-gray-500">Loading...</div>
      );
    }

    if (purchases.length === 0) {
      return (
        <div className="p-5 text-center text-gray-500">No purchases found.</div>
      );
    }

    return purchases.map((item) => (
      <div key={item.id} className="border-b border-gray-200">
        <div className="flex p-5">
          <div className="w-28 h-28 border rounded-lg overflow-hidden">
            <img
              src={item.product_image}
              alt={item.product_name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="ml-6 flex-grow">
            <div className="flex justify-between items-start">
              <div className="text-gray-900 font-medium">
                {item.product_name}
              </div>
              <div className="text-orange-600 font-semibold">
                ₱{item.price}
              </div>
            </div>
            <div className="text-gray-500 mt-2 text-sm">
              Quantity: {item.quantity}
            </div>
            <div className="text-gray-500 text-sm">
              Purchased on: {dayjs(item.created_at).format("MMM D, YYYY")}
            </div>
            {(activeTab === "purchased") && (
              <div className="mt-3 space-x-2">
                <button
                  onClick={() => handleAction(item.id, "cancel")}
                  className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAction(item.id, "return")}
                  className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                >
                  Return
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex flex-col min-h-screen w-screen bg-[#FAEBD7] font-sans">
      <Navbar />

      <div className="flex-grow p-4 overflow-y-auto">
        <div className="bg-white border rounded-lg shadow-sm h-full flex flex-col">
          <div className="px-4 py-3 border-b font-medium">Purchase History</div>

          {/* Tabs */}
          <div className="flex border-b">
            {["purchased", "cancelled", "returned"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                }}
                className={`flex-1 py-3 text-sm text-center ${
                  activeTab === tab
                    ? "border-b-2 border-[#213567] font-semibold text-[#213567]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "purchased" && "Purchased"}
                {tab === "cancelled" && "Cancelled"}
                {tab === "returned" && "Returned"}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-grow overflow-auto">{renderTabContent()}</div>

          {/* Pagination */}
          <div className="flex justify-between p-4 border-t text-sm text-gray-600">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {lastPage}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, lastPage))}
              disabled={page === lastPage}
              className="disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
