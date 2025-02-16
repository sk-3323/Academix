import { APIClient } from "@/helpers/apiHelper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const URL_TOPIC = "/topic";

const api = new APIClient();

// %%%%%%%%%% GET TOPIC API %%%%%%%%%%%%
export const GetTopicApi = createAsyncThunk("GetTopicApi", async () => {
  try {
    const response = await api.get(URL_TOPIC);
    return response;
  } catch (error) {
    console.error("error", error);
    return error;
  }
});

// %%%%%%%%%% GET SINGLE TOPIC API %%%%%%%%%%%%
export const GetSingleTopicApi = createAsyncThunk(
  "GetSingleTopicApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.get(`${URL_TOPIC}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% GET SINGLE COURSE WITH PROGRESS BY TOPIC API %%%%%%%%%%%%
export const GetSingleCourseWithProgressByTopicApi = createAsyncThunk(
  "GetSingleCourseWithProgressByTopicApi",
  async ({
    courseId,
    chapterId,
    topicId,
  }: {
    courseId: string;
    chapterId: string;
    topicId: string;
  }) => {
    try {
      const response = await api.create(
        `courses/${courseId}/chapters/${chapterId}/topicId/${topicId}`
      );
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% CREATE TOPIC API %%%%%%%%%%%%
export const AddTopicApi = createAsyncThunk(
  "AddTopicApi",
  async ({
    formdata,
    requiredFields = [],
  }: {
    formdata: FormData;
    requiredFields?: string[];
  }) => {
    try {
      const response = await api.create(
        URL_TOPIC,
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

// %%%%%%%%%% EDIT TOPIC API %%%%%%%%%%%%
export const EditTopicApi = createAsyncThunk(
  "EditTopicApi",
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
        `${URL_TOPIC}/${id}`,
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

// %%%%%%%%%% CHANGE TOPIC ORDER API %%%%%%%%%%%%
export const ChangeTopicOrderApi = createAsyncThunk(
  "ChangeTopicOrderApi",
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
        `${URL_TOPIC}/change-order/${id}`,
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

// %%%%%%%%%% CHANGE TOPIC STATUS API %%%%%%%%%%%%
export const ChangeTopicStatusApi = createAsyncThunk(
  "ChangeTopicStatusApi",
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
        `${URL_TOPIC}/change-status/${id}`,
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

// %%%%%%%%%% DELETE TOPIC API %%%%%%%%%%%%
export const DeleteTopicApi = createAsyncThunk(
  "DeleteTopicApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.delete(`${URL_TOPIC}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

const TopicSlice = createSlice({
  name: "TopicSlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    data: [],
    singleData: {},
  },
  reducers: {
    clearTopicState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      //%%%%%%%%%% CREATE TOPIC API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(AddTopicApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(AddTopicApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(AddTopicApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET TOPIC API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetTopicApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(GetTopicApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action.payload?.result ? action.payload?.result : [];
      })
      .addCase(GetTopicApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET SINGLE TOPIC API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetSingleTopicApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(GetSingleTopicApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.singleData = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(GetSingleTopicApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET SINGLE COURSE WITH PROGRESS BY TOPIC API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(
        GetSingleCourseWithProgressByTopicApi.pending,
        (state, action: any) => {
          state.loading = true;
        }
      )
      .addCase(
        GetSingleCourseWithProgressByTopicApi.fulfilled,
        (state, action: any) => {
          state.loading = false;
          state.singleData = action.payload?.result
            ? action.payload?.result
            : {};
        }
      )
      .addCase(
        GetSingleCourseWithProgressByTopicApi.rejected,
        (state, action: any) => {
          state.loading = false;
          state.status = action.payload.status;
          state.message = action.payload.message;
        }
      )

      //%%%%%%%%%% EDIT TOPIC API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(EditTopicApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(EditTopicApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(EditTopicApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% CHANGE TOPIC ORDER API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(ChangeTopicOrderApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(ChangeTopicOrderApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(ChangeTopicOrderApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% CHANGE TOPIC STATUS API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(ChangeTopicStatusApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(ChangeTopicStatusApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(ChangeTopicStatusApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% DELETE TOPIC API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(DeleteTopicApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(DeleteTopicApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(DeleteTopicApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearTopicState } = TopicSlice.actions;
export default TopicSlice.reducer;
