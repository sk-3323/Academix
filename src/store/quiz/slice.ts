import { APIClient } from "@/helpers/apiHelper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const URL_QUIZ = "/quiz";

const api = new APIClient();

// %%%%%%%%%% GET QUIZ API %%%%%%%%%%%%
export const GetQuizApi = createAsyncThunk(
  "GetQuizApi",
  async ({ searchParams = {} }: { searchParams: Record<string, any> }) => {
    try {
      const response = await api.get(URL_QUIZ, searchParams);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% GET SINGLE QUIZ API %%%%%%%%%%%%
export const GetSingleQuizApi = createAsyncThunk(
  "GetSingleQuizApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.get(`${URL_QUIZ}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% CREATE QUIZ API %%%%%%%%%%%%
export const AddQuizApi = createAsyncThunk(
  "AddQuizApi",
  async ({
    values,
    requiredFields = [],
  }: {
    values: any;
    requiredFields?: string[];
  }) => {
    try {
      const response = await api.create(URL_QUIZ, values, requiredFields);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% EDIT QUIZ API %%%%%%%%%%%%
export const EditQuizApi = createAsyncThunk(
  "EditQuizApi",
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
        `${URL_QUIZ}/${id}`,
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

// %%%%%%%%%% CHANGE QUIZ ORDER API %%%%%%%%%%%%
export const ChangeQuizOrderApi = createAsyncThunk(
  "ChangeQuizOrderApi",
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
        `${URL_QUIZ}/change-order/${id}`,
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

// %%%%%%%%%% CHANGE QUIZ STATUS API %%%%%%%%%%%%
export const ChangeQuizStatusApi = createAsyncThunk(
  "ChangeQuizStatusApi",
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
        `${URL_QUIZ}/change-status/${id}`,
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

// %%%%%%%%%% DELETE QUIZ API %%%%%%%%%%%%
export const DeleteQuizApi = createAsyncThunk(
  "DeleteQuizApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.delete(`${URL_QUIZ}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

const QuizSlice = createSlice({
  name: "QuizSlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    data: [],
    singleData: {},
  },
  reducers: {
    clearQuizState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      //%%%%%%%%%% CREATE QUIZ API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(AddQuizApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(AddQuizApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(AddQuizApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET QUIZ API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetQuizApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(GetQuizApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action.payload?.result ? action.payload?.result : [];
      })
      .addCase(GetQuizApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET SINGLE QUIZ API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetSingleQuizApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(GetSingleQuizApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.singleData = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(GetSingleQuizApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT QUIZ API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(EditQuizApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(EditQuizApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(EditQuizApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% CHANGE QUIZ ORDER API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(ChangeQuizOrderApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(ChangeQuizOrderApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(ChangeQuizOrderApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% CHANGE QUIZ STATUS API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(ChangeQuizStatusApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(ChangeQuizStatusApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(ChangeQuizStatusApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% DELETE QUIZ API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(DeleteQuizApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(DeleteQuizApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(DeleteQuizApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearQuizState } = QuizSlice.actions;
export default QuizSlice.reducer;
