import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { Button } from "../ui/button";
import { ArrowLeft, LogOut } from "lucide-react";

function SuperAdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    dispatch(logoutUser());
  }

  function handleBack() {
    dispatch(logoutUser());
    navigate("/auth/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-100 via-sky-200 to-indigo-200 text-slate-900">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm animate-in fade-in-0 slide-in-from-top-4">
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
                Superadmin panel
              </span>
            </div>
            <div className="font-bold text-xl tracking-tight bg-gradient-to-r from-sky-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
              Control Center
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-4 text-sm">
            <Link
              to="/super/dashboard"
              className={`px-3 py-1 rounded-full transition-colors duration-200 ${
                location.pathname.includes("/super/dashboard")
                  ? "bg-sky-500 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-sky-50"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/super/admins"
              className={`px-3 py-1 rounded-full transition-colors duration-200 ${
                location.pathname.includes("/super/admins")
                  ? "bg-sky-500 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-sky-50"
              }`}
            >
              Admins
            </Link>
            <Link
              to="/super/meta"
              className={`px-3 py-1 rounded-full transition-colors duration-200 ${
                location.pathname.includes("/super/meta")
                  ? "bg-sky-500 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-sky-50"
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
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default SuperAdminLayout;
