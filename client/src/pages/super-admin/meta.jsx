import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBrand,
  createCategory,
  fetchCategoriesAndBrands,
} from "@/store/super-admin-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SuperAdminMeta() {
  const dispatch = useDispatch();
  const { categories, brands } = useSelector((state) => state.superAdmin);
  const [categoryName, setCategoryName] = useState("");
  const [brandName, setBrandName] = useState("");

  useEffect(() => {
    dispatch(fetchCategoriesAndBrands());
  }, [dispatch]);

  function handleAddCategory(event) {
    event.preventDefault();
    if (!categoryName.trim()) return;
    dispatch(createCategory({ name: categoryName.trim() }));
    setCategoryName("");
  }

  function handleAddBrand(event) {
    event.preventDefault();
    if (!brandName.trim()) return;
    dispatch(createBrand({ name: brandName.trim() }));
    setBrandName("");
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <form onSubmit={handleAddCategory} className="flex gap-2">
          <Input
            placeholder="New category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <Button type="submit">Add</Button>
        </form>
        <ul className="list-disc list-inside space-y-1">
          {categories.map((category) => (
            <li key={category._id}>{category.name}</li>
          ))}
        </ul>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Brands</h2>
        <form onSubmit={handleAddBrand} className="flex gap-2">
          <Input
            placeholder="New brand name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
          <Button type="submit">Add</Button>
        </form>
        <ul className="list-disc list-inside space-y-1">
          {brands.map((brand) => (
            <li key={brand._id}>{brand.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SuperAdminMeta;

