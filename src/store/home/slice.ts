import { APIClient } from "@/helpers/apiHelper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const URL_COURSE = "/home";

const api = new APIClient();

// %%%%%%%%%% GET COURSE API %%%%%%%%%%%%
export const GetHomeApi = createAsyncThunk(
  "GetHomeApi",
  async () => {
    try {
      const response = await api.get(URL_COURSE);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

const HomeSlice = createSlice({
  name: "HomeSlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    data: {},
  },
  reducers: {
    clearHomeState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      //%%%%%%%%%% GET COURSE API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetHomeApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetHomeApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(GetHomeApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearHomeState } = HomeSlice.actions;
export default HomeSlice.reducer;
