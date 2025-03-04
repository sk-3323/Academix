import { APIClient } from "@/helpers/apiHelper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const URL_QUIZ_ANSWER = "/quiz-answer";

const api = new APIClient();

// %%%%%%%%%% GET QUIZ-ANSWER API %%%%%%%%%%%%
export const GetQuizAnswerApi = createAsyncThunk(
  "GetQuizAnswerApi",
  async () => {
    try {
      const response = await api.get(URL_QUIZ_ANSWER);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% GET SINGLE QUIZ-ANSWER API %%%%%%%%%%%%
export const GetSingleQuizAnswerApi = createAsyncThunk(
  "GetSingleQuizAnswerApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.get(`${URL_QUIZ_ANSWER}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% CREATE QUIZ-ANSWER API %%%%%%%%%%%%
export const AddQuizAnswerApi = createAsyncThunk(
  "AddQuizAnswerApi",
  async ({
    values,
    requiredFields = [],
  }: {
    values: any;
    requiredFields?: string[];
  }) => {
    try {
      const response = await api.create(
        URL_QUIZ_ANSWER,
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

// %%%%%%%%%% EDIT QUIZ-ANSWER API %%%%%%%%%%%%
export const EditQuizAnswerApi = createAsyncThunk(
  "EditQuizAnswerApi",
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
        `${URL_QUIZ_ANSWER}/${id}`,
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

// %%%%%%%%%% DELETE QUIZ-ANSWER API %%%%%%%%%%%%
export const DeleteQuizAnswerApi = createAsyncThunk(
  "DeleteQuizAnswerApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.delete(`${URL_QUIZ_ANSWER}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

const QuizAnswerSlice = createSlice({
  name: "QuizAnswerSlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    data: [],
    singleData: {},
  },
  reducers: {
    clearQuizAnswerState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
    clearQuizAnswerData: (state) => {
      state.singleData = {};
    },
  },
  extraReducers: (builder) => {
    builder
      //%%%%%%%%%% CREATE QUIZ-ANSWER API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(AddQuizAnswerApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(AddQuizAnswerApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
        state.singleData = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(AddQuizAnswerApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET QUIZ-ANSWER API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetQuizAnswerApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetQuizAnswerApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action.payload?.result ? action.payload?.result : [];
      })
      .addCase(GetQuizAnswerApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET SINGLE QUIZ-ANSWER API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetSingleQuizAnswerApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetSingleQuizAnswerApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.singleData = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(GetSingleQuizAnswerApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT QUIZ-ANSWER API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(EditQuizAnswerApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(EditQuizAnswerApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(EditQuizAnswerApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% DELETE QUIZ-ANSWER API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(DeleteQuizAnswerApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(DeleteQuizAnswerApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(DeleteQuizAnswerApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearQuizAnswerState, clearQuizAnswerData } =
  QuizAnswerSlice.actions;
export default QuizAnswerSlice.reducer;
