import { APIClient } from "@/helpers/apiHelper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const URL_ENROLLMENT = "/enrollment";

const api = new APIClient();

// %%%%%%%%%% GET ENROLLMENT API %%%%%%%%%%%%
export const GetEnrollmentApi = createAsyncThunk(
  "GetEnrollmentApi",
  async ({ searchParams = {} }: { searchParams: Record<string, any> }) => {
    try {
      const response = await api.get(URL_ENROLLMENT, searchParams);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% GET SINGLE ENROLLMENT API %%%%%%%%%%%%
export const GetSingleEnrollmentApi = createAsyncThunk(
  "GetSingleEnrollmentApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.get(`${URL_ENROLLMENT}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% CREATE ENROLLMENT API %%%%%%%%%%%%
export const AddEnrollmentApi = createAsyncThunk(
  "AddEnrollmentApi",
  async ({
    values,
    requiredFields = [],
  }: {
    values: any;
    requiredFields?: string[];
  }) => {
    try {
      const response = await api.create(URL_ENROLLMENT, values, requiredFields);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% CHECKOUT COURSE API %%%%%%%%%%%%
export const CheckoutCourseApi = createAsyncThunk(
  "CheckoutCourseApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.create(`/course/${id}/checkout`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% CHECKOUT COURSE API %%%%%%%%%%%%
export const ApproveCoursePaymentApi = createAsyncThunk(
  "ApproveCoursePaymentApi",
  async ({
    courseId,
    enroll_id,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
  }: {
    courseId: string;
    enroll_id: string;
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => {
    try {
      const response = await api.update(
        `/course/${courseId}/approve-payment/${enroll_id}`,
        { razorpay_payment_id, razorpay_order_id, razorpay_signature }
      );
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

// %%%%%%%%%% EDIT ENROLLMENT API %%%%%%%%%%%%
export const EditEnrollmentApi = createAsyncThunk(
  "EditEnrollmentApi",
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
        `${URL_ENROLLMENT}/${id}`,
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

// %%%%%%%%%% DELETE ENROLLMENT API %%%%%%%%%%%%
export const DeleteEnrollmentApi = createAsyncThunk(
  "DeleteEnrollmentApi",
  async ({ id }: { id: string }) => {
    try {
      const response = await api.delete(`${URL_ENROLLMENT}/${id}`);
      return response;
    } catch (error) {
      console.error("error", error);
      return error;
    }
  }
);

const EnrollmentSlice = createSlice({
  name: "EnrollmentSlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    data: [],
    singleData: {},
  },
  reducers: {
    clearEnrollmentState: (state) => {
      state.status = null;
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      //%%%%%%%%%% CREATE ENROLLMENT API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(AddEnrollmentApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(AddEnrollmentApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(AddEnrollmentApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% CHECKOUT COURSE API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(CheckoutCourseApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(CheckoutCourseApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
        state.singleData = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(CheckoutCourseApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% APPROVE COURSE PAYMENT API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(ApproveCoursePaymentApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(ApproveCoursePaymentApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
        state.singleData = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(ApproveCoursePaymentApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET ENROLLMENT API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetEnrollmentApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(GetEnrollmentApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action.payload?.result ? action.payload?.result : [];
      })
      .addCase(GetEnrollmentApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET SINGLE ENROLLMENT API HANDLE %%%%%%%%%%%%%%%%%%%
      .addCase(GetSingleEnrollmentApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(GetSingleEnrollmentApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.singleData = action.payload?.result ? action.payload?.result : {};
      })
      .addCase(GetSingleEnrollmentApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% EDIT ENROLLMENT API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(EditEnrollmentApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(EditEnrollmentApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(EditEnrollmentApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% DELETE ENROLLMENT API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(DeleteEnrollmentApi.pending, (state, action: any) => {
        state.loading = true;
      })
      .addCase(DeleteEnrollmentApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(DeleteEnrollmentApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearEnrollmentState } = EnrollmentSlice.actions;
export default EnrollmentSlice.reducer;
