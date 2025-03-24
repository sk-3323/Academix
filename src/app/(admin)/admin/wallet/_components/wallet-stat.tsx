import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUpRight } from "lucide-react";

interface WalletStatsProps {
  balance: number;
  totalTransactions: number;
  role: string;
}

export function WalletStats({
  balance,
  totalTransactions,
  role,
}: WalletStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{balance.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {role === "ADMIN"
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
          <div className="text-2xl font-bold">{totalTransactions}</div>
          <p className="text-xs text-muted-foreground">
            {role === "ADMIN"
              ? "All platform transactions"
              : "Transactions for your courses"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Account Type</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{role}</div>
          <p className="text-xs text-muted-foreground">
            {role === "ADMIN" ? "Platform administrator" : "Course instructor"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
