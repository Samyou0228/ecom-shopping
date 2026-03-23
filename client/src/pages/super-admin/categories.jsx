import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesAndBrands, createCategory, updateCategory, deleteCategory } from "@/store/super-admin-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { Tags, Plus, Trash2, Edit, Tag, X } from "lucide-react";

function SuperAdminCategories() {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.superAdmin);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImageFile, setCategoryImageFile] = useState(null);
  const [categoryImageUrl, setCategoryImageUrl] = useState("");
  const [categoryImageLoading, setCategoryImageLoading] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  useEffect(() => {
    dispatch(fetchCategoriesAndBrands());
  }, [dispatch]);

  function handleAddCategory(event) {
    event.preventDefault();
    if (!categoryName.trim()) return;

    if (currentEditedId) {
      dispatch(
        updateCategory({
          id: currentEditedId,
          payload: {
            name: categoryName.trim(),
            image: categoryImageUrl,
          },
        })
      );
      setCurrentEditedId(null);
    } else {
      dispatch(
        createCategory({
          name: categoryName.trim(),
          image: categoryImageUrl,
        })
      );
    }
    setCategoryName("");
    setCategoryImageFile(null);
    setCategoryImageUrl("");
  }

  function handleEditCategory(category) {
    setCurrentEditedId(category._id);
    setCategoryName(category.name);
    setCategoryImageUrl(category.image || "");
  }

  function handleDeleteCategory(id) {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteCategory(id));
    }
  }

  function handleCancelEdit() {
    setCurrentEditedId(null);
    setCategoryName("");
    setCategoryImageFile(null);
    setCategoryImageUrl("");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
            <Tags className="w-5 h-5 text-white" />
          </div>
          Categories Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">Add, view, and manage your product categories</p>
      </div>

      {/* Add Category Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            {currentEditedId ? "Edit Category" : "Add New Category"}
          </h2>
          {currentEditedId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelEdit}
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel Edit
            </Button>
          )}
        </div>

        <div className="p-5">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Image Upload */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700">Category Image (Optional)</label>
              <ProductImageUpload
                imageFile={categoryImageFile}
                setImageFile={setCategoryImageFile}
                uploadedImageUrl={categoryImageUrl}
                setUploadedImageUrl={setCategoryImageUrl}
                setImageLoadingState={setCategoryImageLoading}
                imageLoadingState={categoryImageLoading}
                isEditMode={false}
                isCustomStyling={true}
              />
            </div>

            {/* Name Input */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700">Category Name</label>
              <Input
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="h-11 border-slate-200 focus:border-blue-500"
              />
              {currentEditedId ? (
                <Button
                  onClick={handleAddCategory}
                  disabled={!categoryName.trim()}
                  className="w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Update Category
                </Button>
              ) : (
                <Button
                  onClick={handleAddCategory}
                  disabled={!categoryName.trim()}
                  className="w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Category
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              All Categories
            </h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
              {categories.length} Categories
            </span>
          </div>
        </div>

        <div className="p-5">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <Tags className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Categories Yet</h3>
              <p className="text-slate-500">Add your first category using the form above</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category, index) => (
                <div
                  key={category._id}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  {/* Colorful top bar */}
                  <div className={`h-2 bg-gradient-to-r ${index % 5 === 0 ? 'from-blue-400 to-blue-600' :
                    index % 5 === 1 ? 'from-emerald-400 to-emerald-600' :
                      index % 5 === 2 ? 'from-purple-400 to-purple-600' :
                        index % 5 === 3 ? 'from-orange-400 to-orange-600' :
                          'from-pink-400 to-pink-600'
                    }`}></div>

                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {category.image ? (
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                          <Tags className="w-6 h-6 text-blue-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 truncate">{category.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">Category</p>
                      </div>

                      {/* Edit/Delete Icons */}
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="p-1.5 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          className="p-1.5 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div >
  );
}

export default SuperAdminCategories;

