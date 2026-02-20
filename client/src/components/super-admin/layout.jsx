import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { Button } from "../ui/button";
import { ArrowLeft, LogOut, Menu } from "lucide-react";

function SuperAdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    dispatch(logoutUser());
  }

  function handleBack() {
    dispatch(logoutUser());
    navigate("/auth/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-100 via-sky-200 to-indigo-200 text-slate-900">
      <header className="flex items-center justify-between px-6 py-4 border-b border-pink-300 bg-gradient-to-r from-pink-100 via-pink-200 to-rose-200/90 backdrop-blur-md shadow-sm animate-in fade-in-0 slide-in-from-top-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBack}
            className="hidden sm:inline-flex border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-600">
                Superadmin
              </span>
            </div>
            <div className="font-bold text-xl tracking-tight bg-gradient-to-r from-sky-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
              Superadmin Dashboard
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-full border border-pink-200 bg-white/80 text-pink-600 hover:bg-pink-50 shadow-sm p-2 transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <Menu className="w-4 h-4" />
          </button>
          <nav className="hidden md:flex gap-4 text-sm bg-gradient-to-br from-white via-pink-100 to-rose-100 px-2 py-1 rounded-full border border-pink-200 shadow-sm">
            <Link
              to="/super/dashboard"
              className={`px-3 py-1 rounded-full transition-all duration-200 hover:scale-105 ${
                location.pathname.includes("/super/dashboard")
                  ? "bg-pink-200 text-pink-900 border border-pink-300 shadow-md"
                  : "text-slate-700 hover:text-pink-800 hover:bg-pink-100"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/super/admins"
              className={`px-3 py-1 rounded-full transition-all duration-200 hover:scale-105 ${
                location.pathname.includes("/super/admins")
                  ? "bg-pink-200 text-pink-900 border border-pink-300 shadow-md"
                  : "text-slate-700 hover:text-pink-800 hover:bg-pink-100"
              }`}
            >
              Admins
            </Link>
            <Link
              to="/super/meta"
              className={`px-3 py-1 rounded-full transition-all duration-200 hover:scale-105 ${
                location.pathname.includes("/super/meta")
                  ? "bg-pink-200 text-pink-900 border border-pink-300 shadow-md"
                  : "text-slate-700 hover:text-pink-800 hover:bg-pink-100"
              }`}
            >
              Categories & Brands
            </Link>
          </nav>
          <Button
            onClick={handleLogout}
            className="inline-flex gap-2 items-center rounded-full px-4 py-2 text-sm font-medium shadow-md bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 hover:from-rose-400 hover:via-fuchsia-400 hover:to-indigo-400 text-white"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>
      <div
        className={`md:hidden fixed inset-x-4 top-20 z-40 rounded-2xl border border-pink-200 bg-gradient-to-br from-white via-pink-100 to-rose-100 backdrop-blur-lg shadow-xl transition-all duration-300 ${
          mobileOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col gap-2 p-4 text-sm">
          <Link
            to="/super/dashboard"
            className={`px-3 py-2 rounded-xl transition-all duration-200 ${
              location.pathname.includes("/super/dashboard")
                ? "bg-pink-200 text-pink-900 border border-pink-300 shadow-md"
                : "text-slate-700 hover:text-pink-800 hover:bg-pink-100"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/super/admins"
            className={`px-3 py-2 rounded-xl transition-all duration-200 ${
              location.pathname.includes("/super/admins")
                ? "bg-pink-200 text-pink-900 border border-pink-300 shadow-md"
                : "text-slate-700 hover:text-pink-800 hover:bg-pink-100"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            Admins
          </Link>
          <Link
            to="/super/meta"
            className={`px-3 py-2 rounded-xl transition-all duration-200 ${
              location.pathname.includes("/super/meta")
                ? "bg-pink-200 text-pink-900 border border-pink-300 shadow-md"
                : "text-slate-700 hover:text-pink-800 hover:bg-pink-100"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            Categories &amp; Brands
          </Link>
        </nav>
      </div>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default SuperAdminLayout;
