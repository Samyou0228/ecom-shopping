import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { Button } from "../ui/button";
import { ArrowLeft, LogOut, Menu, Home, ShoppingBag, ShoppingCart, User, X, ShoppingBasket, Sparkles } from "lucide-react";

function ShoppingLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    dispatch(logoutUser());
    navigate("/auth/login");
  }

  function handleBack() {
    dispatch(logoutUser());
    navigate("/auth/login");
  }

  const navItems = [
    { path: "/shop/home", label: "Home", icon: Home },
    { path: "/shop/listing", label: "Products", icon: ShoppingBag },
    { path: "/shop/cart", label: "Cart", icon: ShoppingCart },
    { path: "/shop/account", label: "Account", icon: User },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <img 
              src="/logo (2).png" 
              alt="Logo" 
              className="h-10 w-auto object-contain"
            />
            <div>
              <div className="font-bold text-lg">Shopping</div>
              <div className="text-xs text-slate-400">Dashboard</div>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
          
          {/* Logout in nav bar */}
          <Link
            to="/auth/login"
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-red-400 hover:bg-red-500/10 hover:text-red-300 mt-4 border-t border-slate-700 pt-6"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </Link>
        </nav>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white z-50 transform transition-transform duration-300 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo (2).png" 
              alt="Logo" 
              className="h-10 w-auto object-contain"
            />
            <div>
              <div className="font-bold text-lg">Shopping</div>
              <div className="text-xs text-slate-400">Dashboard</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
          
          {/* Logout in nav bar - mobile */}
          <Link
            to="/auth/login"
            onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-red-400 hover:bg-red-500/10 hover:text-red-300 mt-4 border-t border-slate-700 pt-6"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white shadow-md">
          <button
            onClick={() => setSidebarOpen(true)}
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

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ShoppingLayout;
