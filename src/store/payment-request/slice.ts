import { APIClient } from "@/helpers/apiHelper";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const URL_OPTION: string = "/teacher-payment-req";

const api = new APIClient();

// %%%%%%%%%% GET PAYMENT REQUEST API %%%%%%%%%%%%
export const GetPaymentRequestApi = createAsyncThunk(
  "GetPaymentRequestApi",
  async ({ searchParams }: { searchParams: Record<string, any> }) => {
    try {
      const response = await api.get(URL_OPTION, searchParams);
      return response;
    } catch (error) {
      console.error(error, "error");
      return error;
    }
  }
);

export const AddPaymentRequestApi = createAsyncThunk(
  "AddPaymentRequestApi",
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
const PaymentRequestSlice = createSlice({
  name: "PaymentRequestSlice",
  initialState: {
    status: null,
    loading: false,
    message: "",
    data: [],
    singleData: {},
  },
  reducers: {
    clearPaymentRequestState: (state) => {
      state.status = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      //%%%%%%%%%% CREATE PAYMENT REQUEST API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(AddPaymentRequestApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(AddPaymentRequestApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(AddPaymentRequestApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })

      //%%%%%%%%%% GET PAYMENT REQUEST API HANDLE %%%%%%%%%%%%%%%%%%%%
      .addCase(GetPaymentRequestApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetPaymentRequestApi.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
        state.data = action.payload.data;
      })
      .addCase(GetPaymentRequestApi.rejected, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      });
  },
});

export const { clearPaymentRequestState } = PaymentRequestSlice.actions;

export default PaymentRequestSlice.reducer;
