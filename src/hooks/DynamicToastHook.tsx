import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ActionCreatorWithoutPayload, AsyncThunk } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AppDispatch } from "@/store/store";

type ThunkWithArgs = { thunk: AsyncThunk<unknown, any, any>; args?: any };
type CallbackFunction = () => any;

export const useDynamicToast = (
  storeName: string,
  {
    clearState,
    callbackDispatches,
    callbackFunctions,
  }: {
    clearState: ActionCreatorWithoutPayload;
    callbackDispatches?: ThunkWithArgs[];
    callbackFunctions?: CallbackFunction[];
  },
  redirectTo?: string
) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const store = useSelector((state: any) => state[storeName]);
  const { loading, status, message } = store;
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  useEffect(() => {
    if (status === true) {
      toast.success(message);

      dispatch(clearState()); // Clear the state using dynamic action

      if (callbackDispatches && callbackDispatches.length > 0) {
        callbackDispatches.forEach(({ thunk, args = {} }) => {
          dispatch(thunk(args)); // Dispatch with dynamic parameters
        });
      }

      if (callbackFunctions && callbackFunctions?.length > 0) {
        callbackFunctions.forEach((cb: any) => {
          cb();
        });
      }

      if (redirectTo) {
        setTimeout(() => {
          router.push(redirectTo);
        }, 200);
      }
    } else if (status === false) {
      toast.error(message);

      dispatch(clearState()); // Clear the state using dynamic action
    }
    setLoading(false);
  }, [status, message, dispatch, clearState, callbackDispatches]);

  return { isLoading, setLoading };
};
