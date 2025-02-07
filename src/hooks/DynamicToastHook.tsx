import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ActionCreatorWithoutPayload, AsyncThunk, AsyncThunkOptions } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useDynamicToast = (storeName:string, {clearState,callbackDispatches}:{clearState:ActionCreatorWithoutPayload,callbackDispatches?:AsyncThunk<unknown, void|any,any>[],}, redirectTo?:string) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const store = useSelector((state:any) => state[storeName]);
  const { loading, status, message } = store;
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  useEffect(() => {
    if (status === true) {
      toast.success(message);
      
      dispatch(clearState()); // Clear the state using dynamic action

      if (callbackDispatches && callbackDispatches?.length > 0) {
        callbackDispatches.forEach((thunk:any) => {
          dispatch(thunk());
        });
      }

      if (redirectTo) {
        setTimeout(() => {
          router.push(redirectTo);
        }, 500);
      }
    } else if (status === false) {
      toast.error(message);

      dispatch(clearState()); // Clear the state using dynamic action
    }
    setLoading(false);
  }, [status,  message, dispatch ,clearState,callbackDispatches]);

  return { isLoading, setLoading };
};
