import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { Button } from "../ui/button";
import { ArrowLeft, LogOut } from "lucide-react";

function SuperAdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logoutUser());
  }

  function handleBack() {
    dispatch(logoutUser());
    navigate("/auth/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBack}
            className="hidden sm:inline-flex"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="font-bold text-xl">Superadmin</div>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-4">
            <Link to="/super/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/super/admins" className="hover:underline">
              Admins
            </Link>
            <Link to="/super/meta" className="hover:underline">
              Categories & Brands
            </Link>
          </nav>
          <Button
            onClick={handleLogout}
            className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
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
