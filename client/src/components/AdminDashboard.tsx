import { useState, useEffect } from "react";
import { Users, Package, MessageSquare, TrendingUp, Shield, AlertTriangle, Search, Filter, MoreHorizontal, Loader2, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { adminAPI, usersAPI } from "../utils/api";

interface AdminDashboardProps {
  currentUser: {
    name: string;
    email: string;
    role: string;
  };
  onSignOut?: () => void;
}

interface DashboardStats {
  totalUsers: number;
  activeListings: number;
  totalTransactions: number;
  pendingReports: number;
  monthlyGrowth: {
    users: number;
    listings: number;
    transactions: number;
  };
}

interface User {
  _id: string;
  name: string;
  email: string;
  department: string;
  createdAt: string;
  isVerified: boolean;
  rollNumber?: string;
}

interface Item {
  _id: string;
  title: string;
  seller: {
    name: string;
    email: string;
    rollNumber?: string;
  };
  department: string;
  price?: number;
  isAvailable: boolean;
  createdAt: string;
}

interface Report {
  _id: string;
  item: {
    _id: string;
    title: string;
    description?: string;
  };
  reporter: {
    _id: string;
    name: string;
    email: string;
    rollNumber?: string;
  };
  reason: string;
  status: string;
  createdAt: string;
}

export function AdminDashboard({ currentUser, onSignOut }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentListings, setRecentListings] = useState<Item[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allListings, setAllListings] = useState<Item[]>([]);
  const [recentActivity, setRecentActivity] = useState<Array<{ type: string; text: string; date: Date }>>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      const data = await adminAPI.getStats();
      setDashboardStats(data.stats);
      setRecentUsers(data.recentUsers || []);
      setRecentListings(data.recentItems || []);
      
      // Build recent activity from recent data
      const activities: any[] = [];
      if (data.recentUsers) {
        data.recentUsers.slice(0, 2).forEach((user: User) => {
          activities.push({
            type: 'user',
            text: `New user registered: ${user.name}`,
            date: new Date(user.createdAt),
          });
        });
      }
      if (data.recentItems) {
        data.recentItems.slice(0, 2).forEach((item: Item) => {
          activities.push({
            type: 'listing',
            text: `New listing: "${item.title}"`,
            date: new Date(item.createdAt),
          });
        });
      }
      if (data.recentTransactions) {
        data.recentTransactions.slice(0, 2).forEach((trans: any) => {
          activities.push({
            type: 'transaction',
            text: `Transaction completed: ${trans.item?.title || 'Item'}`,
            date: new Date(trans.createdAt),
          });
        });
      }
      // Sort by date and limit
      activities.sort((a, b) => b.date.getTime() - a.date.getTime());
      setRecentActivity(activities.slice(0, 4));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard stats');
      console.error('Error fetching dashboard stats:', err);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const data = await adminAPI.getAllUsers(searchQuery || undefined);
      setAllUsers(data.users || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    }
  };

  // Fetch all listings
  const fetchListings = async () => {
    try {
      const data = await adminAPI.getAllItems();
      setAllListings(data.items || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch listings');
      console.error('Error fetching listings:', err);
    }
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchDashboardStats(),
          fetchUsers(),
          fetchListings(),
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Refetch users when search changes
  useEffect(() => {
    if (!loading) {
      fetchUsers();
    }
  }, [searchQuery]);

  const handleUserAction = async (userId: string, action: string) => {
    try {
      if (action === 'suspend') {
        await adminAPI.suspendUser(userId, true);
        await fetchUsers();
        await fetchDashboardStats();
      } else if (action === 'delete') {
        if (confirm('Are you sure you want to delete this user? This will also delete all their listings and associated data.')) {
          // First, get all items for this user
          let userItems: Item[] = [];
          try {
            // Try to get user items via API
            const itemsData = await usersAPI.getUserItems(userId);
            userItems = itemsData.items || [];
          } catch (err) {
            // If API fails, filter from existing listings
            // The seller field might be an object with _id or just an id string
            userItems = allListings.filter(item => {
              const sellerId = (item.seller as any)?._id || (item.seller as any)?.id || (typeof item.seller === 'string' ? item.seller : null);
              return sellerId === userId;
            });
          }

          // Delete all user's items first
          if (userItems.length > 0) {
            for (const item of userItems) {
              try {
                await adminAPI.deleteItem(item._id);
              } catch (err: any) {
                console.error(`Error deleting item ${item._id}:`, err);
                // Continue deleting other items even if one fails
              }
            }
          }

          // Now delete the user
          await adminAPI.deleteUser(userId);
          await fetchUsers();
          await fetchListings();
          await fetchDashboardStats();
        }
      }
    } catch (err: any) {
      setError(err.message || `Failed to ${action} user`);
      console.error(`Error ${action} user:`, err);
    }
  };

  const handleListingAction = async (listingId: string, action: string) => {
    try {
      if (action === 'hide') {
        await adminAPI.updateItemAvailability(listingId, false);
        await fetchListings();
        await fetchDashboardStats();
      } else if (action === 'delete') {
        if (confirm('Are you sure you want to delete this listing?')) {
          await adminAPI.deleteItem(listingId);
          await fetchListings();
          await fetchDashboardStats();
        }
      }
    } catch (err: any) {
      setError(err.message || `Failed to ${action} listing`);
      console.error(`Error ${action} listing:`, err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardStats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Failed to load dashboard data'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {currentUser.name}</p>
          </div>
          {onSignOut && (
            <Button variant="outline" onClick={onSignOut} className="flex items-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats.monthlyGrowth.users >= 0 ? '+' : ''}{dashboardStats.monthlyGrowth.users.toFixed(1)}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.activeListings}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats.monthlyGrowth.listings >= 0 ? '+' : ''}{dashboardStats.monthlyGrowth.listings.toFixed(1)}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalTransactions}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats.monthlyGrowth.transactions >= 0 ? '+' : ''}{dashboardStats.monthlyGrowth.transactions.toFixed(1)}% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent User Registrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.length > 0 ? (
                      recentUsers.slice(0, 4).map((user) => (
                        <div key={user._id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.department}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No recent users</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => {
                        const colorMap: { [key: string]: string } = {
                          user: 'bg-green-500',
                          listing: 'bg-blue-500',
                          transaction: 'bg-purple-500',
                          report: 'bg-red-500',
                        };
                        return (
                          <div key={index} className="flex items-center space-x-3">
                            <div className={`w-2 h-2 ${colorMap[activity.type] || 'bg-gray-500'} rounded-full`}></div>
                            <div className="flex-1">
                              <p className="text-sm">{activity.text}</p>
                              <p className="text-xs text-muted-foreground">{getTimeAgo(activity.date.toISOString())}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Joined Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allUsers.length > 0 ? (
                      allUsers.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell>{formatDate(user.createdAt)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                {user.isVerified && (
                                  <DropdownMenuItem onClick={() => handleUserAction(user._id, "suspend")}>
                                    Suspend User
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleUserAction(user._id, "delete")}>
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Listing Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allListings.length > 0 ? (
                      allListings.map((listing) => (
                        <TableRow key={listing._id}>
                          <TableCell className="font-medium">{listing.title}</TableCell>
                          <TableCell>{listing.seller?.name || 'Unknown'}</TableCell>
                          <TableCell>{listing.department}</TableCell>
                          <TableCell>{listing.price ? `₹${listing.price}` : "Free"}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                listing.isAvailable ? "default" : "secondary"
                              }
                            >
                              {listing.isAvailable ? "active" : "sold"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleListingAction(listing._id, "hide")}>
                                  {listing.isAvailable ? "Hide Listing" : "Show Listing"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleListingAction(listing._id, "delete")}>
                                  Delete Listing
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No listings found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}