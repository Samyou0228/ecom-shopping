import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminSummary,
  fetchPendingAdmins,
} from "@/store/super-admin-slice";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  deleteFeatureImage,
  getFeatureImages,
} from "@/store/common-slice";
import { ShieldCheck, UserCheck, Users, Image, Trash2 } from "lucide-react";

function SuperAdminDashboard() {
  const dispatch = useDispatch();
  const { adminSummary, pendingAdmins } = useSelector((state) => state.superAdmin);
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminSummary());
    dispatch(fetchPendingAdmins());
    dispatch(getFeatureImages());
  }, [dispatch]);

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) return;
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  function handleDeleteFeatureImage(id) {
    dispatch(deleteFeatureImage(id));
  }

  const totalAdmins = adminSummary?.totalAdmins ?? 0;
  const approvedAdmins = adminSummary?.approvedAdmins ?? 0;
  const pendingAdminsCount = adminSummary?.pendingAdmins ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Welcome back!</h1>
        <p className="text-sm text-slate-500">Here's your platform overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-white shadow-lg">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -left-2 -bottom-2 w-16 h-16 bg-white/5 rounded-full"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-6 h-6" />
              <span className="text-3xl font-bold">{totalAdmins}</span>
            </div>
            <div className="text-sm text-blue-100 font-medium">Total Admins</div>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 text-white shadow-lg">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -left-2 -bottom-2 w-16 h-16 bg-white/5 rounded-full"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <UserCheck className="w-6 h-6" />
              <span className="text-3xl font-bold">{approvedAdmins}</span>
            </div>
            <div className="text-sm text-emerald-100 font-medium">Approved Admins</div>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-5 text-white shadow-lg">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -left-2 -bottom-2 w-16 h-16 bg-white/5 rounded-full"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <ShieldCheck className="w-6 h-6" />
              <span className="text-3xl font-bold">{pendingAdminsCount}</span>
            </div>
            <div className="text-sm text-amber-100 font-medium">Pending Requests</div>
          </div>
        </div>
      </div>

      {/* Banner Management */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500">
              <Image className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Homepage Banners</h2>
              <p className="text-sm text-slate-500">Manage your featured images</p>
            </div>
          </div>
        </div>
        
        <div className="p-5">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="space-y-4">
              <ProductImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                setImageLoadingState={setImageLoadingState}
                imageLoadingState={imageLoadingState}
                isCustomStyling={true}
              />
              <Button 
                onClick={handleUploadFeatureImage} 
                disabled={!uploadedImageUrl}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-sm h-10"
              >
                Upload Banner
              </Button>
            </div>
            
            {/* Preview Section */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Preview ({featureImageList.length} banners)</h3>
              <div className="grid grid-cols-2 gap-3">
                {featureImageList.slice(0, 4).map((item) => (
                  <div key={item._id} className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 shadow-md group">
                    <img src={item.image} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleDeleteFeatureImage(item._id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {featureImageList.length === 0 && (
                  <div className="col-span-2 aspect-video rounded-xl bg-slate-100 flex flex-col items-center justify-center">
                    <Image className="w-12 h-12 text-slate-300 mb-2" />
                    <p className="text-sm text-slate-400">No banners uploaded</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Admins */}
      {pendingAdmins.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Pending Admin Requests</h2>
                  <p className="text-sm text-slate-500">{pendingAdmins.length} awaiting approval</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-sm font-medium">
                {pendingAdmins.length} Pending
              </span>
            </div>
          </div>
          <div className="p-5">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {pendingAdmins.slice(0, 6).map((admin) => (
                <div key={admin._id} className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                      {admin.userName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{admin.userName}</div>
                      <div className="text-xs text-slate-500">{admin.email}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminDashboard;
