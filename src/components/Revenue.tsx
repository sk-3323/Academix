import { APIClient } from "@/helpers/apiHelper";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Revenue = ({ userId }: { userId: string }) => {
  const [toalRevenue, setTotalRevenue] = useState(0);
  const getTransactions = async () => {
    try {
      const api = new APIClient();

      const res: any = await api.get(`/transaction?userId=${userId}`);

      const balance = res?.result?.reduce((total: any, transaction: any) => {
        return total + transaction.amount;
      }, 0); // Initial value is 0
      setTotalRevenue(balance);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (userId) {
      getTransactions();
    }
  }, [userId]);
  return <div>₹ {toalRevenue}</div>;
};

export default Revenue;
