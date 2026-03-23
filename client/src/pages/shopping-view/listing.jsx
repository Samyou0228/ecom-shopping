import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon, Filter, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();

  const categorySearchParam = searchParams.get("category");

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }

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
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters, setSearchParams]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
        <div className="relative container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Sparkles className="w-8 h-8 text-yellow-300" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-yellow-200 to-pink-200 bg-clip-text text-transparent">
                  Product Catalog
                </h1>
                <Sparkles className="w-8 h-8 text-yellow-300" />
              </div>
              <p className="text-lg text-slate-200">Discover our amazing collection of premium products</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                <div className="text-center">
                  <div className="text-2xl font-bold">{productList?.length || 0}</div>
                  <div className="text-sm text-white/80">Products Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Filter Sidebar */}
          <div className="lg:sticky lg:top-24">
            <ProductFilter filters={filters} handleFilter={handleFilter} />
          </div>

          {/* Products Grid */}
          <div className="space-y-8">
            {/* Header with Controls */}
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">All Products</h2>
                  <p className="text-slate-600 text-lg">Browse our carefully curated collection</p>
                </div>
                <div className="flex items-center gap-4">
                  {/* Mobile Product Count */}
                  <div className="md:hidden flex items-center gap-3 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-3 rounded-full">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <div className="text-center">
                      <div className="text-lg font-bold">{productList?.length || 0}</div>
                      <div className="text-sm text-slate-700">Products</div>
                    </div>
                  </div>

                  {/* Sort Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex items-center gap-3 bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <ArrowUpDownIcon className="h-6 w-6 text-slate-600" />
                        <span className="font-semibold text-slate-700 text-lg">Sort by</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[280px] bg-white border-2 border-slate-200">
                      <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                        {sortOptions.map((sortItem) => (
                          <DropdownMenuRadioItem
                            value={sortItem.id}
                            key={sortItem.id}
                            className="text-slate-700 hover:bg-slate-50 py-3 px-4 text-lg"
                          >
                            {sortItem.label}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Active Filters */}
              {Object.keys(filters).length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Filter className="w-6 h-6 text-blue-600" />
                    <span className="text-lg font-semibold text-slate-700">Active Filters</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(filters).map(([section, values]) => (
                      <div key={section} className="flex flex-wrap gap-2">
                        {values.map((value) => (
                          <span
                            key={value}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-base font-medium rounded-full shadow-lg"
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productList && productList.length > 0
                ? productList.map((productItem) => (
                  <div key={productItem._id} className="h-full">
                    <ShoppingProductTile
                      handleGetProductDetails={handleGetProductDetails}
                      product={productItem}
                      handleAddtoCart={handleAddtoCart}
                    />
                  </div>
                ))
                : (
                  <div className="col-span-full text-center py-16">
                    <div className="bg-gradient-to-br from-slate-200 to-slate-300 p-12 rounded-3xl inline-block shadow-2xl">
                      <div className="flex items-center justify-center mb-6">
                        <Filter className="w-20 h-20 text-slate-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-600 mb-4">No products found</h3>
                      <p className="text-slate-500 text-lg mb-6">Try adjusting your filters to see more products</p>
                      <Button
                        onClick={() => {
                          setFilters({});
                          sessionStorage.removeItem("filters");
                          setSearchParams(new URLSearchParams());
                        }}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                )}
            </div>
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

export default ShoppingListing;
