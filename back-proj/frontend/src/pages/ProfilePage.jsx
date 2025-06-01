import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useDropzone } from "react-dropzone";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function ProfilePage() {
  const { user, token, updateUserImage } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [image, setImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 / 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imgRef, setImgRef] = useState(null);

  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [lastEditDate, setLastEditDate] = useState(null);
  const [canEdit, setCanEdit] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState("");

  // Original values to revert if cancelled
  const [originalValues, setOriginalValues] = useState({});

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:8000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const data = res.data;
          const profileData = {
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            email: data.email || "",
            phone_number: data.phone_number || "",
            gender: data.gender || "",
            dob: data.dob || "",
          };

          setFirstName(profileData.first_name);
          setLastName(profileData.last_name);
          setEmail(profileData.email);
          setPhoneNumber(profileData.phone_number);
          setGender(profileData.gender);
          setDateOfBirth(profileData.dob);

          // Check last edit date
          if (data.last_profile_edit) {
            const lastEdit = new Date(data.last_profile_edit);
            setLastEditDate(lastEdit);
            checkEditPermission(lastEdit);
          }

          if (data.profile_image) {
            const imageUrl = data.profile_image.startsWith("http")
              ? data.profile_image
              : `http://localhost:8000/storage/${data.profile_image}`;
            setExistingImageUrl(imageUrl);
            updateUserImage(imageUrl);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch profile:", err);
        });
    }
  }, [token, updateUserImage]);

  // Check if user can edit (6 days cooldown)
  const checkEditPermission = (lastEdit) => {
    if (!lastEdit) {
      setCanEdit(true);
      return;
    }

    const now = new Date();
    const diffTime = now - lastEdit;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 6) {
      setCanEdit(true);
      setTimeRemaining("");
    } else {
      setCanEdit(false);
      const remainingDays = 6 - diffDays;
      setTimeRemaining(`${remainingDays} day${remainingDays !== 1 ? 's' : ''}`);
    }
  };

  // Update time remaining every hour
  useEffect(() => {
    if (lastEditDate && !canEdit) {
      const interval = setInterval(() => {
        checkEditPermission(lastEditDate);
      }, 3600000); // Check every hour

      return () => clearInterval(interval);
    }
  }, [lastEditDate, canEdit]);

  const handleEditClick = () => {
    if (!canEdit) return;
    
    // Store original values for cancel functionality
    setOriginalValues({
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      dateOfBirth,
    });
    
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // Revert to original values
    setFirstName(originalValues.firstName);
    setLastName(originalValues.lastName);
    setEmail(originalValues.email);
    setPhoneNumber(originalValues.phoneNumber);
    setGender(originalValues.gender);
    setDateOfBirth(originalValues.dateOfBirth);
    
    // Reset image states
    setImage(null);
    setPreviewUrl(null);
    setCompletedCrop(null);
    
    setIsEditing(false);
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (!isEditing) return;
    
    const file = acceptedFiles[0];
    if (file && file.size > 10 * 1024 * 1024) {
      alert("Image must be less than 10MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
      setImage(file);
    };
    reader.readAsDataURL(file);
  }, [isEditing]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 10 * 1024 * 1024,
    disabled: !isEditing,
  });

  const handleImageLoaded = useCallback((img) => {
    setImgRef(img);
  }, []);

  const getCroppedImage = () => {
    if (!completedCrop || !imgRef) return;

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.naturalWidth / imgRef.width;
    const scaleY = imgRef.naturalHeight / imgRef.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      imgRef,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
        resolve(file);
      }, "image/jpeg", 1);
    });
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("phone_number", phoneNumber);
    formData.append("gender", gender);
    formData.append("dob", dateOfBirth);

    if (previewUrl && completedCrop) {
      const croppedImage = await getCroppedImage();
      formData.append("profile_image", croppedImage);
    } else if (image) {
      formData.append("profile_image", image);
    }

    axios
      .post("http://localhost:8000/api/profile?_method=PUT", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        alert("Profile updated successfully!");
        const now = new Date();
        setLastEditDate(now);
        setIsEditing(false);
        setCanEdit(false);
        checkEditPermission(now);
        
        if (res.data.user?.profile_image) {
          const imageUrl = res.data.user.profile_image.startsWith("http")
            ? res.data.user.profile_image
            : `http://localhost:8000/storage/${res.data.user.profile_image}`;
          setExistingImageUrl(imageUrl);
          updateUserImage(imageUrl);
        }

        // Reset image states
        setImage(null);
        setPreviewUrl(null);
        setCompletedCrop(null);
      })
      .catch((err) => {
        console.error("Failed to update profile:", err.response?.data);
        alert("Failed to update profile.");
      });
  };

  return (
    <div className="flex flex-col overflow-hidden w-screen h-screen font-sans">
      <Navbar />
      <main className="flex-1 overflow-auto bg-[#FAEBD7] p-8 flex justify-center items-start">
        <section className="w-full max-w-4xl bg-white rounded-xl shadow-md border border-black">
          <header className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-medium text-gray-800">Profile Information</h2>
            {!isEditing && (
              <div className="flex items-center gap-4">
                {!canEdit && (
                  <span className="text-sm text-red-600">
                    Can edit again in {timeRemaining}
                  </span>
                )}
                <button
                  onClick={handleEditClick}
                  disabled={!canEdit}
                  className={`px-4 py-2 rounded text-sm font-medium ${
                    canEdit
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Edit Profile
                </button>
              </div>
            )}
            {isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-white bg-[#213567] rounded hover:bg-[#1a2c4d] text-sm font-medium"
                >
                  Save Changes
                </button>
              </div>
            )}
          </header>

          <div className="p-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col w-1/2">
                <label className="mb-1 text-sm font-semibold text-gray-700 pl-3">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 text-black border border-gray-300 rounded-lg ${
                    !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                  }`}
                />
              </div>
              <div className="flex flex-col w-1/2">
                <label className="mb-1 text-sm font-semibold text-gray-700 pl-3">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 text-black border border-gray-300 rounded-lg ${
                    !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                  }`}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-semibold text-gray-700 pl-3">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3 py-2 text-black bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-semibold text-gray-700 pl-3">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                disabled={!isEditing}
                className={`w-full px-3 py-2 text-black border border-gray-300 rounded-lg ${
                  !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                }`}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col w-1/2">
                <label className="mb-1 text-sm font-semibold text-gray-700 pl-3">Gender</label>
                <input
                  type="text"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 text-black border border-gray-300 rounded-lg ${
                    !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                  }`}
                />
              </div>
              <div className="flex flex-col w-1/2">
                <label className="mb-1 text-sm font-semibold text-gray-700 pl-3">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 text-black border border-gray-300 rounded-lg ${
                    !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                  }`}
                />
              </div>
            </div>

            {/* Profile Image Section */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-semibold text-gray-700 pl-3">Profile Picture</label>
              <div className="flex justify-center">
                <div className="w-64 h-64 border-2 border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center p-6">
                  {/* Image Display */}
                  <div className="w-32 h-32 mb-4 rounded-full border-2 border-gray-300 overflow-hidden bg-white flex items-center justify-center">
                    {(previewUrl || existingImageUrl) ? (
                      <img
                        src={previewUrl || existingImageUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Select Image Button */}
                  {isEditing && (
                    <div {...getRootProps()} className="cursor-pointer">
                      <input {...getInputProps()} />
                      <button
                        type="button"
                        className="px-6 py-2 bg-[#213567] text-white text-sm font-medium rounded hover:bg-[#1a2c4d] transition-colors"
                      >
                        Select Image
                      </button>
                    </div>
                  )}
                  
                  {!isEditing && !existingImageUrl && !previewUrl && (
                    <div className="text-gray-500 text-sm text-center">
                      No profile picture set
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Image Cropping Section */}
            {previewUrl && isEditing && completedCrop && (
              <div className="flex flex-col items-center">
                <label className="mb-2 text-sm font-semibold text-gray-700">Crop Your Image</label>
                <div className="max-w-md">
                  <ReactCrop
                    src={previewUrl}
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    onImageLoaded={handleImageLoaded}
                    aspect={1}
                    circularCrop
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProfilePage;