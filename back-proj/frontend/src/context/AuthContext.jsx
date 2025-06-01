import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userImage, setUserImage] = useState(() => localStorage.getItem("userImage") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    const savedImage = localStorage.getItem("userImage");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }

    if (savedImage) {
      setUserImage(savedImage);
    }

    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);

    // Save and set profile image if available
    if (userData.profile_image) {
      const imageUrl = userData.profile_image.startsWith("http")
        ? userData.profile_image
        : `http://localhost:8000/storage/${userData.profile_image}`;
      localStorage.setItem("userImage", imageUrl);
      setUserImage(imageUrl);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userImage");
    setUser(null);
    setToken(null);
    setUserImage("");
  };

  const updateUserImage = (imgUrl) => {
    localStorage.setItem("userImage", imgUrl);
    setUserImage(imgUrl);

    setUser((prev) => {
      if (!prev) return prev;
      const updatedUser = { ...prev, profile_image: imgUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  // ✅ Add this function to re-fetch the authenticated user
  const refreshUser = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));

      // If profile image exists, update image context/localStorage
      if (res.data.profile_image) {
        const imageUrl = res.data.profile_image.startsWith("http")
          ? res.data.profile_image
          : `http://localhost:8000/storage/${res.data.profile_image}`;
        localStorage.setItem("userImage", imageUrl);
        setUserImage(imageUrl);
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        userImage,
        updateUserImage,
        setUser, // also expose if you want to manually set it
        refreshUser, // ✅ make refreshUser available in context
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
