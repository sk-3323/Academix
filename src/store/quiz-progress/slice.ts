import { APIClient } from "@/helpers/apiHelper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const URL_QUIZ_PROGRESS = "/quiz-progress";

const api = new APIClient();

// %%%%%%%%%% GET QUIZ-PROGRESS API %%%%%%%%%%%%
export const GetQuizProgressApi = createAsyncThunk(
  "GetQuizProgressApi",
  async () => {
    try {
      const response = await api.get(URL_QUIZ_PROGRESS);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% GET SINGLE QUIZ-PROGRESS API %%%%%%%%%%%%
export const GetSingleQuizProgressApi = createAsyncThunk(
  "GetSingleQuizProgressApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.get(`${URL_QUIZ_PROGRESS}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% CREATE QUIZ-PROGRESS API %%%%%%%%%%%%
export const AddQuizProgressApi = createAsyncThunk(
  "AddQuizProgressApi",
  async ({
    values,
    requiredFields = [],
  }: {
    values: any;
    requiredFields?: string[];
  }) => {
    try {
      const response = await api.create(
        URL_QUIZ_PROGRESS,
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

// %%%%%%%%%% EDIT QUIZ-PROGRESS API %%%%%%%%%%%%
export const EditQuizProgressApi = createAsyncThunk(
  "EditQuizProgressApi",
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
        `${URL_QUIZ_PROGRESS}/${id}`,
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

// %%%%%%%%%% DELETE QUIZ-PROGRESS API %%%%%%%%%%%%
export const DeleteQuizProgressApi = createAsyncThunk(
  "DeleteQuizProgressApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.delete(`${URL_QUIZ_PROGRESS}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

const QuizProgressSlice = createSlice({
  name: "QuizProgressSlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    data: [],
    singleData: {},
  },
  reducers: {
    clearQuizProgressState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      //%%%%%%%%%% CREATE QUIZ-PROGRESS API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(AddQuizProgressApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(AddQuizProgressApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(AddQuizProgressApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET QUIZ-PROGRESS API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetQuizProgressApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetQuizProgressApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action.payload?.result ? action.payload?.result : [];
      })
      .addCase(GetQuizProgressApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET SINGLE QUIZ-PROGRESS API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetSingleQuizProgressApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetSingleQuizProgressApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.singleData = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(GetSingleQuizProgressApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT QUIZ-PROGRESS API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(EditQuizProgressApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(EditQuizProgressApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(EditQuizProgressApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% DELETE QUIZ-PROGRESS API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(DeleteQuizProgressApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(DeleteQuizProgressApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(DeleteQuizProgressApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearQuizProgressState } = QuizProgressSlice.actions;
export default QuizProgressSlice.reducer;
