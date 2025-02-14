import { APIClient } from "@/helpers/apiHelper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const URL_COURSE = "/course";

const api = new APIClient();

// %%%%%%%%%% GET COURSE API %%%%%%%%%%%%
export const GetCourseApi = createAsyncThunk(
  "GetCourseApi",
  async ({ searchParams = {} }: { searchParams: Record<string, any> }) => {
    try {
      const response = await api.get(URL_COURSE, searchParams);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% GET SINGLE COURSE API %%%%%%%%%%%%
export const GetSingleCourseApi = createAsyncThunk(
  "GetSingleCourseApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.get(`${URL_COURSE}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% CREATE COURSE API %%%%%%%%%%%%
export const AddCourseApi = createAsyncThunk(
  "AddCourseApi",
  async ({
    formdata,
    requiredFields = [],
  }: {
    formdata: FormData;
    requiredFields?: string[];
  }) => {
    try {
      const response = await api.create(
        URL_COURSE,
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

// %%%%%%%%%% EDIT COURSE API %%%%%%%%%%%%
export const EditCourseApi = createAsyncThunk(
  "EditCourseApi",
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
        `${URL_COURSE}/${id}`,
        formdata,
        { "Content-type": "multipart/form-data" },
        requiredFields
      );
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% CHANGE COURSE STATUS API %%%%%%%%%%%%
export const ChangeCourseStatusApi = createAsyncThunk(
  "ChangeCourseStatusApi",
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
        `${URL_COURSE}/change-status/${id}`,
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

// %%%%%%%%%% DELETE COURSE API %%%%%%%%%%%%
export const DeleteCourseApi = createAsyncThunk(
  "DeleteCourseApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.delete(`${URL_COURSE}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

const CourseSlice = createSlice({
  name: "CourseSlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    data: [],
    singleData: {},
  },
  reducers: {
    clearCourseState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      //%%%%%%%%%% CREATE COURSE API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(AddCourseApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(AddCourseApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
        state.singleData = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(AddCourseApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET COURSE API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetCourseApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(GetCourseApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action.payload?.result ? action.payload?.result : [];
      })
      .addCase(GetCourseApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET SINGLE COURSE API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetSingleCourseApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(GetSingleCourseApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.singleData = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(GetSingleCourseApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT COURSE API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(EditCourseApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(EditCourseApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(EditCourseApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% CHANGE COURSE STATUS API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(ChangeCourseStatusApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(ChangeCourseStatusApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(ChangeCourseStatusApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% DELETE COURSE API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(DeleteCourseApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(DeleteCourseApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(DeleteCourseApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearCourseState } = CourseSlice.actions;
export default CourseSlice.reducer;
