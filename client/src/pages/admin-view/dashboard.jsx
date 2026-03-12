import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "@/store/admin/products-slice";
import { getFeatureImages } from "@/store/common-slice";
import { fetchCategoriesAndBrands } from "@/store/super-admin-slice";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, ShirtIcon, ShoppingBasket, ShoppingBag, Star, TrendingUp, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AdminProductTile from "@/components/admin-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";

const DefaultCategoryIcon = ShirtIcon;
const defaultBrandIcon = ShoppingBasket;

function AdminDashboard() {
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.adminProducts);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { categories, brands } = useSelector((state) => state.superAdmin);
  const { toast } = useToast();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    featured: false,
    searchTerm: ""
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Stats for admin dashboard
  const adminStats = {
    totalProducts: productList?.length || 0,
    featuredProducts: productList?.filter(p => p.featured)?.length || 0,
    totalCategories: categories?.length || 0
  };

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

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    window.location.href = `/shop/listing`;
  }

  function handleGetProductDetails(getCurrentProductId) {
    // For admin dashboard, we can show product details without fetching
    const product = productList.find(p => p._id === getCurrentProductId);
    if (product) {
      // Create a mock product details object for the dialog
      const mockProductDetails = {
        ...product,
        reviews: [] // Admin doesn't need reviews in dashboard
      };
      setProductDetails(mockProductDetails);
      setOpenDetailsDialog(true);
    }
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

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  useEffect(() => {
    if (!featureImageList || featureImageList.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(fetchCategoriesAndBrands());
  }, [dispatch]);

  const categoriesWithImage = categories.map((category) => ({
    id: category.slug,
    label: category.name,
    image: category.image,
  }));

  const brandsWithIcon = brands.map((brand) => ({
    id: brand.slug,
    label: brand.name,
    icon: defaultBrandIcon,
  }));

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-blue-500" />
          <h1 className="text-3xl font-bold text-slate-800">Welcome to Admin Dashboard!</h1>
          <Sparkles className="w-6 h-6 text-blue-500" />
        </div>
        <p className="text-lg text-slate-600">Manage your products and orders efficiently</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-white shadow-lg">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -left-2 -bottom-2 w-16 h-16 bg-white/5 rounded-full"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-white/20">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{adminStats.totalProducts}</div>
                <div className="text-blue-100 text-sm">Total Products</div>
              </div>
            </div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 text-white shadow-lg">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -left-2 -bottom-2 w-16 h-16 bg-white/5 rounded-full"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-white/20">
                <Star className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{adminStats.featuredProducts}</div>
                <div className="text-emerald-100 text-sm">Featured Products</div>
              </div>
            </div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-5 text-white shadow-lg">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -left-2 -bottom-2 w-16 h-16 bg-white/5 rounded-full"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-white/20">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{adminStats.totalCategories}</div>
                <div className="text-amber-100 text-sm">Product Categories</div>
              </div>
            </div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Hero Carousel */}
      <div className="relative w-full max-w-6xl mx-auto h-[400px] rounded-2xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10"></div>
        
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-all duration-1000 transform ${
                  index === currentSlide ? "scale-100" : "scale-105"
                }`}
              />
            ))
          : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-semibold">Beautiful products coming soon</p>
              </div>
            </div>
          )}
        
        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {featureImageList && featureImageList.length > 0 ? (
            featureImageList.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? "bg-white scale-125 shadow-lg" 
                    : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))
          ) : null}
        </div>

        {/* Navigation Buttons */}
        {featureImageList && featureImageList.length > 1 ? (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentSlide(
                  (prevSlide) =>
                    (prevSlide - 1 + featureImageList.length) %
                    featureImageList.length
                )
              }
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentSlide(
                  (prevSlide) => (prevSlide + 1) % featureImageList.length
                )
              }
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </Button>
          </>
        ) : null}
      </div>

      {/* Categories & Brands Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500">
              <ShirtIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Shop by Category & Brand</h2>
              <p className="text-sm text-slate-500">Browse our carefully curated products</p>
            </div>
          </div>
        </div>
        
        <div className="p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Categories */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-blue-500">
                  <ShirtIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Shop by Category</h3>
                  <p className="text-sm text-slate-500">Browse our product categories</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categoriesWithImage.map((categoryItem) => (
                  <div
                    key={categoryItem.id}
                    onClick={() =>
                      handleNavigateToListingPage(categoryItem, "category")
                    }
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-slate-200">
                      <div className="p-3 text-center">
                        {categoryItem.image ? (
                          <img
                            src={categoryItem.image}
                            alt={categoryItem.label}
                            className="w-12 h-12 mx-auto object-cover rounded-full shadow-sm group-hover:shadow-md transition-shadow duration-300"
                          />
                        ) : (
                          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <DefaultCategoryIcon className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <h4 className="mt-2 text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
                          {categoryItem.label}
                        </h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Brands */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-emerald-500">
                  <ShoppingBasket className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Shop by Brand</h3>
                  <p className="text-sm text-slate-500">Discover your favorite brands</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {brandsWithIcon.map((brandItem) => (
                  <div
                    key={brandItem.id}
                    onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-slate-200">
                      <div className="p-3 text-center">
                        <div className="w-12 h-12 mx-auto bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
                          <brandItem.icon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="mt-2 text-sm font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors duration-300">
                          {brandItem.label}
                        </h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Products with Filters */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Admin Products</h2>
                <p className="text-sm text-slate-500">Manage products added by this admin</p>
              </div>
            </div>
            <div className="flex gap-2">
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
        
        {/* Filter Controls */}
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
        
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-slate-600">
              Showing {filteredProducts.length} of {productList?.length || 0} products
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts && filteredProducts.length > 0
              ? filteredProducts.map((productItem) => (
                  <div key={productItem._id} className="transform hover:scale-105 transition-transform duration-300">
                    <AdminProductTile
                      key={productItem._id}
                      product={productItem}
                      openDetailsModal={async (product) => {
                        dispatch(getReviews(product._id));
                        const mockProductDetails = {
                          ...product,
                          reviews: [] // Will be populated by reducer
                        };
                        setProductDetails(mockProductDetails);
                        setOpenDetailsDialog(true);
                      }}
                    />
                  </div>
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
        </div>
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}


export default AdminDashboard;
