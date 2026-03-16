import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Star, Heart, ShoppingCart, Tag } from "lucide-react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const isOnSale = product?.salePrice > 0;
  const isLowStock = product?.totalStock > 0 && product?.totalStock < 10;
  const isOutOfStock = product?.totalStock === 0;

  return (
    <div className="group cursor-pointer h-full">
      <Card 
        className="w-full h-full flex flex-col shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-slate-100 overflow-hidden"
        onClick={() => handleGetProductDetails(product?._id)}
      >
        {/* Product Image Section */}
        <div className="relative overflow-hidden flex-shrink-0 bg-white flex items-center justify-center p-4">
          <img
            src={product?.image}
            alt={product?.title}
            className="max-h-48 w-auto object-contain transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isOutOfStock ? (
              <Badge className="bg-red-500/90 hover:bg-red-600 text-white border-none shadow-lg">
                <Tag className="w-4 h-4 mr-1" />
                Out of Stock
              </Badge>
            ) : isLowStock ? (
              <Badge className="bg-orange-500/90 hover:bg-orange-600 text-white border-none shadow-lg">
                <Tag className="w-4 h-4 mr-1" />
                Only {product?.totalStock} left
              </Badge>
            ) : isOnSale ? (
              <Badge className="bg-red-500/90 hover:bg-red-600 text-white border-none shadow-lg">
                <Tag className="w-4 h-4 mr-1" />
                Sale
              </Badge>
            ) : null}
            
            {product?.featured && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white border-none shadow-lg">
                <Star className="w-4 h-4 mr-1" />
                Featured
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="outline"
              size="icon"
              className="bg-white/90 hover:bg-white text-slate-700 border-none shadow-lg hover:shadow-xl"
              onClick={(e) => {
                e.stopPropagation();
                // Add to wishlist functionality
              }}
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Product Details */}
        <CardContent className="p-6 bg-gradient-to-br from-slate-50 to-white flex-1 flex flex-col">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
              {product?.title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                {categoryOptionsMap[product?.category]}
              </span>
              <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                {brandOptionsMap[product?.brand]}
              </span>
            </div>

            {/* Price Section */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {isOnSale ? (
                  <>
                    <span className="text-2xl font-bold text-red-600">
                      ${product?.salePrice}
                    </span>
                    <span className="text-lg text-slate-500 line-through">
                      ${product?.price}
                    </span>
                    <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                      Save ${(product?.price - product?.salePrice).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-slate-800">
                    ${product?.price}
                  </span>
                )}
              </div>
            </div>

            {/* Rating */}
            {product?.averageReview > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.averageReview)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-600">({product.averageReview.toFixed(1)})</span>
              </div>
            )}
          </div>

          {/* Add to Cart */}
          <CardFooter className="p-0 bg-transparent border-0">
            {isOutOfStock ? (
              <Button 
                className="w-full bg-slate-300 hover:bg-slate-400 text-slate-600 cursor-not-allowed shadow-lg"
                disabled
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Out of Stock
              </Button>
            ) : (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddtoCart(product?._id, product?.totalStock);
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
                {isOnSale && (
                  <span className="ml-2 text-sm bg-white/20 px-2 py-1 rounded-full">
                    On Sale
                  </span>
                )}
              </Button>
            )}
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}

export default ShoppingProductTile;
