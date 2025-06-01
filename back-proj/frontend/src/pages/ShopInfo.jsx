import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShopInfo.css';

const ShopInfo = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shopName: '',
    email: '',
    idType: '',
    houseAndWard: '',
    idNumber: '',
    districtAndProvince: '',
    photoId: null,
    phoneNumber: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isAlreadySeller, setIsAlreadySeller] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already a seller when component loads
  useEffect(() => {
    checkSellerStatus();
  }, []);

  const checkSellerStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/seller/status', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.is_seller) {
          setIsAlreadySeller(true);
          setSellerInfo(data.seller_info);
        }
      }
    } catch (err) {
      console.error('Error checking seller status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (error) setError(null);
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photoId: e.target.files[0]
    });
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.shopName) return "Shop Name is required";
    if (!formData.email) return "Email Address is required";
    if (!formData.email.includes('@')) return "Please enter a valid email address";
    if (!formData.idType) return "ID Type is required";
    if (!formData.idNumber) return "ID Number is required";
    if (!formData.houseAndWard) return "House# and Ward is required";
    if (!formData.districtAndProvince) return "District and Province is required";
    if (!formData.photoId) return "Please upload a valid ID photo";
    if (!formData.phoneNumber) return "Phone Number is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await fetch('http://localhost:8000/api/seller/register', {
        method: 'POST',
        body: data,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const resData = await response.json();
        if (response.status === 409) {
          throw new Error("You are already registered as a seller.");
        }
        throw new Error(resData.message || "Registration failed.");
      }

      const resData = await response.json();
      setSuccess(true);
      console.log('Registered seller:', resData);

    } catch (err) {
      setError(err.message);
      console.error("Error submitting form:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/seller-registration');
  };

  const handleGoToDashboard = () => {
    navigate('/seller-dashboard'); // or wherever you want to redirect existing sellers
  };

  // Show loading while checking status
  if (isLoading) {
    return (
      <div className="flex flex-col w-screen h-screen shop-profile-container">
        <div className="shop-profile-card">
          <div className="loading-message">
            <p>Checking your seller status...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show message for users who are already sellers
  if (isAlreadySeller) {
    return (
      <div className="flex flex-col w-screen h-screen shop-profile-container">
        <div className="shop-profile-card">
          <button className="back-button" onClick={handleBack}>Back</button>
          
          <div className="already-seller-message">
            <h2>You're already registered as a seller!</h2>
            <p style={{color: '#000'}}>Shop Name: <strong style={{color: '#000'}}>{sellerInfo?.shop_name}</strong></p>
            <p style={{color: '#000'}}>Email: <strong style={{color: '#000'}}>{sellerInfo?.email}</strong></p>
            
            <div className="button-group">
              <button 
                className="submit-button" 
                onClick={() => navigate('/buyer-dashboard')}
              >
                Go to Dashboard
              </button>
              <button 
                className="back-button" 
                onClick={handleBack}
              >
                Back 
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show registration form for new sellers
  return (
    <div className="flex flex-col w-screen h-screen shop-profile-container">
      <div className="shop-profile-card">
        <button className="back-button" onClick={handleBack}>Back</button>

        <h1 className="shop-profile-title">Shop Profile Information</h1>

        {success ? (
          <div className="success-message">
            <h2>Registration Successful!</h2>
            <p>Your shop has been registered successfully.</p>
            <button 
              className="submit-button" 
              onClick={() => navigate('/buyer-dashboard')}
            >
              Continue
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="shopName">Shop Name</label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  placeholder="Input"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  className={error && !formData.shopName ? "input-error" : ""}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Input"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={error && (!formData.email || !formData.email.includes('@')) ? "input-error" : ""}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="idType">ID Type</label>
                <input
                  type="text"
                  id="idType"
                  name="idType"
                  value={formData.idType}
                  onChange={handleInputChange}
                  className={error && !formData.idType ? "input-error" : ""}
                />
              </div>

              <div className="form-group">
                <label htmlFor="houseAndWard">House# and Ward</label>
                <input
                  type="text"
                  id="houseAndWard"
                  name="houseAndWard"
                  placeholder="Street/Block Lot/Barangay"
                  value={formData.houseAndWard}
                  onChange={handleInputChange}
                  className={error && !formData.houseAndWard ? "input-error" : ""}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="idNumber">ID Number</label>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  className={error && !formData.idNumber ? "input-error" : ""}
                />
              </div>

              <div className="form-group">
                <label htmlFor="districtAndProvince">District and Province</label>
                <input
                  type="text"
                  id="districtAndProvince"
                  name="districtAndProvince"
                  value={formData.districtAndProvince}
                  onChange={handleInputChange}
                  className={error && !formData.districtAndProvince ? "input-error" : ""}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="photoId">Photo of the valid ID</label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    id="photoId"
                    name="photoId"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <button 
                    type="button" 
                    className={`upload-button ${error && !formData.photoId ? "input-error" : ""}`}
                    onClick={() => document.getElementById('photoId').click()}
                  >
                    Upload Image
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <div className={`phone-input ${error && !formData.phoneNumber ? "input-error" : ""}`}>
                  <span className="phone-prefix">+63</span>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="phone-number-input"
                  />
                </div>
              </div>
            </div>

            <div className="submit-container">
              <button 
                type="submit" 
                className="submit-button" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ShopInfo;