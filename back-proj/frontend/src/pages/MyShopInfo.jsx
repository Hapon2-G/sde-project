import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './ShopInfo.css';

const MyShopInfo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shopName: '',
    email: '',
    idType: '',
    houseAndWard: '',
    idNumber: '',
    districtAndProvince: '',
    phoneNumber: '',
    photoId: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [canEdit, setCanEdit] = useState(true);
  const [photoIdUrl, setPhotoIdUrl] = useState(null);
  const [newPhotoId, setNewPhotoId] = useState(null);
  const [isSeller, setIsSeller] = useState(null); // null = checking, true = is seller, false = not seller

  useEffect(() => {
    const checkSellerStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsSeller(false);
          setLoading(false);
          return;
        }

        // Check if user is a seller
        const response = await fetch('http://localhost:8000/api/seller/status', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 404 || response.status === 403) {
          // User is not a seller
          setIsSeller(false);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to check seller status');
        }

        const statusData = await response.json();
        
        if (!statusData.is_seller) {
          setIsSeller(false);
          setLoading(false);
          return;
        }

        // User is a seller, fetch their info
        setIsSeller(true);
        await fetchSellerInfo();

      } catch (err) {
        console.error('Error checking seller status:', err);
        setIsSeller(false);
        setLoading(false);
      }
    };

    const fetchSellerInfo = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/seller/info', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch seller information');

        const data = await response.json();
        setFormData({
          shopName: data.shop_name || '',
          email: data.email || '',
          idType: data.id_type || '',
          houseAndWard: data.house_and_ward || '',
          idNumber: data.id_number || '',
          districtAndProvince: data.district_and_province || '',
          phoneNumber: data.phone_number || '',
          photoId: null // File input will be handled separately
        });

        // Set photo ID URL if available
        if (data.photo_id_url) {
          setPhotoIdUrl(data.photo_id_url);
        }

        // Date restriction logic
        setLastUpdatedAt(data.last_updated_at);
        if (data.last_updated_at) {
          const lastEditDate = new Date(data.last_updated_at);
          const now = new Date();
          const diffDays = Math.floor((now - lastEditDate) / (1000 * 60 * 60 * 24));
          setCanEdit(diffDays >= 7);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    checkSellerStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhotoId(file);
      setFormData({
        ...formData,
        photoId: file
      });
    }
  };

  const validateForm = () => {
    if (!formData.shopName) return "Shop Name is required";
    if (!formData.email) return "Email Address is required";
    if (!formData.email.includes('@')) return "Please enter a valid email address";
    if (!formData.idType) return "ID Type is required";
    if (!formData.idNumber) return "ID Number is required";
    if (!formData.houseAndWard) return "House# and Ward is required";
    if (!formData.districtAndProvince) return "District and Province is required";
    if (!formData.phoneNumber) return "Phone Number is required";
    return null;
  };

  const handleEdit = async () => {
    setSuccess(false);
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const data = new FormData();
      data.append('shopName', formData.shopName);
      data.append('email', formData.email);
      data.append('idType', formData.idType);
      data.append('idNumber', formData.idNumber);
      data.append('houseAndWard', formData.houseAndWard);
      data.append('districtAndProvince', formData.districtAndProvince);
      data.append('phoneNumber', formData.phoneNumber);
      
      // Only append photo if a new one was selected
      if (newPhotoId) {
        data.append('photoId', newPhotoId);
      }

      const response = await fetch('http://localhost:8000/api/seller/update', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update seller information');
      }

      const responseData = await response.json();
      setSuccess(true);
      setIsEditing(false);
      setNewPhotoId(null);
      
      // Update photo URL if a new one was uploaded
      if (responseData.photo_id_url) {
        setPhotoIdUrl(responseData.photo_id_url);
      }
      
      console.log('Updated seller info:', responseData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegisterAsSeller = () => {
    navigate('/reg');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col w-screen min-h-screen font-sans">
        <Navbar />
        <main className="flex-1 bg-[#FAEBD7]">
          <div className="flex flex-col px-20 py-6 items-center">
            <section className="w-full max-w-4xl bg-white rounded-2xl border border-black shadow-md p-6">
              <div className="text-center">
                <p className="text-gray-600">Loading...</p>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  // Not a seller - show registration prompt
  if (isSeller === false) {
    return (
      <div className="flex flex-col w-screen min-h-screen font-sans">
        <Navbar />
        <main className="flex-1 bg-[#FAEBD7]">
          <div className="flex flex-col px-20 py-6 items-center">
            <section className="w-full max-w-4xl bg-white rounded-2xl border border-black shadow-md p-6">
              <div className="text-center py-12">
                <div className="mb-6">
                  <svg 
                    className="mx-auto h-16 w-16 text-gray-400 mb-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                    />
                  </svg>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Access Restricted
                  </h2>
                  <p className="text-gray-600 mb-6">
                    You are not a seller. Register first to become a seller and access your shop profile.
                  </p>
                </div>
                
                <button
                  onClick={handleRegisterAsSeller}
                  className="px-8 py-3 bg-[#213567] text-white font-semibold rounded-lg hover:bg-[#1a2c4d] transition-colors duration-200 shadow-md"
                >
                  Register as Seller
                </button>
                
                <p className="text-sm text-gray-500 mt-4">
                  Already registered? Please contact support if you believe this is an error.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  // User is a seller - show the normal shop info page
  return (
    <div className="flex flex-col w-screen min-h-screen font-sans">
      <Navbar />
      <main className="flex-1 bg-[#FAEBD7]">
        <div className="flex flex-col px-20 py-6 items-center">
          <section className="w-full max-w-4xl bg-white rounded-2xl border border-black shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">My Shop Profile</h2>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                Profile updated successfully!
              </div>
            )}

            {!canEdit && (
              <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                You can only edit your shop profile once every 7 days.
                {lastUpdatedAt && (
                  <span className="block text-sm mt-1">
                    Last updated: {new Date(lastUpdatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="shopName" className="block text-sm font-semibold text-gray-700 mb-1">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    id="shopName"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 text-black border border-gray-300 rounded-lg ${
                      !isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    } ${error && !formData.shopName ? 'border-red-500' : ''}`}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 text-black border border-gray-300 rounded-lg ${
                      !isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    } ${error && (!formData.email || !formData.email.includes('@')) ? 'border-red-500' : ''}`}
                  />
                </div>
              </div>

              {/* ID Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="idType" className="block text-sm font-semibold text-gray-700 mb-1">
                    ID Type
                  </label>
                  <input
                    type="text"
                    id="idType"
                    name="idType"
                    value={formData.idType}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 text-black border border-gray-300 rounded-lg ${
                      !isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    } ${error && !formData.idType ? 'border-red-500' : ''}`}
                  />
                </div>
                <div>
                  <label htmlFor="idNumber" className="block text-sm font-semibold text-gray-700 mb-1">
                    ID Number
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 text-black border border-gray-300 rounded-lg ${
                      !isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    } ${error && !formData.idNumber ? 'border-red-500' : ''}`}
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="houseAndWard" className="block text-sm font-semibold text-gray-700 mb-1">
                    House# and Ward
                  </label>
                  <input
                    type="text"
                    id="houseAndWard"
                    name="houseAndWard"
                    placeholder="Street/Block Lot/Barangay"
                    value={formData.houseAndWard}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 text-black border border-gray-300 rounded-lg ${
                      !isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    } ${error && !formData.houseAndWard ? 'border-red-500' : ''}`}
                  />
                </div>
                <div>
                  <label htmlFor="districtAndProvince" className="block text-sm font-semibold text-gray-700 mb-1">
                    District and Province
                  </label>
                  <input
                    type="text"
                    id="districtAndProvince"
                    name="districtAndProvince"
                    value={formData.districtAndProvince}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 text-black border border-gray-300 rounded-lg ${
                      !isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    } ${error && !formData.districtAndProvince ? 'border-red-500' : ''}`}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className={`flex w-full border border-gray-300 rounded-lg ${
                    !isEditing ? 'bg-gray-100' : 'bg-white'
                  } ${error && !formData.phoneNumber ? 'border-red-500' : ''}`}>
                    <span className="px-3 py-2 bg-gray-200 border-r border-gray-300 rounded-l-lg text-gray-700">
                      +63
                    </span>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`flex-1 px-4 py-2 text-black rounded-r-lg border-0 focus:ring-0 ${
                        !isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Photo ID Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Photo of Valid ID
                  </label>
                  
                  {/* Current Photo Display */}
                  {photoIdUrl && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Current ID Photo:</p>
                      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                        <img 
                          src={photoIdUrl} 
                          alt="Current ID" 
                          className="max-w-xs max-h-48 object-contain mx-auto block"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <p className="text-center text-gray-500 text-sm mt-2" style={{display: 'none'}}>
                          Image not available
                        </p>
                      </div>
                    </div>
                  )}

                  {/* File Upload (only when editing) */}
                  {isEditing && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        {photoIdUrl ? 'Upload new ID photo (optional):' : 'Upload ID photo:'}
                      </p>
                      <div className="file-input-wrapper">
                        <input
                          type="file"
                          id="photoId"
                          name="photoId"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <button 
                          type="button" 
                          className="px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 transition-colors"
                          onClick={() => document.getElementById('photoId').click()}
                        >
                          {newPhotoId ? `Selected: ${newPhotoId.name}` : 'Choose File'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                {!isEditing ? (
                  <button
                    type="button"
                    className={`px-6 py-2 text-white rounded ${
                      canEdit ? 'bg-[#213567] hover:bg-[#1a2c4d]' : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    onClick={() => {
                      if (canEdit) {
                        setIsEditing(true);
                      }
                    }}
                    disabled={!canEdit}
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button 
                      type="button" 
                      className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      onClick={() => {
                        setIsEditing(false);
                        setError(null);
                        setSuccess(false);
                        setNewPhotoId(null);
                        // Reset form data to original values
                        const fetchData = async () => {
                          try {
                            const response = await fetch('http://localhost:8000/api/seller/info', {
                              headers: {
                                Accept: 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                              },
                            });
                            if (response.ok) {
                              const data = await response.json();
                              setFormData({
                                shopName: data.shop_name || '',
                                email: data.email || '',
                                idType: data.id_type || '',
                                houseAndWard: data.house_and_ward || '',
                                idNumber: data.id_number || '',
                                districtAndProvince: data.district_and_province || '',
                                phoneNumber: data.phone_number || '',
                                photoId: null
                              });
                            }
                          } catch (err) {
                            console.error('Error resetting form:', err);
                          }
                        };
                        fetchData();
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-6 py-2 bg-[#213567] text-white rounded hover:bg-[#1a2c4d]"
                    >
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MyShopInfo;