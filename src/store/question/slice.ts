import { APIClient } from "@/helpers/apiHelper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const URL_QUESTION = "/question";

const api = new APIClient();

// %%%%%%%%%% GET QUESTION API %%%%%%%%%%%%
export const GetQuestionApi = createAsyncThunk(
  "GetQuestionApi",
  async ({ searchParams = {} }: { searchParams: Record<string, any> }) => {
    try {
      const response = await api.get(URL_QUESTION, searchParams);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% GET SINGLE QUESTION API %%%%%%%%%%%%
export const GetSingleQuestionApi = createAsyncThunk(
  "GetSingleQuestionApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.get(`${URL_QUESTION}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% CREATE QUESTION API %%%%%%%%%%%%
export const AddQuestionApi = createAsyncThunk(
  "AddQuestionApi",
  async ({
    values,
    requiredFields = [],
  }: {
    values: any;
    requiredFields?: string[];
  }) => {
    try {
      const response = await api.create(URL_QUESTION, values, requiredFields);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% EDIT QUESTION API %%%%%%%%%%%%
export const EditQuestionApi = createAsyncThunk(
  "EditQuestionApi",
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
        `${URL_QUESTION}/${id}`,
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

// %%%%%%%%%% CHANGE QUESTION ORDER API %%%%%%%%%%%%
export const ChangeQuestionOrderApi = createAsyncThunk(
  "ChangeQuestionOrderApi",
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
        `${URL_QUESTION}/change-order/${id}`,
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

// %%%%%%%%%% CHANGE QUESTION STATUS API %%%%%%%%%%%%
export const ChangeQuestionStatusApi = createAsyncThunk(
  "ChangeQuestionStatusApi",
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
        `${URL_QUESTION}/change-status/${id}`,
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

// %%%%%%%%%% DELETE QUESTION API %%%%%%%%%%%%
export const DeleteQuestionApi = createAsyncThunk(
  "DeleteQuestionApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.delete(`${URL_QUESTION}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

const QuestionSlice = createSlice({
  name: "QuestionSlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    data: [],
    singleData: {},
  },
  reducers: {
    clearQuestionState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      //%%%%%%%%%% CREATE QUESTION API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(AddQuestionApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(AddQuestionApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(AddQuestionApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET QUESTION API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetQuestionApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetQuestionApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action.payload?.result ? action.payload?.result : [];
      })
      .addCase(GetQuestionApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET SINGLE QUESTION API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetSingleQuestionApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetSingleQuestionApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.singleData = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(GetSingleQuestionApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT QUESTION API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(EditQuestionApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(EditQuestionApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(EditQuestionApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% CHANGE QUESTION ORDER API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(ChangeQuestionOrderApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(ChangeQuestionOrderApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(ChangeQuestionOrderApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% CHANGE QUESTION STATUS API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(ChangeQuestionStatusApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(ChangeQuestionStatusApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(ChangeQuestionStatusApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% DELETE QUESTION API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(DeleteQuestionApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(DeleteQuestionApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(DeleteQuestionApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearQuestionState } = QuestionSlice.actions;
export default QuestionSlice.reducer;
