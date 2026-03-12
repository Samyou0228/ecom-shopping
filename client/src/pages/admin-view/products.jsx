import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesAndBrands } from "@/store/super-admin-slice";
import { ShoppingBag } from "lucide-react";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    featured: false,
    searchTerm: ""
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { productList } = useSelector((state) => state.adminProducts);
  const { categories, brands } = useSelector((state) => state.superAdmin);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Filter products based on admin filters
  const filteredProducts = productList?.filter(product => {
    const categoryMatch = !filters.category || product.category === filters.category;
    const brandMatch = !filters.brand || product.brand === filters.brand;
    const featuredMatch = !filters.featured || product.featured;
    const searchMatch = !searchTerm || 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product._id.includes(searchTerm);
    return categoryMatch && brandMatch && featuredMatch && searchMatch;
  }) || [];

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          console.log(data, "edit");

          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({
              title: "Product add successfully",
            });
          }
        });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function handleFilterChange(filterType, value) {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }

  function handleClearFilters() {
    setFilters({
      category: "",
      brand: "",
      featured: false
    });
  }

function isFormValid() {
    const optionalFields = ['description', 'salePrice', 'totalStock'];
    const requiredFields = Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview" && !optionalFields.includes(currentKey))
      .map((key) => formData[key] !== "")
      .every((item) => item);
    return requiredFields;
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCategoriesAndBrands());
  }, [dispatch]);

  const dynamicFormControls = useMemo(
    () =>
      addProductFormElements.map((control) => {
        if (control.name === "category") {
          return {
            ...control,
            options: categories.map((category) => ({
              id: category.slug,
              label: category.name,
            })),
          };
        }
        if (control.name === "brand") {
          return {
            ...control,
            options: brands.map((brand) => ({
              id: brand.slug,
              label: brand.name,
            })),
          };
        }
        return control;
      }),
    [categories, brands]
  );

  return (
    <Fragment>
      {/* Filter Controls */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden mb-6">
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Search Products</label>
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Brand</label>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand.slug} value={brand.slug}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.featured}
                  onChange={(e) => handleFilterChange('featured', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Featured Only</span>
              </label>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-600">
              Showing {filteredProducts.length} of {productList?.length || 0} products
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setOpenCreateProductsDialog(true)}>
                Add New Product
              </Button>
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
                className="border-slate-300 hover:bg-slate-50"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts && filteredProducts.length > 0
          ? filteredProducts.map((productItem) => (
              <AdminProductTile
                key={productItem?._id}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
                openDetailsModal={(product) => {
                  setSelectedProduct(product);
                  setShowDetailsModal(true);
                }}
              />
            ))
          : (
            <div className="col-span-full text-center py-8">
              <div className="bg-gradient-to-br from-slate-200 to-slate-300 p-6 rounded-xl inline-block shadow-lg">
                <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No products found</h3>
                <p className="text-sm text-slate-500">Try adjusting your filters or add new products</p>
              </div>
            </div>
        )}
      </div>

      {/* Product Details Modal */}
      <Sheet open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <SheetContent side="right" className="w-[425px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Product Details</SheetTitle>
          </SheetHeader>
          {selectedProduct && (
            <div className="space-y-6 py-4">
              <div className="aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">{selectedProduct.title}</h2>
                <p className="text-slate-600 leading-relaxed mb-6">{selectedProduct.description || 'No description available.'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-500">Category</span>
                      <span className="font-semibold text-slate-900 capitalize">{selectedProduct.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-500">Brand</span>
                      <span className="font-semibold text-slate-900 capitalize">{selectedProduct.brand}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-500">Stock</span>
                      <span className="font-semibold text-slate-900">{selectedProduct.totalStock || 0}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-500">Price</span>
                      <span className="text-2xl font-bold text-primary">${selectedProduct.price}</span>
                    </div>
                    {selectedProduct.salePrice > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500">Sale Price</span>
                        <span className="text-xl font-bold text-green-600 line-through">${selectedProduct.price}</span>
                        <span className="text-2xl font-bold text-green-600">${selectedProduct.salePrice}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-500">Avg Rating</span>
                      <span className="font-semibold text-amber-600">{(selectedProduct.averageReview || 0).toFixed(1)} / 5</span>
                    </div>
                  </div>
                </div>
              </div>
                <div className="pt-6 border-t border-slate-200 space-y-1 text-xs text-slate-500">
                  <div>ID: {selectedProduct._id}</div>
                </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={dynamicFormControls}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
