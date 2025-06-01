// src/layouts/DefaultLayout.jsx
import { Outlet } from "react-router-dom";

function DefaultLayout() {
  return (
    <div className="min-h-screen bg-gray-90 p">
      
      <Outlet />
    </div>
  );
}

export default DefaultLayout;
