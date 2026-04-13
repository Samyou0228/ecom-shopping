import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  pendingAdmins: [],
  allAdmins: [],
  allUsers: [],
  allOwners: [],
  categories: [],
  brands: [],
  adminSummary: null,
  isLoading: false,
};

export const fetchPendingAdmins = createAsyncThunk(
  "/super/fetchPendingAdmins",
  async () => {
    const response = await axios.get(
      "/api/super/admins/pending",
      { withCredentials: true }
    );
    return response.data;
  }
);

export const approveAdmin = createAsyncThunk(
  "/super/approveAdmin",
  async (userId) => {
    const response = await axios.post(
      `/api/super/admins/approve/${userId}`,
      {},
      { withCredentials: true }
    );
    return response.data;
  }
);

export const declineAdmin = createAsyncThunk(
  "/super/declineAdmin",
  async (userId) => {
    const response = await axios.post(
      `/api/super/admins/decline/${userId}`,
      {},
      { withCredentials: true }
    );
    return response.data;
  }
);

export const fetchAdminSummary = createAsyncThunk(
  "/super/fetchAdminSummary",
  async () => {
    const response = await axios.get(
      "/api/super/admins/summary",
      { withCredentials: true }
    );
    return response.data;
  }
);

export const fetchAllAdmins = createAsyncThunk(
  "/super/fetchAllAdmins",
  async () => {
    const response = await axios.get(
      "/api/super/admins/all",
      { withCredentials: true }
    );
    return response.data;
  }
);

export const blockAdmin = createAsyncThunk(
  "/super/blockAdmin",
  async (userId) => {
    const response = await axios.post(
      `/api/super/admins/block/${userId}`,
      {},
      { withCredentials: true }
    );
    return response.data;
  }
);

export const unblockAdmin = createAsyncThunk(
  "/super/unblockAdmin",
  async (userId) => {
    const response = await axios.post(
      `/api/super/admins/unblock/${userId}`,
      {},
      { withCredentials: true }
    );
    return response.data;
  }
);

export const deleteAdmin = createAsyncThunk(
  "/super/deleteAdmin",
  async (userId) => {
    const response = await axios.delete(
      `/api/super/admins/${userId}`,
      { withCredentials: true }
    );
    return { ...response.data, userId };
  }
);

export const fetchAllUsers = createAsyncThunk(
  "/super/fetchAllUsers",
  async () => {
    const response = await axios.get(
      "/api/super/users-owners/users",
      { withCredentials: true }
    );
    return response.data;
  }
);

export const fetchAllOwners = createAsyncThunk(
  "/super/fetchAllOwners",
  async () => {
    const response = await axios.get(
      "/api/super/users-owners/owners",
      { withCredentials: true }
    );
    return response.data;
  }
);

export const createCategory = createAsyncThunk(
  "/super/createCategory",
  async (payload) => {
    const response = await axios.post(
      "/api/super/category/categories",
      payload,
      { withCredentials: true }
    );
    return response.data;
  }
);

export const createBrand = createAsyncThunk(
  "/super/createBrand",
  async (payload) => {
    const response = await axios.post(
      "/api/super/category/brands",
      payload,
      { withCredentials: true }
    );
    return response.data;
  }
);

export const updateCategory = createAsyncThunk(
  "/super/updateCategory",
  async ({ id, payload }) => {
    const response = await axios.put(
      `/api/super/category/categories/${id}`,
      payload,
      { withCredentials: true }
    );
    return response.data;
  }
);

export const deleteCategory = createAsyncThunk(
  "/super/deleteCategory",
  async (id) => {
    const response = await axios.delete(
      `/api/super/category/categories/${id}`,
      { withCredentials: true }
    );
    return { ...response.data, id };
  }
);

export const updateBrand = createAsyncThunk(
  "/super/updateBrand",
  async ({ id, payload }) => {
    const response = await axios.put(
      `/api/super/category/brands/${id}`,
      payload,
      { withCredentials: true }
    );
    return response.data;
  }
);

export const deleteBrand = createAsyncThunk(
  "/super/deleteBrand",
  async (id) => {
    const response = await axios.delete(
      `/api/super/category/brands/${id}`,
      { withCredentials: true }
    );
    return { ...response.data, id };
  }
);

export const fetchCategoriesAndBrands = createAsyncThunk(
  "/super/fetchCategoriesAndBrands",
  async () => {
    const [categoriesResponse, brandsResponse] = await Promise.all([
      axios.get("/api/common/category/categories", { withCredentials: true }),
      axios.get("/api/common/category/brands", { withCredentials: true }),
    ]);

    return {
      categories: categoriesResponse.data.data || [],
      brands: brandsResponse.data.data || [],
    };
  }
);

const superAdminSlice = createSlice({
  name: "superAdmin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingAdmins.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPendingAdmins.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingAdmins = action.payload.success
          ? action.payload.data
          : [];
      })
      .addCase(fetchPendingAdmins.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(approveAdmin.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.pendingAdmins = state.pendingAdmins.filter(
            (admin) => admin._id !== action.meta.arg
          );
        }
      })
      .addCase(declineAdmin.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.pendingAdmins = state.pendingAdmins.filter(
            (admin) => admin._id !== action.meta.arg
          );
        }
      })
      .addCase(fetchAdminSummary.fulfilled, (state, action) => {
        state.adminSummary = action.payload.success ? action.payload.data : null;
      })
      .addCase(fetchAllAdmins.fulfilled, (state, action) => {
        state.allAdmins = action.payload.success ? action.payload.data : [];
      })
      .addCase(blockAdmin.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.allAdmins = state.allAdmins.map((admin) =>
            admin._id === action.meta.arg
              ? { ...admin, isBlocked: true }
              : admin
          );
        }
      })
      .addCase(unblockAdmin.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.allAdmins = state.allAdmins.map((admin) =>
            admin._id === action.meta.arg
              ? { ...admin, isBlocked: false }
              : admin
          );
        }
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.allAdmins = state.allAdmins.filter(
            (admin) => admin._id !== action.payload.userId
          );
        }
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allUsers = action.payload.success ? action.payload.data : [];
      })
      .addCase(fetchAllUsers.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAllOwners.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllOwners.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allOwners = action.payload.success ? action.payload.data : [];
      })
      .addCase(fetchAllOwners.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchCategoriesAndBrands.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
        state.brands = action.payload.brands;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          state.categories.push(action.payload.data);
        }
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          state.brands.push(action.payload.data);
        }
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          state.categories = state.categories.map((category) =>
            category._id === action.payload.data._id
              ? action.payload.data
              : category
          );
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.categories = state.categories.filter(
            (category) => category._id !== action.payload.id
          );
        }
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          state.brands = state.brands.map((brand) =>
            brand._id === action.payload.data._id ? action.payload.data : brand
          );
        }
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.brands = state.brands.filter(
            (brand) => brand._id !== action.payload.id
          );
        }
      });
  },
});

export default superAdminSlice.reducer;
