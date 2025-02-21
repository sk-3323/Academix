import { APIClient } from "@/helpers/apiHelper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const URL_CATEGORY = "/category";

const api = new APIClient();

// %%%%%%%%%% GET CATEGORY API %%%%%%%%%%%%
export const GetCategoryApi = createAsyncThunk("GetCategoryApi", async () => {
  try {
    const response = await api.get(URL_CATEGORY);
    return response;
  } catch (error) {
    console.error("error", error);
    return error;
  }
});

// %%%%%%%%%% GET SINGLE CATEGORY API %%%%%%%%%%%%
export const GetSingleCategoryApi = createAsyncThunk(
  "GetSingleCategoryApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.get(`${URL_CATEGORY}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% CREATE CATEGORY API %%%%%%%%%%%%
export const AddCategoryApi = createAsyncThunk(
  "AddCategoryApi",
  async ({
    values,
    requiredFields = [],
  }: {
    values: any;
    requiredFields?: string[];
  }) => {
    try {
      const response = await api.create(URL_CATEGORY, values, requiredFields);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% EDIT CATEGORY API %%%%%%%%%%%%
export const EditCategoryApi = createAsyncThunk(
  "EditCategoryApi",
  async ({
    id,
    values,
    requiredFields = [],
  }: {
    id: string;
    values: any;
    requiredFields?: string[];
  }) => {
    try {
      const response = await api.update(
        `${URL_CATEGORY}/${id}`,
        values,
        requiredFields
      );
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% DELETE CATEGORY API %%%%%%%%%%%%
export const DeleteCategoryApi = createAsyncThunk(
  "DeleteCategoryApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.delete(`${URL_CATEGORY}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

const CategorySlice = createSlice({
  name: "CategorySlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    data: [],
    singleData: {},
  },
  reducers: {
    clearCategoryState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      //%%%%%%%%%% CREATE CATEGORY API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(AddCategoryApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(AddCategoryApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(AddCategoryApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET CATEGORY API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetCategoryApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(GetCategoryApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action.payload?.result ? action.payload?.result : [];
      })
      .addCase(GetCategoryApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET SINGLE CATEGORY API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetSingleCategoryApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(GetSingleCategoryApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.singleData = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(GetSingleCategoryApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT CATEGORY API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(EditCategoryApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(EditCategoryApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(EditCategoryApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% DELETE CATEGORY API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(DeleteCategoryApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(DeleteCategoryApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(DeleteCategoryApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearCategoryState } = CategorySlice.actions;
export default CategorySlice.reducer;
