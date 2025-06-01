import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from '../components/Navbar';

function AddressPage() {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    full_name: '',
    house_ward: '',
    district_province: '',
    phone_number: '',
  });

  const fetchAddresses = () => {
    axios.get('http://localhost:8000/api/addresses', {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => setAddresses(res.data))
    .catch(err => console.error("Error fetching addresses", err));
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const resetForm = () => {
    setForm({
      full_name: '',
      house_ward: '',
      district_province: '',
      phone_number: '',
    });
    setEditingId(null);
  };

  const handleSubmit = () => {
    const url = editingId
      ? `http://localhost:8000/api/addresses/${editingId}`
      : 'http://localhost:8000/api/addresses';

    const method = editingId ? axios.put : axios.post;

    method(url, form, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(() => {
      alert(editingId ? "Address updated!" : "Address added!");
      resetForm();
      setShowAddressForm(false);
      fetchAddresses();
    })
    .catch(() => alert("Failed to save address."));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this address?")) return;

    axios.delete(`http://localhost:8000/api/addresses/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(() => {
      alert("Deleted successfully!");
      fetchAddresses();
    })
    .catch(() => alert("Failed to delete address."));
  };

  const openAddForm = () => {
    resetForm();
    setShowAddressForm(true);
  };

  const openEditForm = (address) => {
    setForm({
      full_name: address.full_name,
      house_ward: address.house_ward,
      district_province: address.district_province,
      phone_number: address.phone_number,
    });
    setEditingId(address.id);
    setShowAddressForm(true);
  };

  const fields = [
    { label: "Full Name", key: "full_name" },
    { label: "House# & Ward", key: "house_ward" },
    { label: "District and Province", key: "district_province" },
    { label: "Phone Number", key: "phone_number" },
  ];

  return (
    <div className="flex flex-col overflow-hidden w-screen h-screen font-sans">
      <Navbar />
      <main className="flex-1 overflow-auto bg-[#FAEBD7]">
        <div className="flex flex-col px-20 py-6 items-center">
          <section className="w-full max-w-4xl bg-white rounded-2xl border border-black shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">My Address</h2>
              <button
                onClick={openAddForm}
                className="flex px-4 py-2 bg-white border border-black rounded-md gap-2 shadow hover:bg-gray-100"
              >
                <span className="text-lg font-bold text-gray-900">+</span>
                <span className="text-sm font-semibold text-gray-900">Add New Address</span>
              </button>
            </div>

            {addresses.length === 0 ? (
              <p className="text-gray-500 text-center">No address added yet.</p>
            ) : (
              <ul className="space-y-4">
                {addresses.map(addr => (
                  <li key={addr.id} className="p-4 bg-gray-100 rounded-lg border flex justify-between items-start text-black">
                    <div>
                      <p><strong>Name:</strong> {addr.full_name}</p>
                      <p><strong>House/Ward:</strong> {addr.house_ward}</p>
                      <p><strong>District/Province:</strong> {addr.district_province}</p>
                      <p><strong>Phone:</strong> {addr.phone_number}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => openEditForm(addr)}
                        className="px-3 py-1 text-sm bg-yellow-400 rounded hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(addr.id)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Modal */}
            {showAddressForm && (
              <div className="fixed inset-0 flex z-50 bg-black/30 backdrop-blur-sm justify-center items-center">
                <div className="w-[400px] p-8 bg-white rounded-xl shadow-lg space-y-6">
                  <h2 className="text-xl font-bold text-center text-gray-800">
                    {editingId ? "Edit Address" : "New Address"}
                  </h2>
                  <div className="space-y-4">
                    {fields.map(({ label, key }) => (
                      <div key={key}>
                        <label className="text-sm font-semibold text-gray-700">{label}</label>
                        <input
                          type="text"
                          placeholder={label}
                          value={form[key]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          className="w-full mt-1 px-4 py-2 text-black border border-gray-300 rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => {
                        resetForm();
                        setShowAddressForm(false);
                      }}
                      className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-6 py-2 bg-[#213567] text-white rounded hover:bg-[#1a2c4d]"
                    >
                      {editingId ? "Update" : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default AddressPage;
