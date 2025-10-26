import { useState } from "react";
import { Header } from "./components/Header";
import { CategoryFilter } from "./components/CategoryFilter";
import { ItemCard, Item } from "./components/ItemCard";
import { ItemDetail } from "./components/ItemDetail";
import { PostItemDialog } from "./components/PostItemDialog";
import { MessagingInterface } from "./components/MessagingInterface";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import { UserProfile } from "./components/UserProfile";
import { AdminDashboard } from "./components/AdminDashboard";
import { ListItemPage } from "./components/ListItemPage";
import { ManageListings } from "./components/ManageListings";
import { SubmitReview } from "./components/SubmitReview";
import { ViewRatings } from "./components/ViewRatings";
import { TransactionComplete } from "./components/TransactionComplete";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { BookOpen, Beaker, PenTool, Users, Star, TrendingUp } from "lucide-react";
import { toast } from "sonner@2.0.3";

// Mock items data
const mockItems: Item[] = [
  {
    id: "1",
    title: "Advanced Engineering Mathematics by Kreyszig (10th Edition)",
    description: "Excellent condition textbook with minimal highlighting. All chapters included, no torn pages. Perfect for 3rd semester mathematics course.",
    price: 800,
    type: "sale",
    category: "textbook",
    department: "Computer Science & Engineering",
    semester: "3",
    courseCode: "MA2001",
    condition: "like-new",
    images: ["https://images.unsplash.com/photo-1595315342809-fa10945ed07c?w=400&h=400&fit=crop"],
    seller: {
      id: "2",
      name: "Priya Sharma",
      rating: 4.8,
      reviewCount: 15
    },
    location: "Hostel H3, Room 201",
    postedAt: "2 days ago",
    isAvailable: true
  },
  {
    id: "2", 
    title: "Digital Oscilloscope - Tektronix TDS2012C",
    description: "Professional oscilloscope available for rent. Perfect for electronics lab projects and circuit analysis. Comes with all probes and cables.",
    type: "rent",
    category: "lab-equipment",
    department: "Electronics & Communication",
    semester: "5",
    courseCode: "EC3001",
    condition: "good",
    images: ["https://images.unsplash.com/photo-1758876569703-ea9b21463691?w=400&h=400&fit=crop"],
    seller: {
      id: "3",
      name: "Rahul Kumar",
      rating: 4.5,
      reviewCount: 28
    },
    location: "EEE Lab Block",
    postedAt: "1 day ago",
    isAvailable: true
  },
  {
    id: "3",
    title: "Complete Stationery Set - Pens, Rulers, Calculator",
    description: "Giving away unused stationery items. Includes gel pens, mechanical pencils, rulers, protractor, and scientific calculator. Great for new students!",
    type: "free",
    category: "stationery",
    department: "All Departments",
    condition: "new",
    images: ["https://images.unsplash.com/photo-1693011142814-aa33d7d1535c?w=400&h=400&fit=crop"],
    seller: {
      id: "4",
      name: "Sneha Patel",
      rating: 4.9,
      reviewCount: 42
    },
    location: "Main Gate Area",
    postedAt: "3 hours ago",
    isAvailable: true
  },
  {
    id: "4",
    title: "Computer Graphics Textbook - Hearn & Baker",
    description: "Standard textbook for computer graphics course. Some highlighting and notes in margins. Good for understanding concepts and exam preparation.",
    price: 450,
    type: "sale",
    category: "textbook",
    department: "Computer Science & Engineering",
    semester: "6",
    courseCode: "CS3005",
    condition: "good",
    images: ["https://images.unsplash.com/photo-1595315342809-fa10945ed07c?w=400&h=400&fit=crop"],
    seller: {
      id: "5",
      name: "Karthik Nair",
      rating: 4.3,
      reviewCount: 11
    },
    location: "Library Entrance",
    postedAt: "1 week ago",
    isAvailable: false
  }
];

