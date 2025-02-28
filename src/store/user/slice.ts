import { APIClient } from "@/helpers/apiHelper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const URL_USER = "/users";

const api = new APIClient();

// %%%%%%%%%% GET USER API %%%%%%%%%%%%
export const GetUserApi = createAsyncThunk(
  "GetUserApi",
  async ({ searchParams = {} }: { searchParams: Record<string, any> }) => {
    try {
      const response = await api.get(URL_USER, searchParams);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% GET SINGLE USER API %%%%%%%%%%%%
export const GetSingleUserApi = createAsyncThunk(
  "GetSingleUserApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.get(`${URL_USER}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% CREATE USER API %%%%%%%%%%%%
export const AddUserApi = createAsyncThunk(
  "AddUserApi",
  async ({
    values,
    requiredFields = [],
  }: {
    values: any;
    requiredFields?: string[];
  }) => {
    try {
      const response = await api.create(URL_USER, values, requiredFields);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% EDIT USER API %%%%%%%%%%%%
export const EditUserApi = createAsyncThunk(
  "EditUserApi",
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
        `${URL_USER}/${id}`,
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

// %%%%%%%%%% DELETE USER API %%%%%%%%%%%%
export const DeleteUserApi = createAsyncThunk(
  "DeleteUserApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.delete(`${URL_USER}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

const UserSlice = createSlice({
  name: "UserSlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    data: [],
    singleData: {},
  },
  reducers: {
    clearUserState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      //%%%%%%%%%% CREATE USER API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(AddUserApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(AddUserApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(AddUserApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET USER API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetUserApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetUserApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action.payload?.result ? action.payload?.result : [];
      })
      .addCase(GetUserApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET SINGLE USER API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetSingleUserApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetSingleUserApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.singleData = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(GetSingleUserApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT USER API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(EditUserApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(EditUserApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(EditUserApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% DELETE USER API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(DeleteUserApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(DeleteUserApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(DeleteUserApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearUserState } = UserSlice.actions;
export default UserSlice.reducer;
