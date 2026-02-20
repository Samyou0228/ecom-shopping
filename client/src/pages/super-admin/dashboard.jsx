import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminSummary,
  fetchCategoriesAndBrands,
  fetchPendingAdmins,
} from "@/store/super-admin-slice";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  deleteFeatureImage,
  getFeatureImages,
} from "@/store/common-slice";
import { ShieldCheck, UserCheck, Users } from "lucide-react";

function SuperAdminDashboard() {
  const dispatch = useDispatch();
  const { adminSummary, categories, brands, pendingAdmins } =
    useSelector((state) => state.superAdmin);
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminSummary());
    dispatch(fetchCategoriesAndBrands());
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
    <div className="relative space-y-10 max-w-6xl mx-auto px-4 py-10 lg:py-12 animate-in fade-in-10 slide-in-from-bottom-4">
      <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 flex justify-center">
        <div className="h-40 w-40 md:h-64 md:w-64 rounded-full bg-gradient-to-r from-sky-500/60 via-sky-400/60 to-indigo-500/60 blur-3xl opacity-90 animate-ken-burns-slow" />
      </div>
      <div className="pointer-events-none absolute -right-10 bottom-10 -z-10">
        <div className="h-40 w-40 md:h-56 md:w-56 rounded-full bg-gradient-to-br from-sky-400/55 to-cyan-400/55 blur-3xl opacity-90 animate-pulse" />
      </div>
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 border border-emerald-200">
          <ShieldCheck className="w-4 h-4" />
          <span>Secure multi-admin control</span>
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-sky-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
            Superadmin Dashboard
          </h1>
          <p className="text-sm md:text-base text-slate-600 mt-2 max-w-2xl">
            Monitor admin approvals, organize your catalog, and curate homepage banners
            in one colorful, centralized view.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-pink-200 bg-[#ffd6f0] p-4 md:p-6 shadow-md">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="group border-2 border-pink-300 rounded-xl p-4 bg-[#ffd6f0] shadow-md hover:shadow-xl hover:border-pink-500 transform hover:-translate-y-2 hover:scale-[1.06] transition-all duration-500 ease-out animate-in fade-in-0 zoom-in-50">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Total admins
              </div>
              <div className="p-2 rounded-full bg-sky-100 text-sky-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <div className="text-3xl font-bold">{totalAdmins}</div>
              <span className="text-xs text-slate-500">registered</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500" />
            </div>
          </div>
          <div className="group border-2 border-pink-300 rounded-xl p-4 bg-[#ffd6f0] shadow-md hover:shadow-xl hover:border-emerald-500 transform hover:-translate-y-2 hover:scale-[1.06] transition-all duration-500 ease-out animate-in fade-in-0 zoom-in-50 delay-100">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Approved admins
              </div>
              <div className="p-2 rounded-full bg-emerald-50 text-emerald-600">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <div className="text-3xl font-bold">{approvedAdmins}</div>
              <span className="text-xs text-slate-500">active</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-emerald-500 to-lime-500" />
            </div>
          </div>
          <div className="group border-2 border-pink-300 rounded-xl p-4 bg-[#ffd6f0] shadow-md hover:shadow-xl hover:border-amber-500 transform hover:-translate-y-2 hover:scale-[1.06] transition-all duration-500 ease-out animate-in fade-in-0 zoom-in-50 delay-200">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Pending admins
              </div>
              <div className="p-2 rounded-full bg-amber-50 text-amber-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <div className="text-3xl font-bold">{pendingAdminsCount}</div>
              <span className="text-xs text-slate-500">awaiting approval</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start animate-in fade-in-0 slide-in-from-left-4 delay-100">
        <div className="border-2 border-pink-300 rounded-2xl p-4 md:p-5 space-y-4 bg-[#ffd6f0] shadow-md transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="h-6 w-1 rounded-full bg-gradient-to-b from-sky-400 to-indigo-500" />
            Homepage banner images
          </h2>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isCustomStyling={true}
          />
          <Button onClick={handleUploadFeatureImage} className="w-full mt-2">
            Upload banner
          </Button>
          <div className="mt-4 space-y-3">
            {featureImageList.map((item) => (
              <div
                key={item._id}
                className="group flex items-center justify-between gap-3 border border-slate-200 rounded-xl p-2 bg-slate-50 hover:bg-slate-100 transition-colors duration-300"
              >
                <div className="flex-1 h-16 overflow-hidden rounded-lg">
                  <img
                    src={item.image}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteFeatureImage(item._id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="border-2 border-pink-300 rounded-2xl p-4 md:p-5 space-y-3 bg-[#ffd6f0] shadow-md transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out animate-in fade-in-0 slide-in-from-right-4 delay-150">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="h-6 w-1 rounded-full bg-gradient-to-b from-pink-400 to-rose-500" />
            Preview
          </h2>
          <div className="group w-full h-48 md:h-64 lg:h-72 overflow-hidden rounded-xl bg-slate-100">
            {featureImageList && featureImageList.length > 0 ? (
              <img
                src={featureImageList[0].image}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 animate-ken-burns-slow"
              />
            ) : uploadedImageUrl ? (
              <img
                src={uploadedImageUrl}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 animate-ken-burns-slow"
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 animate-in fade-in-0 slide-in-from-bottom-4 delay-200">
        <div className="border-2 border-pink-300 rounded-2xl p-4 md:p-5 bg-[#ffd6f0] shadow-md transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Categories</h2>
            <span className="text-sm text-muted-foreground">
              {categories.length} total
            </span>
          </div>
          <ul className="space-y-1 max-h-52 overflow-auto">
            {categories.map((category) => (
              <li
                key={category._id}
                className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-pink-100 transition-colors duration-200"
              >
                <span className="text-sm text-slate-800">{category.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-2 border-pink-300 rounded-2xl p-4 md:p-5 bg-[#ffd6f0] shadow-md transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Brands</h2>
            <span className="text-sm text-muted-foreground">
              {brands.length} total
            </span>
          </div>
          <ul className="space-y-1 max-h-52 overflow-auto">
            {brands.map((brand) => (
              <li
                key={brand._id}
                className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-pink-100 transition-colors duration-200"
              >
                <span className="text-sm text-slate-800">{brand.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-2 border-pink-300 rounded-2xl p-4 md:p-5 bg-[#ffd6f0] shadow-md transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out animate-in fade-in-0 slide-in-from-bottom-4 delay-300">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Latest pending admins</h2>
          <span className="text-sm text-muted-foreground">
            {pendingAdmins.length} pending
          </span>
        </div>
        {pendingAdmins.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No admin registrations waiting for approval.
          </p>
        ) : (
          <ul className="space-y-1">
            {pendingAdmins.slice(0, 5).map((admin) => (
              <li key={admin._id} className="text-sm">
                {admin.userName} – {admin.email}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
