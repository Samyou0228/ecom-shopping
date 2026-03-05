import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex items-center justify-center bg-black w-1/2 px-12">
        <div className="max-w-md space-y-6 text-center text-primary-foreground">
          <img 
            src="/logo (2).png" 
            alt="Logo" 
            className="h-32 w-auto object-contain mx-auto"
          />
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome to ECommerce Shopping
          </h1>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:hidden mb-8">
          <img 
            src="/logo (2).png" 
            alt="Logo" 
            className="h-20 w-auto object-contain mx-auto"
          />
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
