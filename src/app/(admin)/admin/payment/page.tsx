"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Check,
  Download,
  Filter,
  MoreHorizontal,
  Search,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { format } from "date-fns";
// Sample data

export default function PaymentManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [adminWallet, setAdminWallet] = useState(0);
  const { data: users } = useSelector((state: any) => state.UserStore);

  // Calculate total revenue and update metrics
  useEffect(() => {
    if (users && users.length > 0) {
      const revenue = users.reduce((acc: number, user: any) => {
        if (
          user.role !== "ADMIN" &&
          user.enrollments &&
          user.enrollments.length > 0
        ) {
          return (
            acc +
            user.enrollments.reduce(
              (sum: number, enroll: any) => sum + (enroll.price || 0),
              0
            )
          );
        }
        return acc;
      }, 0);
      setTotalRevenue(revenue);

      const adminWalletRevenue = users.reduce((acc: number, user: any) => {
        if (
          user.role === "ADMIN" &&
          user.enrollments &&
          user.enrollments.length > 0
        ) {
          return (
            acc +
            user.enrollments.reduce(
              (sum: number, enroll: any) => sum + (enroll.price || 0),
              0
            )
          );
        }
        return acc;
      }, 0);
      setAdminWallet(adminWalletRevenue + revenue * 0.5);
    }
  }, [users]);

  // Extract transactions from enrollments
  const transactions = users
    .flatMap((user: any) =>
      user.enrollments.map((enroll: any) => ({
        id: enroll.id,
        user: user.username,
        course: enroll.course?.title || "Unknown Course",
        date: format(new Date(enroll.createdAt), "yyyy-MM-dd"),
        amount: enroll.price || 0,
        status:
          enroll.payment_status === "PAID" && enroll.status === "ACTIVE"
            ? "Completed"
            : "Pending",
      }))
    )
    .filter((t: any) => t.course !== "Unknown Course");

  // Generate teacher payout requests
  const payoutRequests = users
    .filter(
      (user: any) => user.role === "TEACHER" && user.authoredCourses.length > 0
    )
    .map((teacher: any) => {
      const totalEarnings = teacher.authoredCourses.reduce(
        (acc: number, course: any) => {
          return (
            acc +
            course.enrollments.reduce(
              (sum: number, enroll: any) => sum + (enroll.price || 0),
              0
            )
          );
        },
        0
      );
      const payoutAmount = totalEarnings * 0.5; // 50% to instructor
      return {
        id: `${teacher.id}-payout`,
        teacher: teacher.username,
        amount: payoutAmount,
        requestDate: format(new Date(), "yyyy-MM-dd"), // Simulated date
        accountDetails: `${teacher.email} (Bank TBD)`, // Simulated account
        status: totalEarnings > 0 ? "Pending" : "Completed",
        courses: teacher.authoredCourses.length,
        students: teacher.authoredCourses.reduce(
          (acc: number, course: any) => acc + course.enrollments.length,
          0
        ),
      };
    })
    .filter((request: any) => request.amount > 0);

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(
    (transaction: any) =>
      transaction.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter payout requests based on search query
  const filteredPayoutRequests = payoutRequests.filter((request: any) =>
    request.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApproveRequest = (requestId: string) => {
    // Simulate payout completion (update status in real app via API)
    const updatedRequests = payoutRequests.map((req: any) =>
      req.id === requestId ? { ...req, status: "Completed" } : req
    );
    setIsDialogOpen(false);
    // In a real app, dispatch an API call to update payout status
  };

  const handleRejectRequest = (requestId: string) => {
    // Simulate rejection (update status in real app via API)
    const updatedRequests = payoutRequests.map((req: any) =>
      req.id === requestId ? { ...req, status: "Rejected" } : req
    );
    setIsDialogOpen(false);
    // In a real app, dispatch an API call to update payout status
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "Pending":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Pending
          </Badge>
        );
      case "Refunded":
        return <Badge variant="destructive">Refunded</Badge>;
      case "Processing":
        return <Badge className="bg-blue-500">Processing</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Payment Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{adminWallet.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From All Enrollments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue From Other Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{(totalRevenue * 0.5).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">50% commission</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {payoutRequests
                .reduce(
                  (acc: any, req: any) =>
                    acc + (req.status === "Pending" ? req.amount : 0),
                  0
                )
                .toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {
                payoutRequests.filter((req: any) => req.status === "Pending")
                  .length
              }{" "}
              requests pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total active enrollments
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="overview"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="overview">Transactions Overview</TabsTrigger>
          <TabsTrigger value="payouts">Teacher Payout Requests</TabsTrigger>
        </TabsList>

        <div className="flex justify-between items-center mt-6">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder={
                activeTab === "overview"
                  ? "Search transactions..."
                  : "Search requests..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction: any) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.user}</TableCell>
                        <TableCell>{transaction.course}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>₹{transaction.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Send Receipt</DropdownMenuItem>
                              {transaction.status !== "Refunded" && (
                                <DropdownMenuItem className="text-destructive">
                                  Process Refund
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayoutRequests.length > 0 ? (
                    filteredPayoutRequests.map((request: any) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {request.teacher.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {request.teacher}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {request.courses} courses, {request.students}{" "}
                                students
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          ₹{request.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>{request.requestDate}</TableCell>
                        <TableCell>{request.accountDetails}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-right">
                          {request.status === "Pending" ? (
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setIsDialogOpen(true);
                                }}
                              >
                                View Details
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                className="h-8"
                                onClick={() => handleApproveRequest(request.id)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8"
                              onClick={() => {
                                setSelectedRequest(request);
                                setIsDialogOpen(true);
                              }}
                            >
                              View Details
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        No payout requests found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payout Request Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payout Request Details</DialogTitle>
            <DialogDescription>
              Review the teacher's payout request details before approving or
              rejecting.
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {selectedRequest?.teacher?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedRequest.teacher}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.courses} courses,{" "}
                    {selectedRequest.students} students
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Amount
                  </p>
                  <p className="text-lg font-semibold">
                    ₹{selectedRequest.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Request Date
                  </p>
                  <p>{selectedRequest.requestDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Account Details
                  </p>
                  <p>{selectedRequest.accountDetails}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <p>{getStatusBadge(selectedRequest.status)}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between sm:justify-between">
            {selectedRequest && selectedRequest.status === "Pending" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleRejectRequest(selectedRequest.id)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleApproveRequest(selectedRequest.id)}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve Payout
                </Button>
              </>
            )}
            {selectedRequest && selectedRequest.status !== "Pending" && (
              <Button
                variant="outline"
                className="ml-auto"
                onClick={() => setIsDialogOpen(false)}
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
