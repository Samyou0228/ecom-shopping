import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, MapPin, Shield, Star, CreditCard, Settings } from "lucide-react";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

function ShoppingAccount() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80"></div>
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <div className="flex items-center gap-6 mb-4">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                <User className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-5xl font-bold mb-2">My Account</h1>
                <p className="text-xl text-white/90">Manage your shopping experience with ease</p>
              </div>
            </div>
            <div className="flex items-center gap-8 text-sm text-white/80">
              <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <Shield className="w-4 h-4" />
                Secure & Private
              </span>
              <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <Star className="w-4 h-4" />
                Premium Experience
              </span>
              <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <Settings className="w-4 h-4" />
                Easy Management
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            {/* Tab Navigation */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800">Account Management</h2>
                    <p className="text-slate-600 text-lg">Manage your orders, addresses, and account settings</p>
                  </div>
                  <div className="hidden lg:flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-3 rounded-full">
                      <Package className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-slate-700">Order Tracking</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-3 rounded-full">
                      <MapPin className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-slate-700">Secure Storage</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="flex bg-slate-50 border-b border-slate-200 p-2">
                <TabsTrigger 
                  value="orders" 
                  className="flex items-center gap-3 px-8 py-4 rounded-lg text-slate-700 font-semibold text-lg transition-all duration-300 hover:bg-white hover:shadow-sm transform hover:scale-105"
                >
                  <Package className="w-6 h-6" />
                  Order History
                </TabsTrigger>
                <TabsTrigger 
                  value="address" 
                  className="flex items-center gap-3 px-8 py-4 rounded-lg text-slate-700 font-semibold text-lg transition-all duration-300 hover:bg-white hover:shadow-sm transform hover:scale-105"
                >
                  <MapPin className="w-6 h-6" />
                  Saved Addresses
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders" className="p-8">
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">Order History</h3>
                      <p className="text-slate-600 text-lg">Track and manage your recent orders</p>
                    </div>
                    <div className="lg:hidden flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full">
                      <Package className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-slate-700">Active Orders</span>
                    </div>
                  </div>
                  <ShoppingOrders />
                </div>
              </TabsContent>
              
              <TabsContent value="address" className="p-8">
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">Saved Addresses</h3>
                      <p className="text-slate-600 text-lg">Manage your delivery addresses</p>
                    </div>
                    <div className="lg:hidden flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-slate-700">Secure Storage</span>
                    </div>
                  </div>
                  <Address />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
