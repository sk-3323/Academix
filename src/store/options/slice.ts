import { APIClient } from "@/helpers/apiHelper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const URL_OPTION = "/options";

const api = new APIClient();

// %%%%%%%%%% GET OPTION API %%%%%%%%%%%%
export const GetOptionApi = createAsyncThunk(
  "GetOptionApi",
  async ({ searchParams = {} }: { searchParams: Record<string, any> }) => {
    try {
      const response = await api.get(URL_OPTION, searchParams);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% GET SINGLE OPTION API %%%%%%%%%%%%
export const GetSingleOptionApi = createAsyncThunk(
  "GetSingleOptionApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.get(`${URL_OPTION}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% CREATE OPTION API %%%%%%%%%%%%
export const AddOptionApi = createAsyncThunk(
  "AddOptionApi",
  async ({
    values,
    requiredFields = [],
  }: {
    values: any;
    requiredFields?: string[];
  }) => {
    try {
      const response = await api.create(URL_OPTION, values, requiredFields);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% EDIT OPTION API %%%%%%%%%%%%
export const EditOptionApi = createAsyncThunk(
  "EditOptionApi",
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
        `${URL_OPTION}/${id}`,
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

// %%%%%%%%%% CHANGE OPTION ORDER API %%%%%%%%%%%%
export const ChangeOptionOrderApi = createAsyncThunk(
  "ChangeOptionOrderApi",
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
        `${URL_OPTION}/change-order/${id}`,
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

// %%%%%%%%%% CHANGE OPTION STATUS API %%%%%%%%%%%%
export const ChangeOptionStatusApi = createAsyncThunk(
  "ChangeOptionStatusApi",
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
        `${URL_OPTION}/change-status/${id}`,
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

// %%%%%%%%%% DELETE OPTION API %%%%%%%%%%%%
export const DeleteOptionApi = createAsyncThunk(
  "DeleteOptionApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.delete(`${URL_OPTION}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

const OptionSlice = createSlice({
  name: "OptionSlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    data: [],
    singleData: {},
  },
  reducers: {
    clearOptionState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      //%%%%%%%%%% CREATE OPTION API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(AddOptionApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(AddOptionApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(AddOptionApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET OPTION API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetOptionApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetOptionApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action.payload?.result ? action.payload?.result : [];
      })
      .addCase(GetOptionApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET SINGLE OPTION API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetSingleOptionApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetSingleOptionApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.singleData = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(GetSingleOptionApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT OPTION API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(EditOptionApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(EditOptionApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(EditOptionApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% CHANGE OPTION ORDER API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(ChangeOptionOrderApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(ChangeOptionOrderApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(ChangeOptionOrderApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% CHANGE OPTION STATUS API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(ChangeOptionStatusApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(ChangeOptionStatusApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(ChangeOptionStatusApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% DELETE OPTION API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(DeleteOptionApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(DeleteOptionApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(DeleteOptionApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearOptionState } = OptionSlice.actions;
export default OptionSlice.reducer;
