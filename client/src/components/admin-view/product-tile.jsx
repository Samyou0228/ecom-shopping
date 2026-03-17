import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
  openDetailsModal,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div
          className="relative cursor-pointer group"
          onClick={() => openDetailsModal(product)}
        >
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-t-lg">
            <span className="text-white font-medium text-lg px-4 py-2 bg-black/50 rounded-lg backdrop-blur-sm">View Details</span>
          </div>
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${product?.salePrice > 0 ? "line-through" : ""
                } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold">${product?.salePrice}</span>
            ) : null}
          </div>
        </CardContent>
        {setFormData && setOpenCreateProductsDialog && setCurrentEditedId && handleDelete ? (
          <CardFooter className="flex justify-between items-center">
            <Button
              onClick={() => {
                setOpenCreateProductsDialog(true);
                setCurrentEditedId(product?._id);
                setFormData(product);
              }}
            >
              Edit
            </Button>
            <Button onClick={() => handleDelete(product?._id)}>Delete</Button>
          </CardFooter>
        ) : null}
      </div>
    </Card>
  );
}

export default AdminProductTile;
