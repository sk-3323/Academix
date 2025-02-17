"use client";

import { Button } from "@/components/ui/button";
import { useDynamicToast } from "@/hooks/DynamicToastHook";
import { formatPrice } from "@/lib/format";
import {
  CheckoutCourseApi,
  clearEnrollmentState,
} from "@/store/enrollment/slice";
import { AppDispatch } from "@/store/store";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const CourseEnrollButton = ({
  courseId,
  price,
}: CourseEnrollButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { singleData: enrollment } = useSelector(
    (state: any) => state["EnrollmentStore"]
  );

  const { data: session } = useSession();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSucess = async () => {
    try {
      setIsProcessing(true);
      let options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: price * 100,
        currency: "INR",
        name: "Academix-E Learning",
        description: "Test purchase of the course",
        order_id: enrollment?.orderId,
        handler: function (request: any) {
          console.log("Payment successfull");
        },
        prefill: {
          name: session?.user?.username,
          email: session?.user?.email,
          contact: session?.user?.phone,
        },
        theme: {
          color: "#27E0B3",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
      console.log("aave");
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  useDynamicToast("EnrollmentStore", {
    clearState: clearEnrollmentState,
    callbackFunction: handleSucess,
  });

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      await dispatch(
        CheckoutCourseApi({
          id: courseId,
        })
      );
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        className="w-full md:w-auto"
        onClick={handleCheckout}
        disabled={isProcessing}
      >
        {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
        Enroll for {formatPrice(price)}
      </Button>
    </>
  );
};
