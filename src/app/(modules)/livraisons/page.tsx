import Link from "next/link";
import { PlusCircle, Search, MoreHorizontal } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

// Mock data for deliveries
const deliveries = [
  {
    id: "LIV001",
    orderId: "CMD001",
    carrier: "Carrier Express",
    status: "Shipped",
    estimatedDelivery: "2025-05-15",
    actualDelivery: null,
    shippingAddress: "123 Main St, Anytown, USA",
  },
  {
    id: "LIV002",
    orderId: "CMD002",
    carrier: "Speedy Logistics",
    status: "Delivered",
    estimatedDelivery: "2025-05-10",
    actualDelivery: "2025-05-09",
    shippingAddress: "456 Oak Ave, Otherville, USA",
  },
  {
    id: "LIV003",
    orderId: "CMD003",
    carrier: "Reliable Transport",
    status: "Pending",
    estimatedDelivery: "2025-05-20",
    actualDelivery: null,
    shippingAddress: "789 Pine Ln, Sometown, USA",
  },
];

type DeliveryStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

const getStatusBadgeVariant = (status: DeliveryStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Delivered":
      return "default"; // Changed from "success"
    case "Shipped":
      return "secondary"; // Changed from "default"
    case "Pending":
      return "outline"; // Changed from "secondary"
    case "Cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

export default function DeliveriesPage() {
  return (
    <div className="flex flex-col gap-4">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
        <div className="flex-1">
          <h1 className="font-semibold text-lg">Deliveries</h1>
        </div>
        <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search deliveries..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <Link href="/livraisons/new">
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Schedule Delivery
              </span>
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Delivery List</CardTitle>
            <CardDescription>
              Manage and track all scheduled deliveries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Delivery ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Est. Delivery</TableHead>
                  <TableHead>Actual Delivery</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">{delivery.id}</TableCell>
                    <TableCell>
                      <Link href={`/commandes/${delivery.orderId}`} className="hover:underline">
                        {delivery.orderId}
                      </Link>
                    </TableCell>
                    <TableCell>{delivery.carrier}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(delivery.status as DeliveryStatus)}>
                        {delivery.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{delivery.estimatedDelivery}</TableCell>
                    <TableCell>{delivery.actualDelivery || "N/A"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <Link href={`/livraisons/${delivery.id}`}>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuItem>Print Label</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-{deliveries.length}</strong> of <strong>{deliveries.length}</strong>{" "}
              deliveries
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
