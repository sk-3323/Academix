import { APIClient } from "@/helpers/apiHelper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const URL_CHAPTER = "/chapter";

const api = new APIClient();

// %%%%%%%%%% GET CHAPTER API %%%%%%%%%%%%
export const GetChapterApi = createAsyncThunk(
  "GetChapterApi",
  async ({ searchParams = {} }: { searchParams: Record<string, any> }) => {
    try {
      const response = await api.get(URL_CHAPTER, searchParams);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% GET SINGLE CHAPTER API %%%%%%%%%%%%
export const GetSingleChapterApi = createAsyncThunk(
  "GetSingleChapterApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.get(`${URL_CHAPTER}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% CREATE CHAPTER API %%%%%%%%%%%%
export const AddChapterApi = createAsyncThunk(
  "AddChapterApi",
  async ({
    values,
    requiredFields = [],
  }: {
    values: any;
    requiredFields?: string[];
  }) => {
    try {
      const response = await api.create(URL_CHAPTER, values, requiredFields);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% EDIT CHAPTER API %%%%%%%%%%%%
export const EditChapterApi = createAsyncThunk(
  "EditChapterApi",
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
        `${URL_CHAPTER}/${id}`,
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

// %%%%%%%%%% CHANGE CHAPTER ORDER API %%%%%%%%%%%%
export const ChangeChapterOrderApi = createAsyncThunk(
  "ChangeChapterOrderApi",
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
        `${URL_CHAPTER}/change-order/${id}`,
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

// %%%%%%%%%% CHANGE CHAPTER STATUS API %%%%%%%%%%%%
export const ChangeChapterStatusApi = createAsyncThunk(
  "ChangeChapterStatusApi",
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
        `${URL_CHAPTER}/change-status/${id}`,
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

// %%%%%%%%%% DELETE CHAPTER API %%%%%%%%%%%%
export const DeleteChapterApi = createAsyncThunk(
  "DeleteChapterApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.delete(`${URL_CHAPTER}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

const ChapterSlice = createSlice({
  name: "ChapterSlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    data: [],
    singleData: {},
  },
  reducers: {
    clearChapterState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      //%%%%%%%%%% CREATE CHAPTER API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(AddChapterApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(AddChapterApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(AddChapterApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET CHAPTER API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetChapterApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(GetChapterApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action.payload?.result ? action.payload?.result : [];
      })
      .addCase(GetChapterApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET SINGLE CHAPTER API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetSingleChapterApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(GetSingleChapterApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.singleData = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(GetSingleChapterApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT CHAPTER API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(EditChapterApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(EditChapterApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(EditChapterApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% CHANGE CHAPTER ORDER API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(ChangeChapterOrderApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(ChangeChapterOrderApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(ChangeChapterOrderApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% CHANGE CHAPTER STATUS API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(ChangeChapterStatusApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(ChangeChapterStatusApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(ChangeChapterStatusApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% DELETE CHAPTER API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(DeleteChapterApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(DeleteChapterApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(DeleteChapterApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearChapterState } = ChapterSlice.actions;
export default ChapterSlice.reducer;
