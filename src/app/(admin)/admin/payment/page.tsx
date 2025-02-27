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

const transactions = [
  {
    id: 1,
    user: "Shubham kaniya",
    course: "Introduction to React",
    amount: 49.99,
    status: "Completed",
  },
  {
    id: 2,
    user: "Rishi Gaiwala",
    course: "Advanced JavaScript",
    amount: 79.99,
    status: "Pending",
  },
  {
    id: 3,
    user: "Mann Khatri",
    course: "Python for Beginners",
    amount: 29.99,
    status: "Refunded",
  },
];

export default function Payments() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Payment and Subscription Management
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹13,670</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2,130</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Refunds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹450</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between">
        <Input className="w-64" placeholder="Search transactions..." />
        <Button>Export Report</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.user}</TableCell>
              <TableCell>{transaction.course}</TableCell>
              <TableCell>₹{transaction.amount.toFixed(2)}</TableCell>
              <TableCell>{transaction.status}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2">
                  Details
                </Button>
                <Button variant="destructive">Refund</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
