import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBrand, fetchCategoriesAndBrands } from "@/store/super-admin-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Plus, Tag } from "lucide-react";

function SuperAdminMeta() {
  const dispatch = useDispatch();
  const { brands } = useSelector((state) => state.superAdmin);
  const [brandName, setBrandName] = useState("");

  useEffect(() => {
    dispatch(fetchCategoriesAndBrands());
  }, [dispatch]);

  function handleAddBrand(event) {
    event.preventDefault();
    if (!brandName.trim()) return;
    dispatch(createBrand({ name: brandName.trim() }));
    setBrandName("");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          Brands Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">Add, view, and manage your product brands</p>
      </div>

      {/* Add Brand Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Brand
          </h2>
        </div>
        
        <div className="p-5">
          <div className="flex gap-4 max-w-xl">
            <Input
              placeholder="Enter brand name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="h-11 border-slate-200 focus:border-purple-500"
            />
            <Button 
              onClick={handleAddBrand}
              disabled={!brandName.trim()}
              className="h-11 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Brand
            </Button>
          </div>
        </div>
      </div>

      {/* Brands List */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              All Brands
            </h2>
            <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
              {brands.length} Brands
            </span>
          </div>
        </div>
        
        <div className="p-5">
          {brands.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <Building2 className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Brands Yet</h3>
              <p className="text-slate-500">Add your first brand using the form above</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brands.map((brand, index) => (
                <div 
                  key={brand._id}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  {/* Colorful top bar */}
                  <div className={`h-2 bg-gradient-to-r ${
                    index % 5 === 0 ? 'from-purple-400 to-pink-600' :
                    index % 5 === 1 ? 'from-blue-400 to-cyan-600' :
                    index % 5 === 2 ? 'from-emerald-400 to-teal-600' :
                    index % 5 === 3 ? 'from-orange-400 to-red-600' :
                    'from-indigo-400 to-blue-600'
                  }`}></div>
                  
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 truncate">{brand.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">Brand</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminMeta;