const categories = [
  { icon: BookOpen, title: "Textbooks", count: 245, color: "bg-blue-100 text-blue-700" },
  { icon: Beaker, title: "Lab Equipment", count: 67, color: "bg-green-100 text-green-700" },
  { icon: PenTool, title: "Stationery", count: 156, color: "bg-purple-100 text-purple-700" },
  { icon: Users, title: "Other Items", count: 89, color: "bg-orange-100 text-orange-700" }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<"signin" | "signup" | null>(null);
  const [currentPage, setCurrentPage] = useState<"marketplace" | "profile" | "admin" | "listitem" | "manage" | "review" | "ratings">("marketplace");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedSemester, setSelectedSemester] = useState("All Semesters");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [items, setItems] = useState(mockItems);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedUserForRatings, setSelectedUserForRatings] = useState<any>(null);
  const [showTransactionComplete, setShowTransactionComplete] = useState(false);
  const [completedTransaction, setCompletedTransaction] = useState<any>(null);

  // Filter items based on search and filters
  const filteredItems = items.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = selectedDepartment === "All Departments" || 
      item.department === selectedDepartment;
    
    const matchesSemester = selectedSemester === "All Semesters" || 
      item.semester === selectedSemester.split(" ")[0];
    
    const matchesType = selectedType === "All Types" || 
      (selectedType === "For Sale" && item.type === "sale") ||
      (selectedType === "For Rent" && item.type === "rent") ||
      (selectedType === "Free/Donation" && item.type === "free");

    return matchesSearch && matchesDepartment && matchesSemester && matchesType;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearFilters = () => {
    setSelectedDepartment("All Departments");
    setSelectedSemester("All Semesters");
    setSelectedType("All Types");
  };

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
  };

  const handleContactSeller = (item: Item) => {
    setShowMessages(true);
    toast(`Opening chat with ${item.seller.name}`, {
      description: `About: ${item.title}`
    });
  };

  const handleSignIn = (user: any) => {
    setCurrentUser(user);
    setAuthMode(null);
    
    // Redirect admin users to admin dashboard
    if (user.role === "admin") {
      setCurrentPage("admin");
      toast(`Welcome back, Admin!`, {
        description: "You're now signed in to the admin dashboard"
      });
    } else {
      setCurrentPage("marketplace");
      toast(`Welcome back, ${user.name}!`, {
        description: "You're now signed in to NITC Marketplace"
      });
    }
  };

  const handleSignUp = (user: any) => {
    setCurrentUser(user);
    setAuthMode(null);
    setCurrentPage("marketplace");
    toast(`Welcome to NITC Marketplace, ${user.name}!`, {
      description: "Your account has been created successfully"
    });
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setCurrentPage("marketplace");
    setSelectedItem(null);
    setShowPostDialog(false);
    setShowMessages(false);
    toast("Signed out successfully", {
      description: "You've been signed out of your account"
    });
  };

  const handlePostItem = (newItem: any) => {
    if (!currentUser) return;
    
    const item: Item = {
      id: Date.now().toString(),
      ...newItem,
      images: newItem.images.length > 0 ? newItem.images : ["https://images.unsplash.com/photo-1595315342809-fa10945ed07c?w=400&h=400&fit=crop"],
      seller: currentUser,
      postedAt: "Just now",
      isAvailable: true,
      price: newItem.type === "sale" ? parseInt(newItem.price) : undefined
    };
    
    setItems([item, ...items]);
    toast("Item listed successfully!", {
      description: "Your item is now visible to other students."
    });
  };

  const handleViewProfile = (sellerId: string) => {
    if (sellerId === currentUser?.id) {
      setCurrentPage("profile");
    } else {
      toast("Opening user profile", {
        description: "Profile functionality would open here"
      });
    }
  };

  const handleProfileClick = () => {
    if (currentUser?.role === "admin") {
      setCurrentPage("admin");
    } else {
      setCurrentPage("profile");
    }
  };

  const handlePostItemClick = () => {
    setCurrentPage("listitem");
  };

  const handleBackToMarketplace = () => {
    setCurrentPage("marketplace");
    setSelectedItem(null);
    setSelectedTransaction(null);
    setSelectedUserForRatings(null);
  };

  const handleManageListingsClick = () => {
    setCurrentPage("manage");
  };

  const handleItemUpdate = (itemId: string, updates: Partial<Item>) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  const handleItemDelete = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleReviewSubmit = (review: any) => {
    setReviews(prev => [...prev, review]);
    setCurrentPage("marketplace");
    setSelectedTransaction(null);
  };

  const handleViewRatings = (user: any) => {
    setSelectedUserForRatings(user);
    setCurrentPage("ratings");
  };

  const handleSubmitReviewClick = (transaction: any) => {
    setSelectedTransaction(transaction);
    setCurrentPage("review");
  };

  const handleTransactionComplete = (item: Item) => {
    // Mock transaction completion
    const transaction = {
      id: Date.now().toString(),
      item,
      seller: item.seller,
      completedDate: new Date().toISOString().split('T')[0],
      amount: item.price
    };
    setCompletedTransaction(transaction);
    setShowTransactionComplete(true);
  };

  const handleReviewFromTransaction = (transaction: any) => {
    setShowTransactionComplete(false);
    setCompletedTransaction(null);
    handleSubmitReviewClick(transaction);
  };

  const handleSkipReview = () => {
    setShowTransactionComplete(false);
    setCompletedTransaction(null);
  };

  // Get user's own items for manage listings
  const getUserItems = () => {
    return items.filter(item => item.seller.id === currentUser?.id);
  };

  // Show authentication screens if not logged in
  if (!currentUser) {
    if (authMode === "signup") {
      return (
        <SignUp 
          onSignUp={handleSignUp}
          onSwitchToSignIn={() => setAuthMode("signin")}
        />
      );
    }
    
    return (
      <SignIn 
        onSignIn={handleSignIn}
        onSwitchToSignUp={() => setAuthMode("signup")}
      />
    );
  }

  // Show admin dashboard for admin users
  if (currentUser.role === "admin" && currentPage === "admin") {
    return <AdminDashboard currentUser={currentUser} />;
  }

  // Show user profile page
  if (currentPage === "profile") {
    return (
      <div className="min-h-screen bg-background">
        <Header
          currentUser={currentUser}
          onSearch={handleSearch}
          onProfileClick={handleProfileClick}
          onMessagesClick={() => setShowMessages(true)}
          onPostItemClick={handlePostItemClick}
          onSignOut={handleSignOut}
          searchQuery={searchQuery}
          unreadMessages={1}
        />
        <UserProfile
          user={currentUser}
          onBack={handleBackToMarketplace}
          isOwnProfile={true}
          userItems={getUserItems()}
          onManageListings={handleManageListingsClick}
          onViewRatings={() => handleViewRatings(currentUser)}
        />
        <MessagingInterface
          isOpen={showMessages}
          onClose={() => setShowMessages(false)}
          currentUserId={currentUser.id}
        />
      </div>
    );
  }

  // Show list item page
  if (currentPage === "listitem") {
    return (
      <div className="min-h-screen bg-background">
        <Header
          currentUser={currentUser}
          onSearch={handleSearch}
          onProfileClick={handleProfileClick}
          onMessagesClick={() => setShowMessages(true)}
          onPostItemClick={handlePostItemClick}
          onSignOut={handleSignOut}
          searchQuery={searchQuery}
          unreadMessages={1}
        />
        <ListItemPage
          onBack={handleBackToMarketplace}
          onSubmit={(newItem) => {
            handlePostItem(newItem);
            setCurrentPage("marketplace");
          }}
          currentUser={currentUser}
        />
        <MessagingInterface
          isOpen={showMessages}
          onClose={() => setShowMessages(false)}
          currentUserId={currentUser.id}
        />
      </div>
    );
  }

  // Show manage listings page
  if (currentPage === "manage") {
    return (
      <div className="min-h-screen bg-background">
        <Header
          currentUser={currentUser}
          onSearch={handleSearch}
          onProfileClick={handleProfileClick}
          onMessagesClick={() => setShowMessages(true)}
          onPostItemClick={handlePostItemClick}
          onSignOut={handleSignOut}
          searchQuery={searchQuery}
          unreadMessages={1}
        />
        <ManageListings
          onBack={handleBackToMarketplace}
          userItems={getUserItems()}
          onItemUpdate={handleItemUpdate}
          onItemDelete={handleItemDelete}
          currentUser={currentUser}
        />
        <MessagingInterface
          isOpen={showMessages}
          onClose={() => setShowMessages(false)}
          currentUserId={currentUser.id}
        />
      </div>
    );
  }

  // Show submit review page
  if (currentPage === "review" && selectedTransaction) {
    return (
      <SubmitReview
        onBack={handleBackToMarketplace}
        onSubmit={handleReviewSubmit}
        transaction={selectedTransaction}
      />
    );
  }

  // Show view ratings page
  if (currentPage === "ratings" && selectedUserForRatings) {
    return (
      <ViewRatings
        onBack={handleBackToMarketplace}
        userId={selectedUserForRatings.id}
        userName={selectedUserForRatings.name}
      />
    );
  }

  if (selectedItem) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          currentUser={currentUser}
          onSearch={handleSearch}
          onProfileClick={handleProfileClick}
          onMessagesClick={() => setShowMessages(true)}
          onPostItemClick={handlePostItemClick}
          onSignOut={handleSignOut}
          searchQuery={searchQuery}
          unreadMessages={1}
        />
        <ItemDetail
          item={selectedItem}
          onBack={() => setSelectedItem(null)}
          onContactSeller={handleContactSeller}
          onViewProfile={handleViewProfile}
          onTransactionComplete={handleTransactionComplete}
        />
        <MessagingInterface
          isOpen={showMessages}
          onClose={() => setShowMessages(false)}
          currentUserId={currentUser.id}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentUser={currentUser}
        onSearch={handleSearch}
        onProfileClick={handleProfileClick}
        onMessagesClick={() => setShowMessages(true)}
        onPostItemClick={handlePostItemClick}
        onSignInClick={() => setAuthMode("signin")}
        onSignOut={handleSignOut}
        searchQuery={searchQuery}
        unreadMessages={1}
      />

      <CategoryFilter
        selectedDepartment={selectedDepartment}
        selectedSemester={selectedSemester}
        selectedType={selectedType}
        onDepartmentChange={setSelectedDepartment}
        onSemesterChange={setSelectedSemester}
        onTypeChange={setSelectedType}
        onClearFilters={clearFilters}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        {searchQuery === "" && selectedDepartment === "All Departments" && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl mb-4">NITC Student Marketplace</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Buy, sell, rent, or donate academic resources within the NITC community. 
                Connect with fellow students and get the materials you need.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div>
                    <div className="text-2xl">500+</div>
                    <p className="text-sm text-muted-foreground">Active Listings</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div>
                    <div className="text-2xl">1,200+</div>
                    <p className="text-sm text-muted-foreground">Students</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <div>
                    <div className="text-2xl">4.8</div>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div>
                    <div className="text-2xl">300+</div>
                    <p className="text-sm text-muted-foreground">Transactions</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {categories.map((category, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${category.color}`}>
                      <category.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-medium mb-1">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} items</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2>
              {searchQuery ? `Search results for "${searchQuery}"` : "Latest Listings"}
            </h2>
            <p className="text-muted-foreground">
              Showing {filteredItems.length} of {items.length} items
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Button variant="outline" size="sm">Latest</Button>
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3>No items found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse different categories
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={handleItemClick}
                onContactSeller={handleContactSeller}
              />
            ))}
          </div>
        )}
      </main>

      {/* Dialogs - Removed PostItemDialog as it's now a separate page */}

      <MessagingInterface
        isOpen={showMessages}
        onClose={() => setShowMessages(false)}
        currentUserId={currentUser.id}
      />

      {/* Transaction Complete Modal */}
      {showTransactionComplete && completedTransaction && (
        <TransactionComplete
          transaction={completedTransaction}
          onSubmitReview={handleReviewFromTransaction}
          onSkip={handleSkipReview}
        />
      )}
    </div>
  );
}