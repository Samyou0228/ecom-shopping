import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, ShirtIcon, ShoppingBasket, Users, ShoppingBag, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { fetchCategoriesAndBrands } from "@/store/super-admin-slice";

const DefaultCategoryIcon = ShirtIcon;
const defaultBrandIcon = ShoppingBasket;
function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { categories, brands } = useSelector((state) => state.superAdmin);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock stats for shopping dashboard
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
    navigate(`/shop/listing`);
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
      setCurrentSlide(
        (prevSlide) => (prevSlide + 1) % featureImageList.length
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(fetchCategoriesAndBrands());
  }, [dispatch]);

  const categoriesWithImage = useMemo(
    () =>
      categories.map((category) => ({
        id: category.slug,
        label: category.name,
        image: category.image,
      })),
    [categories]
  );

  const brandsWithIcon = useMemo(
    () =>
      brands.map((brand) => ({
        id: brand.slug,
        label: brand.name,
        icon: defaultBrandIcon,
      })),
    [brands]
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Welcome to Shop!</h1>
        <p className="text-sm text-slate-500">Discover amazing products and deals</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-white shadow-lg">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -left-2 -bottom-2 w-16 h-16 bg-white/5 rounded-full"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <ShoppingBag className="w-6 h-6" />
              <span className="text-3xl font-bold">{shoppingStats.totalProducts}</span>
            </div>
            <div className="text-sm text-blue-100 font-medium">Total Products</div>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 text-white shadow-lg">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -left-2 -bottom-2 w-16 h-16 bg-white/5 rounded-full"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <Star className="w-6 h-6" />
              <span className="text-3xl font-bold">{shoppingStats.featuredProducts}</span>
            </div>
            <div className="text-sm text-emerald-100 font-medium">Featured Products</div>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-5 text-white shadow-lg">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -left-2 -bottom-2 w-16 h-16 bg-white/5 rounded-full"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-6 h-6" />
              <span className="text-3xl font-bold">{shoppingStats.totalCategories}</span>
            </div>
            <div className="text-sm text-amber-100 font-medium">Product Categories</div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center bg-white">
        <div className="relative w-full max-w-5xl h-[360px] md:h-[420px] lg:h-[460px] overflow-hidden rounded-2xl shadow-xl">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
            ))
          : null}
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
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentSlide(
                  (prevSlide) => (prevSlide + 1) % featureImageList.length
                )
              }
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </>
        ) : null}
        </div>
      </div>
      <section className="py-12 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden mb-8">
        <div className="container mx-auto px-4">
          <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500">
                <ShirtIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Shop by Category</h2>
                <p className="text-sm text-slate-500">Browse our product categories</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categoriesWithImage.map((categoryItem) => (
                <Card
                  key={categoryItem.id}
                  onClick={() =>
                    handleNavigateToListingPage(categoryItem, "category")
                  }
                  className="cursor-pointer hover:shadow-lg transition-shadow border-slate-100"
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    {categoryItem.image ? (
                      <img
                        src={categoryItem.image}
                        alt={categoryItem.label}
                        className="w-16 h-16 mb-4 object-cover rounded-full"
                      />
                    ) : (
                      <DefaultCategoryIcon className="w-12 h-12 mb-4 text-blue-500" />
                    )}
                    <span className="font-semibold text-slate-700">{categoryItem.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden mb-8">
        <div className="container mx-auto px-4">
          <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-green-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500">
                <ShoppingBasket className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Shop by Brand</h2>
                <p className="text-sm text-slate-500">Discover your favorite brands</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {brandsWithIcon.map((brandItem) => (
                <Card
                  key={brandItem.id}
                  onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                  className="cursor-pointer hover:shadow-lg transition-shadow border-slate-100"
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <brandItem.icon className="w-12 h-12 mb-4 text-emerald-500" />
                    <span className="font-semibold text-slate-700">{brandItem.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Featured Products</h2>
                <p className="text-sm text-slate-500">Our most popular items</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productList && productList.length > 0
                ? productList.map((productItem) => (
                    <ShoppingProductTile
                      key={productItem._id}
                      handleGetProductDetails={handleGetProductDetails}
                      product={productItem}
                      handleAddtoCart={handleAddtoCart}
                    />
                  ))
                : null}
            </div>
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
