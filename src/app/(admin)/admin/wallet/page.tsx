// "use client";
// import { APIClient } from "@/helpers/apiHelper";
// import { AppDispatch } from "@/store/store";
// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { toast } from "sonner";

// const page = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [transactions, setTransactions] = useState();
//   const getTransactions = async () => {
//     try {
//       const api = new APIClient();
//       const res: any = await api.get("/transaction");
//       console.log(res.result);
//       setTransactions(res.result);
//     } catch (error: any) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };
//   useEffect(() => {
//     getTransactions();
//   }, []);
//   return <div> wallet page</div>;
// };

// export default page;
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ArrowUpRight, Calendar, User } from "lucide-react";
import { toast } from "sonner";
import { APIClient } from "@/helpers/apiHelper";
import { useSelector } from "react-redux";

export default function WalletPage() {
  const [transactions, setTransactions] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const router = useRouter();
  const { singleData: currentUser } = useSelector(
    (state: any) => state.UserStore
  );
  // Fetch transactions - replace with your API call
  const getTransactions = async () => {
    try {
      const api = new APIClient();
      const res: any = await api.get("/transaction");
      setTransactions(res.result);
      const balance = res?.result?.reduce((total, transaction) => {
        console.log(total, transaction);

        if (transaction.type === "CREDIT") {
          // If admin is viewing
          if (currentUser.role === "ADMIN") {
            // If admin is the course creator, they get 100%
            if (transaction.course.instructorId === currentUser.id) {
              return total + transaction.amount;
            } else {
              // Admin gets 20% of each transaction
              return total + transaction.amount * 0.2;
            }
          }
          // If teacher is viewing
          else if (currentUser.role === "TEACHER") {
            // Teacher gets 80% of each transaction for their courses
            return total + transaction.amount * 0.8;
          }
        }
        return total;
      }, 0);
      setWalletBalance(balance);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    getTransactions();
  }, []);

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate amount based on role and transaction
  const calculateAmount = (transaction) => {
    if (currentUser.role === "ADMIN") {
      // If admin is the course creator, they get 100%
      if (transaction.course.instructorId === currentUser.id) {
        return transaction.amount;
      } else {
        // Admin gets 20% of each transaction
        return transaction.amount * 0.2;
      }
    } else if (currentUser.role === "TEACHER") {
      // Teacher gets 80% of each transaction for their courses
      return transaction.amount * 0.8;
    }
    return 0;
  };
  console.log(walletBalance);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Wallet Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Wallet Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{walletBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentUser.role === "ADMIN"
                ? "Admin receives 20% of all course sales (100% for own courses)"
                : "Teachers receive 80% of their course sales"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">
              {currentUser.role === "ADMIN"
                ? "All platform transactions"
                : "Transactions for your courses"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Type</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUser.role}</div>
            <p className="text-xs text-muted-foreground">
              {currentUser.username}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="credits">Credits</TabsTrigger>
          <TabsTrigger value="debits">Debits</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                {currentUser.role === "ADMIN"
                  ? "View all platform transactions"
                  : "View transactions for your courses"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex flex-col md:flex-row justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-start gap-4 mb-2 md:mb-0">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={transaction.user.avatar || "/placeholder.svg"}
                            alt={transaction.user.username}
                          />
                          <AvatarFallback>
                            {transaction.user.username
                              .substring(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {transaction.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={
                                transaction.type === "CREDIT"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {transaction.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(transaction.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span
                          className={`font-bold ${transaction.type === "CREDIT" ? "text-green-600" : "text-red-600"}`}
                        >
                          {transaction.type === "CREDIT" ? "+" : "-"}₹
                          {calculateAmount(transaction).toFixed(2)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {transaction.type === "CREDIT"
                            ? currentUser.role === "ADMIN"
                              ? transaction.course.instructorId ===
                                currentUser.id
                                ? "100% (Own Course)"
                                : "20% Admin Share"
                              : "80% Teacher Share"
                            : "Debit"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    No transactions found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credits">
          <Card>
            <CardHeader>
              <CardTitle>Credit Transactions</CardTitle>
              <CardDescription>
                Money received from course sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.filter((t) => t.type === "CREDIT").length > 0 ? (
                  transactions
                    .filter((t) => t.type === "CREDIT")
                    .map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex flex-col md:flex-row justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-start gap-4 mb-2 md:mb-0">
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={
                                transaction.user.avatar || "/placeholder.svg"
                              }
                              alt={transaction.user.username}
                            />
                            <AvatarFallback>
                              {transaction.user.username
                                .substring(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {transaction.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge>CREDIT</Badge>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(transaction.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-green-600">
                            +₹{calculateAmount(transaction).toFixed(2)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {currentUser.role === "ADMIN"
                              ? transaction.course.instructorId ===
                                currentUser.id
                                ? "100% (Own Course)"
                                : "20% Admin Share"
                              : "80% Teacher Share"}
                          </span>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    No credit transactions found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debits">
          <Card>
            <CardHeader>
              <CardTitle>Debit Transactions</CardTitle>
              <CardDescription>Money withdrawn or spent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.filter((t) => t.type === "DEBIT").length > 0 ? (
                  transactions
                    .filter((t) => t.type === "DEBIT")
                    .map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex flex-col md:flex-row justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-start gap-4 mb-2 md:mb-0">
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={
                                transaction.user.avatar || "/placeholder.svg"
                              }
                              alt={transaction.user.username}
                            />
                            <AvatarFallback>
                              {transaction.user.username
                                .substring(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {transaction.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="destructive">DEBIT</Badge>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(transaction.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-red-600">
                            -₹{calculateAmount(transaction).toFixed(2)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Withdrawal
                          </span>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    No debit transactions found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
