import React, { useEffect } from "react";
import NavbarOwner from "../../components/owner/NavbarOwner";
import Sidebar from "../../components/owner/Sidebar";
import { Outlet } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const Layout = () => {
  const { isOwner, token, navigate } = useAppContext();

  useEffect(() => {
 
    if (token && !isOwner) {
      navigate("/");
    }
  }, [token, isOwner]);

  return (
    <div className="flex flex-col">
      <NavbarOwner />
      <div className="flex">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
