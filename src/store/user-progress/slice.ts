import { APIClient } from "@/helpers/apiHelper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const URL_USER_PROGRESS = "/user-progress";

const api = new APIClient();

// %%%%%%%%%% GET USER-PROGRESS API %%%%%%%%%%%%
export const GetUserProgressApi = createAsyncThunk(
  "GetUserProgressApi",
  async () => {
    try {
      const response = await api.get(URL_USER_PROGRESS);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% GET SINGLE USER-PROGRESS API %%%%%%%%%%%%
export const GetSingleUserProgressApi = createAsyncThunk(
  "GetSingleUserProgressApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.get(`${URL_USER_PROGRESS}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% CREATE USER-PROGRESS API %%%%%%%%%%%%
export const AddUserProgressApi = createAsyncThunk(
  "AddUserProgressApi",
  async ({
    values,
    requiredFields = [],
  }: {
    values: any;
    requiredFields?: string[];
  }) => {
    try {
      const response = await api.create(
        URL_USER_PROGRESS,
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

// %%%%%%%%%% EDIT USER-PROGRESS API %%%%%%%%%%%%
export const EditUserProgressApi = createAsyncThunk(
  "EditUserProgressApi",
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
        `${URL_USER_PROGRESS}/${id}`,
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

// %%%%%%%%%% DELETE USER-PROGRESS API %%%%%%%%%%%%
export const DeleteUserProgressApi = createAsyncThunk(
  "DeleteUserProgressApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.delete(`${URL_USER_PROGRESS}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

const UserProgressSlice = createSlice({
  name: "UserProgressSlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    data: [],
    singleData: {},
  },
  reducers: {
    clearUserProgressState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      //%%%%%%%%%% CREATE USER-PROGRESS API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(AddUserProgressApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(AddUserProgressApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(AddUserProgressApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET USER-PROGRESS API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetUserProgressApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(GetUserProgressApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action.payload?.result ? action.payload?.result : [];
      })
      .addCase(GetUserProgressApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET SINGLE USER-PROGRESS API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetSingleUserProgressApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(GetSingleUserProgressApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.singleData = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(GetSingleUserProgressApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT USER-PROGRESS API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(EditUserProgressApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(EditUserProgressApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(EditUserProgressApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% DELETE USER-PROGRESS API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(DeleteUserProgressApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(DeleteUserProgressApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(DeleteUserProgressApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearUserProgressState } = UserProgressSlice.actions;
export default UserProgressSlice.reducer;
