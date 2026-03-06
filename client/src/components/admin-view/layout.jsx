import { Outlet, useLocation } from "react-router-dom";
import AdminSideBar from "./sidebar";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { Button } from "../ui/button";
import { ArrowLeft, LogOut, Menu, X } from "lucide-react";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const location = useLocation();

  function handleLogout() {
    dispatch(logoutUser());
    window.location.href = "/auth/login";
  }

  function handleBack() {
    dispatch(logoutUser());
    window.location.href = "/auth/login";
  }

  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white shadow-md">
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200"
      >
        <Menu className="w-6 h-6 text-slate-700" />
      </button>
      <img 
        src="/logo (2).png" 
        alt="Logo" 
        className="h-8 w-auto object-contain"
      />
      <button
        onClick={handleBack}
        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200"
      >
        <ArrowLeft className="w-5 h-5 text-slate-700" />
      </button>
    </header>
  );
}

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
    window.location.href = "/auth/login";
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar - Desktop */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
      
      {/* Mobile Sidebar Overlay */}
      {openSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpenSidebar(false)}
        />
      )}

      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <AdminHeader setOpen={setOpenSidebar} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
