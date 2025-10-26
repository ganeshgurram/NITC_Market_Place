import { useState } from "react";
import { ArrowLeft, Edit, Trash2, Eye, EyeOff, Package, CheckCircle, XCircle, MoreHorizontal, TrendingUp, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Item } from "./ItemCard";
import { toast } from "sonner@2.0.3";

interface ManageListingsProps {
  onBack: () => void;
  userItems: Item[];
  onItemUpdate: (itemId: string, updates: Partial<Item>) => void;
  onItemDelete: (itemId: string) => void;
  currentUser: any;
}

// Mock transaction data for sold items
const mockTransactions = [
  {
    id: "1",
    itemId: "1",
    buyerName: "Priya Sharma",
    buyerEmail: "priya.sharma@nitc.ac.in",
    completedDate: "2024-01-10",
    amount: 800,
    status: "completed",
    hasReview: true,
    reviewRating: 5,
    reviewComment: "Great seller, item was exactly as described!"
  },
  {
    id: "2",
    itemId: "2", 
    buyerName: "Karthik Kumar",
    buyerEmail: "karthik.kumar@nitc.ac.in",
    completedDate: "2024-01-08",
    amount: 0,
    status: "completed",
    hasReview: false
  }
];

const itemStatusOptions = [
  { value: "available", label: "Available", color: "default" },
  { value: "sold", label: "Sold", color: "secondary" },
  { value: "reserved", label: "Reserved", color: "outline" },
  { value: "hidden", label: "Hidden", color: "destructive" }
];

export function ManageListings({ onBack, userItems, onItemUpdate, onItemDelete, currentUser }: ManageListingsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const filteredItems = userItems.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "available" && item.isAvailable) ||
      (statusFilter === "sold" && !item.isAvailable) ||
      (statusFilter === "hidden" && item.status === "hidden");

    return matchesSearch && matchesStatus;
  });

  const activeItems = userItems.filter(item => item.isAvailable).length;
  const soldItems = userItems.filter(item => !item.isAvailable).length;
  const totalViews = userItems.reduce((acc, item) => acc + (item.views || 0), 0);
  const totalMessages = userItems.reduce((acc, item) => acc + (item.messages || 0), 0);

  const handleStatusChange = (itemId: string, newStatus: string) => {
    const updates: Partial<Item> = {};
    
    if (newStatus === "sold") {
      updates.isAvailable = false;
      updates.status = "sold";
    } else if (newStatus === "available") {
      updates.isAvailable = true;
      updates.status = "available";
    } else {
      updates.status = newStatus as any;
      if (newStatus === "hidden") {
        updates.isAvailable = false;
      }
    }

    onItemUpdate(itemId, updates);
    toast(`Item marked as ${newStatus}`, {
      description: "Your listing has been updated successfully."
    });
  };

  const handleDeleteItem = (itemId: string) => {
    onItemDelete(itemId);
    setDeleteItemId(null);
    toast("Item deleted successfully", {
      description: "Your listing has been removed from the marketplace."
    });
  };

  const getStatusBadge = (item: Item) => {
    if (!item.isAvailable && item.status !== "hidden") {
      return <Badge variant="secondary">Sold</Badge>;
    }
    if (item.status === "hidden") {
      return <Badge variant="destructive">Hidden</Badge>;
    }
    if (item.status === "reserved") {
      return <Badge variant="outline">Reserved</Badge>;
    }
    return <Badge variant="default">Available</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <h1 className="text-3xl">Manage My Listings</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeItems}</div>
              <p className="text-xs text-muted-foreground">
                Currently visible
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sold Items</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{soldItems}</div>
              <p className="text-xs text-muted-foreground">
                Successfully sold
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews}</div>
              <p className="text-xs text-muted-foreground">
                Across all listings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMessages}</div>
              <p className="text-xs text-muted-foreground">
                Inquiries received
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="listings">My Listings ({userItems.length})</TabsTrigger>
            <TabsTrigger value="transactions">Transaction History ({mockTransactions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-6">
            {/* Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Input
                  placeholder="Search your listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                {filteredItems.length} of {userItems.length} listings
              </p>
            </div>

            {/* Listings Table */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <ImageWithFallback
                            src={item.images[0]}
                            alt={item.title}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">{item.title}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {item.description.substring(0, 50)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {item.price ? `₹${item.price}` : item.type === "free" ? "Free" : "Rent"}
                      </TableCell>
                      <TableCell>{getStatusBadge(item)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.postedAt}
                      </TableCell>
                      <TableCell>{item.views || 0}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Listing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {item.isAvailable ? (
                              <>
                                <DropdownMenuItem onClick={() => handleStatusChange(item.id, "sold")}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Mark as Sold
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(item.id, "hidden")}>
                                  <EyeOff className="w-4 h-4 mr-2" />
                                  Hide Listing
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <DropdownMenuItem onClick={() => handleStatusChange(item.id, "available")}>
                                <Package className="w-4 h-4 mr-2" />
                                Mark as Available
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => setDeleteItemId(item.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Listing
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3>No listings found</h3>
                <p className="text-muted-foreground mb-4">
                  {userItems.length === 0 
                    ? "You haven't created any listings yet."
                    : "No listings match your current filters."
                  }
                </p>
                {userItems.length === 0 && (
                  <Button onClick={onBack}>
                    Create Your First Listing
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Review</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.map((transaction) => {
                      const item = userItems.find(i => i.id === transaction.itemId);
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{transaction.buyerName}</p>
                              <p className="text-sm text-muted-foreground">{transaction.buyerEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{item?.title || "Unknown Item"}</p>
                          </TableCell>
                          <TableCell>
                            {transaction.amount > 0 ? `₹${transaction.amount}` : "Free"}
                          </TableCell>
                          <TableCell>{transaction.completedDate}</TableCell>
                          <TableCell>
                            {transaction.hasReview ? (
                              <div className="flex items-center space-x-1">
                                <span className="text-yellow-500">★</span>
                                <span>{transaction.reviewRating}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">No review</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="default">{transaction.status}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {mockTransactions.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3>No transactions yet</h3>
                    <p className="text-muted-foreground">
                      Your completed sales will appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Listing</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this listing? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteItemId && handleDeleteItem(deleteItemId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}