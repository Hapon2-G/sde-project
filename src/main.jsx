import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import CreateAccount from "./CreateAccount";
import CreateAccount2 from "./CreateAccount2";
import BuyerDashboard from "./buyerDashboard";
import App from "./App.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import ProfilePage from "./ProfilePage.jsx";
import ProfilePage2 from "./ProfilePage2.jsx";
import AddressPage from "./Address.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<App/>} />
        <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/create-account-2" element={<CreateAccount2 />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile2" element={<ProfilePage2 />} />
        <Route path="/address" element={<AddressPage />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>
);
