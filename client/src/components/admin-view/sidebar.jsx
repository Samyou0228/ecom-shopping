import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
  LogOut,
  Home,
  ShoppingBag,
  ShoppingCart,
  User,
  ArrowLeft
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <Home />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBag />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
    navigate("/auth/login");
  }

  return (
    <nav className="flex-1 p-4 space-y-2">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = window.location.pathname.includes(menuItem.path);
        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              setOpen ? setOpen(false) : null;
            }}
            className={`flex cursor-pointer items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30"
                : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
            }`}
          >
            {menuItem.icon}
            <span className="font-medium">{menuItem.label}</span>
          </div>
        );
      })}
      
      {/* Logout in nav bar */}
      <div
        onClick={() => {
          handleLogout();
          setOpen ? setOpen(false) : null;
        }}
        className="flex cursor-pointer items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-red-400 hover:bg-red-500/10 hover:text-red-300 mt-4 border-t border-slate-700 pt-6"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </div>
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
    navigate("/auth/login");
  }

  function handleBack() {
    dispatch(logoutUser());
    navigate("/auth/login");
  }

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b border-slate-700">
              <SheetTitle className="flex gap-3 mt-5 mb-5">
                <img 
                  src="/logo (2).png" 
                  alt="Logo" 
                  className="h-10 w-auto object-contain"
                />
                <div>
                  <div className="font-bold text-lg">Admin</div>
                  <div className="text-xs text-slate-400">Dashboard</div>
                </div>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-64 flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl lg:flex">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <img 
              src="/logo (2).png" 
              alt="Logo" 
              className="h-10 w-auto object-contain"
            />
            <div>
              <div className="font-bold text-lg">Admin</div>
              <div className="text-xs text-slate-400">Dashboard</div>
            </div>
          </div>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
