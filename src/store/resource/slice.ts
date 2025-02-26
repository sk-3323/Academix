import { APIClient } from "@/helpers/apiHelper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const URL_RESOURCE = "/resource";

const api = new APIClient();

// %%%%%%%%%% GET RESOURCE API %%%%%%%%%%%%
export const GetResourceApi = createAsyncThunk("GetResourceApi", async () => {
  try {
    const response = await api.get(URL_RESOURCE);
    return response;
  } catch (error) {
    console.error("error", error);
    return error;
  }
});

// %%%%%%%%%% GET SINGLE RESOURCE API %%%%%%%%%%%%
export const GetSingleResourceApi = createAsyncThunk(
  "GetSingleResourceApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.get(`${URL_RESOURCE}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% CREATE RESOURCE API %%%%%%%%%%%%
export const AddResourceApi = createAsyncThunk(
  "AddResourceApi",
  async ({
    formdata,
    requiredFields = [],
  }: {
    formdata: FormData;
    requiredFields?: string[];
  }) => {
    try {
      const response = await api.create(
        URL_RESOURCE,
        formdata,
        {
          "Content-type": "multipart/form-data",
        },
        requiredFields
      );
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% EDIT RESOURCE API %%%%%%%%%%%%
export const EditResourceApi = createAsyncThunk(
  "EditResourceApi",
  async ({
    id,
    formdata,
    requiredFields = [],
  }: {
    id: string;
    formdata: FormData;
    requiredFields?: string[];
  }) => {
    try {
      const response = await api.update(
        `${URL_RESOURCE}/${id}`,
        formdata,
        {
          "Content-type": "multipart/form-data",
        },
        requiredFields
      );
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% DELETE RESOURCE API %%%%%%%%%%%%
export const DeleteResourceApi = createAsyncThunk(
  "DeleteResourceApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.delete(`${URL_RESOURCE}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

const ResourceSlice = createSlice({
  name: "ResourceSlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    data: [],
    singleData: {},
  },
  reducers: {
    clearResourceState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      //%%%%%%%%%% CREATE RESOURCE API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(AddResourceApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(AddResourceApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(AddResourceApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET RESOURCE API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetResourceApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetResourceApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action.payload?.result ? action.payload?.result : [];
      })
      .addCase(GetResourceApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET SINGLE RESOURCE API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetSingleResourceApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetSingleResourceApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.singleData = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(GetSingleResourceApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT RESOURCE API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(EditResourceApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(EditResourceApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(EditResourceApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% DELETE RESOURCE API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(DeleteResourceApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(DeleteResourceApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(DeleteResourceApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearResourceState } = ResourceSlice.actions;
export default ResourceSlice.reducer;
