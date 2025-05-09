"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockPayments = [
  {
    id: "PAY001",
    orderId: "ORD001",
    amount: 150.75,
    paymentDate: "2025-05-01",
    paymentMethod: "Credit Card",
    status: "Completed",
  },
  {
    id: "PAY002",
    orderId: "ORD002",
    amount: 89.99,
    paymentDate: "2025-05-03",
    paymentMethod: "PayPal",
    status: "Pending",
  },
  {
    id: "PAY003",
    orderId: "ORD003",
    amount: 210.0,
    paymentDate: "2025-05-05",
    paymentMethod: "Bank Transfer",
    status: "Completed",
  },
  {
    id: "PAY004",
    orderId: "ORD004",
    amount: 75.50,
    paymentDate: "2025-05-08",
    paymentMethod: "Credit Card",
    status: "Failed",
  },
];

type PaymentStatus = "Completed" | "Pending" | "Failed";

const getStatusBadgeVariant = (status: PaymentStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Completed":
      return "default"; // Changed from "success"
    case "Pending":
      return "secondary";
    case "Failed":
      return "destructive";
    default:
      return "outline"; // Ensured default returns a valid variant
  }
};

export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payments</h1>
        <Link href="/paiements/new">
          <Button className="flex items-center gap-2">
            <PlusCircle size={20} />
            Record New Payment
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment List</CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search payments..." className="pl-8 w-full md:w-1/3" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>
                    <Link href={`/commandes/${payment.orderId}`} className="hover:underline text-blue-600 dark:text-blue-400">
                      {payment.orderId}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{payment.paymentDate}</TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(payment.status as PaymentStatus)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/paiements/${payment.id}`}>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                        </Link>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
