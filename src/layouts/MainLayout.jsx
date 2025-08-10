import React from "react";

// Router
import { Outlet } from "react-router-dom";

// Components
import Header from "../components/Header";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Outlet />
    </div>
  );
};

export default MainLayout;
