import { Fragment, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { fetchCategoriesAndBrands } from "@/store/super-admin-slice";

function ProductFilter({ filters, handleFilter }) {
  const dispatch = useDispatch();
  const { categories, brands } = useSelector((state) => state.superAdmin);

  useEffect(() => {
    dispatch(fetchCategoriesAndBrands());
  }, [dispatch]);

  const filterOptions = useMemo(
    () => ({
      category: categories.map((category) => ({
        id: category.slug,
        label: category.name,
      })),
      brand: brands.map((brand) => ({
        id: brand.slug,
        label: brand.name,
      })),
    }),
    [categories, brands]
  );

  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem) => {
          const options = filterOptions[keyItem];

          if (!options || options.length === 0) return null;

          return (
            <Fragment key={keyItem}>
              <div>
                <h3 className="text-base font-bold">{keyItem}</h3>
                <div className="grid gap-2 mt-2">
                  {options.map((option) => (
                    <Label
                      key={option.id}
                      className="flex font-medium items-center gap-2 "
                    >
                      <Checkbox
                        checked={
                          filters &&
                          Object.keys(filters).length > 0 &&
                          filters[keyItem] &&
                          filters[keyItem].indexOf(option.id) > -1
                        }
                        onCheckedChange={() => handleFilter(keyItem, option.id)}
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
              <Separator />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default ProductFilter;
