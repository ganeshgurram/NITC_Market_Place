import { useState, useEffect,useCallback } from "react";
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
// Extend Item type to include missing properties for this component
import { Item as BaseItem } from "./ItemCard";
export interface Item extends BaseItem {
  status?: string;
  messages?: number;
  views?: number;
}
import { toast } from "sonner";
import { itemsAPI, messagesAPI } from "../utils/api";


interface ManageListingsProps {
  onBack: () => void;
  userItems: Item[];
  onItemUpdate: (itemId: string, updates: Partial<Item>) => void;
  onItemDelete: (itemId: string) => void;
  onEditItem?: (item: Item) => void;
  onViewDetails?: (item: Item) => void;
  currentUser: any;
}

interface Transaction {
  _id?: string;
  id?: string;
  item?: string | { _id?: string; title?: string };
  buyer?: {
    _id?: string;
    name?: string;
    email?: string;
    rating?: number;
    reviewCount?: number;
  };
  buyerName?: string; // Legacy field for backward compatibility
  buyerEmail?: string; // Legacy field for backward compatibility
  completedDate?: string;
  amount?: number;
  status?: string;
  hasReview?: boolean;
  reviewRating?: number;
  reviewComment?: string;
}

export function ManageListings({
  onBack, userItems, onItemUpdate, onItemDelete, onEditItem, onViewDetails, currentUser
}: ManageListingsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const [userItemsLocal, setUserItemsLocal] = useState<Item[] | null>(null);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);

  const getApiBase = () => {
    const apiFromProcess = (typeof process !== "undefined" && (process as any).env && (process as any).env.REACT_APP_API_URL) ? (process as any).env.REACT_APP_API_URL : undefined;
    const apiFromImportMeta = (typeof import.meta !== "undefined" && (import.meta as any).env && ((import.meta as any).env.VITE_API_URL || (import.meta as any).env.REACT_APP_API_URL)) ? ((import.meta as any).env.VITE_API_URL || (import.meta as any).env.REACT_APP_API_URL) : undefined;
    const apiFromGlobal = (typeof (globalThis as any) !== "undefined" && (globalThis as any).REACT_APP_API_URL) ? (globalThis as any).REACT_APP_API_URL : undefined;
    return apiFromProcess || apiFromImportMeta || apiFromGlobal || 'http://localhost:5000';
  };

  // ✅ reusable reload function
  const reloadMyItems = useCallback(async () => {
    setItemsError(null);
    setItemsLoading(true);
    try {
      const userId = currentUser?.id || currentUser?._id || currentUser?.user?.id;
      if (!userId) {
        setItemsError('Please login to view your listings');
        setUserItemsLocal([]);
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        setItemsError('Authentication token not found. Please login again.');
        setUserItemsLocal([]);
        return;
      }

      const response = await itemsAPI.getMyItems();
      if (response && (response.items || Array.isArray(response))) {
        const list = response.items || response;
        setUserItemsLocal(list);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err: any) {
      console.error('Failed to load user items:', err);
      setItemsError(err?.message || 'Failed to load user items');
      setUserItemsLocal([]);

      if (err?.message?.toLowerCase().includes('auth')) {
        toast.error('Please login again to continue');
        localStorage.removeItem('authToken');
      }
    } finally {
      setItemsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    reloadMyItems();
  }, [reloadMyItems]);

  useEffect(() => {
    async function loadTransactions() {
      setTxError(null);
      setTxLoading(true);
      try {
        const sellerId = currentUser?.id ?? currentUser?._id ?? currentUser?.user?.id ?? '';
        if (!sellerId) {
          setTransactions([]);
          setTxLoading(false);
          return;
        }

        const headers: Record<string, string> = { "Accept": "application/json" };
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Authentication token not found');
        headers["Authorization"] = `Bearer ${token}`;

        const API_BASE = getApiBase();
        const url = `${API_BASE}/api/transactions?seller=${encodeURIComponent(sellerId)}`;
        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const list: Transaction[] = Array.isArray(data) ? data : (data.items || data.transactions || data.data || []);
        setTransactions(list);
      } catch (err: any) {
        console.error("Failed to load transactions:", err);
        setTxError(err?.message || "Failed to load transactions");
        setTransactions([]);
      } finally {
        setTxLoading(false);
      }
    }

    loadTransactions();
  }, [currentUser]);

  const displayedItems = userItemsLocal ?? userItems;

  // Load conversations to count unique contacts
  useEffect(() => {
    async function loadConversations() {
      if (!currentUser) {
        setConversations([]);
        return;
      }

      setConversationsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setConversations([]);
          setConversationsLoading(false);
          return;
        }

        const response = await messagesAPI.getConversations();
        const conversationsList = response?.conversations || [];
        setConversations(conversationsList);
      } catch (err: any) {
        console.error("Failed to load conversations:", err);
        setConversations([]);
      } finally {
        setConversationsLoading(false);
      }
    }

    loadConversations();
  }, [currentUser, displayedItems.length]);

  const getItemId = (it: any) => (it && (it.id ?? it._id)) || '';

  const filteredItems = displayedItems.filter(item => {
    const matchesSearch = searchQuery === "" || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "available" && item.isAvailable) ||
      (statusFilter === "sold" && !item.isAvailable) ||
      (statusFilter === "hidden" && item.status === "hidden");
    return matchesSearch && matchesStatus;
  });

  const activeItems = displayedItems.filter(item => item.isAvailable).length;
  const soldItems = displayedItems.filter(item => !item.isAvailable).length;
  const totalViews = displayedItems.reduce((acc, item) => acc + (item.views ?? 0), 0);
  
  // Calculate total unique contacts who have messaged about the user's items
  const totalMessages = (() => {
    if (!currentUser || conversations.length === 0 || displayedItems.length === 0) {
      return 0;
    }

    const userId = currentUser?.id || currentUser?._id || currentUser?.user?.id;
    if (!userId) return 0;

    // Get all item IDs that belong to the current user (normalize to strings for comparison)
    const userItemIds = new Set(
      displayedItems.map(item => {
        const itemId = item.id || (item as any)._id;
        return itemId ? itemId.toString() : null;
      }).filter(Boolean) as string[]
    );

    if (userItemIds.size === 0) return 0;

    // Find unique contacts who have messaged about the user's items
    // A contact is someone who sent a message to the current user about one of their items
    const uniqueContacts = new Set<string>();
    
    conversations.forEach(conversation => {
      // Check if the conversation is about one of the user's items
      if (!conversation.item) return;
      
      const itemId = conversation.item._id || conversation.item.id;
      if (!itemId) return;
      
      const itemIdStr = itemId.toString();
      if (userItemIds.has(itemIdStr)) {
        // This conversation is about one of the user's items
        // The otherUser is the person who contacted them
        const otherUserId = conversation.otherUser?._id || conversation.otherUser?.id;
        if (otherUserId) {
          uniqueContacts.add(otherUserId.toString());
        }
      }
    });

    return uniqueContacts.size;
  })();

  const handleStatusChange = async (itemId: string, newStatus: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Please sign in to update items');
      return;
    }

    const updates: Partial<Item> = {
      isAvailable: newStatus === 'available',
      status: newStatus,
    };

    try {
      const API_BASE = getApiBase();
      const url = `${API_BASE}/api/items/${encodeURIComponent(itemId)}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error(await res.text());

      toast.success(`Item marked as ${newStatus}`);
      await reloadMyItems(); // ✅ reload listings tab
      // Reload conversations to update message count
      try {
        const response = await messagesAPI.getConversations();
        const conversationsList = response?.conversations || [];
        setConversations(conversationsList);
      } catch (err) {
        // Silently fail - conversations will refresh on next load
      }
    } catch (err: any) {
      console.error('Failed to update item:', err);
      toast.error(err?.message || 'Failed to update item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Please sign in to delete items');
      return;
    }

    try {
      const API_BASE = getApiBase();
      const url = `${API_BASE}/api/items/${encodeURIComponent(itemId)}`;
      const res = await fetch(url, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(await res.text());

      toast.success('Item deleted successfully');
      await reloadMyItems(); // ✅ reload listings tab
      // Reload conversations to update message count
      try {
        const response = await messagesAPI.getConversations();
        const conversationsList = response?.conversations || [];
        setConversations(conversationsList);
      } catch (err) {
        // Silently fail - conversations will refresh on next load
      }
      setDeleteItemId(null);
    } catch (err: any) {
      console.error('Failed to delete item:', err);
      toast.error(err?.message || 'Failed to delete item');
    }
  };

  const getStatusBadge = (item: Item) => {
    if (!item.isAvailable && item.status !== "hidden") return <Badge variant="secondary">Sold</Badge>;
    if (item.status === "hidden") return <Badge variant="destructive">Hidden</Badge>;
    if (item.status === "reserved") return <Badge variant="outline">Reserved</Badge>;
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
            <TabsTrigger value="listings">My Listings ({displayedItems.length})</TabsTrigger>
            <TabsTrigger value="transactions">Transaction History ({transactions.length})</TabsTrigger>
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
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                {filteredItems.length} of {displayedItems.length} listings
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const itemId = item.id || (item as any)._id;
                    return (
                    <TableRow key={itemId}>
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
                        {item.createdAt}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            
                            
                            {item.isAvailable ? (
                              <>
                                <DropdownMenuItem onClick={() => handleStatusChange(itemId, "sold")}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Mark as Sold
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(itemId, "hidden")}>
                                  <EyeOff className="w-4 h-4 mr-2" />
                                  Hide Listing
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <DropdownMenuItem onClick={() => handleStatusChange(itemId, "available")}>
                                <Package className="w-4 h-4 mr-2" />
                                Mark as Available
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => setDeleteItemId(itemId)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Listing
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

            </Card>

            {itemsError ? (
              <div className="text-center py-12">
                <XCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
                <h3 className="text-destructive">Error Loading Listings</h3>
                <p className="text-muted-foreground mb-4">{itemsError}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3>No listings found</h3>
                <p className="text-muted-foreground mb-4">
                  {displayedItems.length === 0 
                    ? "You haven't created any listings yet."
                    : "No listings match your current filters."
                  }
                </p>
                {displayedItems.length === 0 && (
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
                    {txLoading && (
                      <TableRow>
                        <TableCell colSpan={6}>Loading transactions...</TableCell>
                      </TableRow>
                    )}

                    {!txLoading && transactions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <div className="text-center py-6">
                            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                            <div>No transactions yet</div>
                            <p className="text-sm text-muted-foreground">Your completed sales will appear here.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}

                    {!txLoading && transactions.map((transaction) => {
                      const itemId = typeof transaction.item === "string" ? transaction.item : (transaction.item?._id || '');
                      const item = displayedItems.find(i => i.id === itemId);
                      return (
                        <TableRow key={transaction._id || transaction.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {transaction.buyer?.name || transaction.buyerName || "Buyer"}
                              </p>
                              {transaction.buyer?.email && (
                                <p className="text-sm text-muted-foreground">{transaction.buyer.email}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{item?.title || (typeof transaction.item !== "string" ? transaction.item?.title : "Unknown Item")}</p>
                          </TableCell>
                          <TableCell>
                            {transaction.amount && transaction.amount > 0 ? `₹${transaction.amount}` : "Free"}
                          </TableCell>
                          <TableCell>{transaction.completedDate ? new Date(transaction.completedDate).toLocaleDateString() : "-"}</TableCell>
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

                {txError && (
                  <div className="text-sm text-destructive mt-4">Error loading transactions: {txError}</div>
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