import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AppDispatch } from "@/store/store";

type CallbackFunction = () => any;

export const useDynamicToast = (
  storeName: string,
  {
    clearState,
    callbackFunction,
  }: {
    clearState: ActionCreatorWithoutPayload;
    callbackFunction?: CallbackFunction;
  },
  redirectTo?: string
): void => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const store = useSelector((state: any) => state[storeName]);
  const { status, message } = store;

  useEffect(() => {
    if (status === true) {
      if (callbackFunction) {
        callbackFunction();
      }
      toast.success(message);
      if (redirectTo) {
        setTimeout(() => {
          router.push(redirectTo);
        }, 800);
      }
    } else if (status === false) {
      toast.error(message);
    }

    // Clear the state after handling all callbacks
    dispatch(clearState());
  }, [status, message]);
};
