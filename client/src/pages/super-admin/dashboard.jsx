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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Superadmin Dashboard</h1>
      <p className="text-muted-foreground">
        Overview of admin registrations and store metadata.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="border rounded-md p-4">
          <div className="text-sm text-muted-foreground">Total admins</div>
          <div className="text-2xl font-bold mt-2">{totalAdmins}</div>
        </div>
        <div className="border rounded-md p-4">
          <div className="text-sm text-muted-foreground">Approved admins</div>
          <div className="text-2xl font-bold mt-2">{approvedAdmins}</div>
        </div>
        <div className="border rounded-md p-4">
          <div className="text-sm text-muted-foreground">Pending admins</div>
          <div className="text-2xl font-bold mt-2">{pendingAdminsCount}</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start">
        <div className="border rounded-md p-4 space-y-4">
          <h2 className="text-lg font-semibold">Homepage banner images</h2>
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
                className="flex items-center justify-between gap-3 border rounded-md p-2"
              >
                <div className="flex-1 h-16 overflow-hidden rounded">
                  <img
                    src={item.image}
                    className="w-full h-full object-cover"
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
        <div className="border rounded-md p-4 space-y-3">
          <h2 className="text-lg font-semibold">Preview</h2>
          <div className="w-full h-48 md:h-64 lg:h-72 overflow-hidden rounded-md bg-muted">
            {featureImageList && featureImageList.length > 0 ? (
              <img
                src={featureImageList[0].image}
                className="w-full h-full object-cover"
              />
            ) : uploadedImageUrl ? (
              <img
                src={uploadedImageUrl}
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Categories</h2>
            <span className="text-sm text-muted-foreground">
              {categories.length} total
            </span>
          </div>
          <ul className="list-disc list-inside space-y-1 max-h-52 overflow-auto">
            {categories.map((category) => (
              <li key={category._id}>{category.name}</li>
            ))}
          </ul>
        </div>
        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Brands</h2>
            <span className="text-sm text-muted-foreground">
              {brands.length} total
            </span>
          </div>
          <ul className="list-disc list-inside space-y-1 max-h-52 overflow-auto">
            {brands.map((brand) => (
              <li key={brand._id}>{brand.name}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border rounded-md p-4">
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
