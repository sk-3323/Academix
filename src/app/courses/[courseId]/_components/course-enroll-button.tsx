"use client";

import { Button } from "@/components/ui/button";
import { useDynamicToast } from "@/hooks/DynamicToastHook";
import { formatPrice } from "@/lib/format";
import {
  ApproveCoursePaymentApi,
  CheckoutCourseApi,
  clearEnrollmentState,
} from "@/store/enrollment/slice";
import { AppDispatch } from "@/store/store";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
  setActions: any;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const CourseEnrollButton = ({
  courseId,
  price,
  setActions,
}: CourseEnrollButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { singleData: enrollment } = useSelector(
    (state: any) => state["EnrollmentStore"]
  );

  const { data: session } = useSession();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [shouldInitiatePayment, setShouldInitiatePayment] = useState(false);

  const handlePaymentInitiation = async () => {
    try {
      let options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: price * 100,
        currency: "INR",
        name: "Academix E-Learning",
        description: "Test purchase of the course",
        order_id: enrollment?.orderId,
        notes: {
          course_name: enrollment?.course?.title,
          course_id: courseId,
          description: `Enrolling in ${enrollment?.course?.title}`,
          user_email: session?.user?.email,
          user_name: session?.user?.username,
        },
        handler: async function (response: any) {
          setActions((current: any) => {
            return {
              ...current,
              callbackFunction: () => {
                window.location.reload();
              },
            };
          });

          await dispatch(
            ApproveCoursePaymentApi({
              courseId: courseId,
              enroll_id: enrollment?.id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            })
          );
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
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      throw error;
    }
  };

  // Watch for enrollment data changes and initiate payment when ready
  useEffect(() => {
    if (shouldInitiatePayment && enrollment?.orderId) {
      handlePaymentInitiation();
      setShouldInitiatePayment(false);
    }
  }, [enrollment, shouldInitiatePayment]);

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      setShouldInitiatePayment(true);

      setActions((current: any) => {
        return { ...current, callbackFunction: () => {} };
      });

      await dispatch(
        CheckoutCourseApi({
          id: courseId,
        })
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message);
      setIsProcessing(false);
      setShouldInitiatePayment(false);
      throw error;
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
