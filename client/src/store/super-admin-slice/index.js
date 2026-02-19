import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  pendingAdmins: [],
  allAdmins: [],
  categories: [],
  brands: [],
  adminSummary: null,
  isLoading: false,
};

export const fetchPendingAdmins = createAsyncThunk(
  "/super/fetchPendingAdmins",
  async () => {
    const response = await axios.get(
      "http://localhost:5000/api/super/admins/pending",
      { withCredentials: true }
    );
    return response.data;
  }
);

export const approveAdmin = createAsyncThunk(
  "/super/approveAdmin",
  async (userId) => {
    const response = await axios.post(
      `http://localhost:5000/api/super/admins/approve/${userId}`,
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
      `http://localhost:5000/api/super/admins/decline/${userId}`,
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
      "http://localhost:5000/api/super/admins/summary",
      { withCredentials: true }
    );
    return response.data;
  }
);

export const fetchAllAdmins = createAsyncThunk(
  "/super/fetchAllAdmins",
  async () => {
    const response = await axios.get(
      "http://localhost:5000/api/super/admins/all",
      { withCredentials: true }
    );
    return response.data;
  }
);

export const blockAdmin = createAsyncThunk(
  "/super/blockAdmin",
  async (userId) => {
    const response = await axios.post(
      `http://localhost:5000/api/super/admins/block/${userId}`,
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
      `http://localhost:5000/api/super/admins/unblock/${userId}`,
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
      `http://localhost:5000/api/super/admins/${userId}`,
      { withCredentials: true }
    );
    return { ...response.data, userId };
  }
);

export const createCategory = createAsyncThunk(
  "/super/createCategory",
  async (payload) => {
    const response = await axios.post(
      "http://localhost:5000/api/super/category/categories",
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
      "http://localhost:5000/api/super/category/brands",
      payload,
      { withCredentials: true }
    );
    return response.data;
  }
);

export const fetchCategoriesAndBrands = createAsyncThunk(
  "/super/fetchCategoriesAndBrands",
  async () => {
    const [categoriesResponse, brandsResponse] = await Promise.all([
      axios.get("http://localhost:5000/api/common/category/categories"),
      axios.get("http://localhost:5000/api/common/category/brands"),
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
      });
  },
});

export default superAdminSlice.reducer;
