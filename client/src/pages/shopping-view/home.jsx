import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import { getFeatureImages } from "@/store/common-slice";
import { fetchCategoriesAndBrands } from "@/store/super-admin-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, ShirtIcon, ShoppingBasket, ShoppingBag, Star, TrendingUp, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";

const DefaultCategoryIcon = ShirtIcon;
const defaultBrandIcon = ShoppingBasket;

function ShoppingHome() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { categories, brands } = useSelector((state) => state.superAdmin);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  // Stats for shopping dashboard
  const shoppingStats = {
    totalProducts: productList?.length || 0,
    featuredProducts: productList?.filter(p => p.featured)?.length || 0,
    totalCategories: categories?.length || 0
  };

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    window.location.href = `/shop/listing`;
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    if (!featureImageList || featureImageList.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }));
  }, [dispatch]);

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
          <h1 className="text-3xl font-bold text-slate-800">Welcome to Shop!</h1>
          <Sparkles className="w-6 h-6 text-blue-500" />
        </div>
        <p className="text-lg text-slate-600">Discover amazing products and exclusive deals</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <div className="text-3xl font-bold">{shoppingStats.totalProducts}</div>
                <div className="text-blue-100">Total Products</div>
              </div>
            </div>
            <div className="text-right">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="group bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Star className="w-8 h-8" />
              </div>
              <div>
                <div className="text-3xl font-bold">{shoppingStats.featuredProducts}</div>
                <div className="text-emerald-100">Featured Products</div>
              </div>
            </div>
            <div className="text-right">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="group bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <div className="text-3xl font-bold">{shoppingStats.totalCategories}</div>
                <div className="text-amber-100">Product Categories</div>
              </div>
            </div>
            <div className="text-right">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
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
      <section className="py-12 bg-white rounded-3xl shadow-2xl border border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Shop by Category & Brand</h2>
            <p className="text-slate-600 text-lg">Browse our carefully curated products</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Categories Dropdown */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-slate-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <ShirtIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Shop by Category</h3>
                  <p className="text-slate-600">Browse our product categories</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categoriesWithImage.map((categoryItem) => (
                  <div
                    key={categoryItem.id}
                    onClick={() =>
                      handleNavigateToListingPage(categoryItem, "category")
                    }
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-slate-200">
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

            {/* Brands Dropdown */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border border-slate-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl">
                  <ShoppingBasket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Shop by Brand</h3>
                  <p className="text-slate-600">Discover your favorite brands</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {brandsWithIcon.map((brandItem) => (
                  <div
                    key={brandItem.id}
                    onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-slate-200">
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
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Featured Products</h2>
            <p className="text-slate-600 text-lg">Our most popular and highly rated items</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <div key={productItem._id} className="transform hover:scale-105 transition-transform duration-300">
                    <ShoppingProductTile
                      handleGetProductDetails={handleGetProductDetails}
                      product={productItem}
                      handleAddtoCart={handleAddtoCart}
                    />
                  </div>
                ))
              : (
                <div className="col-span-full text-center py-12">
                  <div className="bg-gradient-to-br from-slate-200 to-slate-300 p-8 rounded-2xl inline-block shadow-2xl">
                    <Star className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-600 mb-2">No products yet</h3>
                    <p className="text-slate-500">Products will be available soon</p>
                  </div>
                </div>
              )}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
