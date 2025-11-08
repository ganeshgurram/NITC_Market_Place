import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { CategoryFilter } from "./components/CategoryFilter";
import { ItemCard, Item } from "./components/ItemCard";
import { ItemDetail } from "./components/ItemDetail";
import SellerProfile from "./components/SellerProfile";
import { PostItemDialog } from "./components/PostItemDialog";
import { MessagingInterface } from "./components/MessagingInterface";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import { UserProfile } from "./components/UserProfile";
import EditProfile from "./components/EditProfile";
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
import { toast } from "sonner";
import { itemsAPI, reviewsAPI, transactionsAPI, authAPI } from "./utils/api";
import React from "react";
// No mock items: load items from sessionStorage or start with empty list

const categories = [
  { icon: BookOpen, title: "Textbooks", count: 245, color: "bg-blue-100 text-blue-700" },
  { icon: Beaker, title: "Lab Equipment", count: 67, color: "bg-green-100 text-green-700" },
  { icon: PenTool, title: "Stationery", count: 156, color: "bg-purple-100 text-purple-700" },
  { icon: Users, title: "Other Items", count: 89, color: "bg-orange-100 text-orange-700" }
];

export default function App() {
  // Initialize from sessionStorage so reload preserves session and current page
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const raw = sessionStorage.getItem('nm_currentUser');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });
  const [authMode, setAuthMode] = useState<"signin" | "signup" | null>(null);
  // Use a flexible string page so we can support dynamic paths like item/:id
  const [currentPage, setCurrentPage] = useState<string>(() => {
    try {
      const raw = sessionStorage.getItem('nm_currentPage');
      return (raw as any) || "marketplace";
    } catch (e) {
      return "marketplace";
    }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedSemester, setSelectedSemester] = useState("All Semesters");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedAvailability, setSelectedAvailability] = useState("Available Only");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [selectedSellerForMessage, setSelectedSellerForMessage] = useState<any>(null);
  const [selectedItemForMessage, setSelectedItemForMessage] = useState<any>(null);
  const [items, setItems] = useState<Item[]>(() => {
    try {
      const raw = sessionStorage.getItem('nm_items');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedUserForRatings, setSelectedUserForRatings] = useState<any>(null);
  const [showTransactionComplete, setShowTransactionComplete] = useState(false);
  const [completedTransaction, setCompletedTransaction] = useState<any>(null);

  // Filter items based on search and filters
  const filteredItems = items.filter(item => {
    // Filter out items with null sellers (deleted users)
    if (!item.seller) {
      return false;
    }
    
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

    const matchesAvailability = selectedAvailability === "All Items" ||
      (selectedAvailability === "Available Only" && item.isAvailable);

    return matchesSearch && matchesDepartment && matchesSemester && matchesType && matchesAvailability;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearFilters = () => {
    setSelectedDepartment("All Departments");
    setSelectedSemester("All Semesters");
    setSelectedType("All Types");
    setSelectedAvailability("Available Only");
  };

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    // navigate to item detail URL (kept in state; RouterSync syncs URL)
    const itemId = item.id || (item as any)._id;
    setCurrentPage(`item/${itemId}`);
  };

  const handleContactSeller = (item: Item) => {
    setSelectedSellerForMessage({
      id: item.seller?.id || item.seller?.id,
      name: item.seller?.name,
      rating: item.seller?.rating
    });
    setSelectedItemForMessage({
      id: item.id ,
      title: item.title,
      images: item.images
    });
    setShowMessages(true);
    toast(`Opening chat with ${item.seller?.name}`, {
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
    authAPI.signout();
    setCurrentUser(null);
    setCurrentPage("marketplace");
    setSelectedItem(null);
    setShowPostDialog(false);
    setShowMessages(false);
    setSelectedSellerForMessage(null);
    setSelectedItemForMessage(null);
    // Clear session storage for user and page but keep items persisted
    try {
      sessionStorage.removeItem('nm_currentUser');
      sessionStorage.setItem('nm_currentPage', 'marketplace');
    } catch (e) {
      // ignore
    }
    toast("Signed out successfully", {
      description: "You've been signed out of your account"
    });
  };

  const handleCloseMessages = () => {
    setShowMessages(false);
    setSelectedSellerForMessage(null);
    setSelectedItemForMessage(null);
  };

  const handlePostItem = async (newItem: any) => {
    if (!currentUser) return;

    try {
      const payload = {
        ...newItem,
        price: newItem.type === 'sale' ? newItem.price : undefined
      };

      const data = await itemsAPI.create(payload);
      const created: Item = data.item;

      setItems(prev => {
        const next = [created, ...prev];
        try { sessionStorage.setItem('nm_items', JSON.stringify(next)); } catch (e) {}
        return next;
      });

      toast("Item listed successfully!", {
        description: "Your item is now visible to other students."
      });
    } catch (err: any) {
      const message = err?.message || 'Failed to create item';
      toast.error ? toast.error(message) : toast(message);
    }
  };

  const handleViewProfile = (sellerId: string) => {
    // Navigate to seller profile page (internal lightweight routing)
    if (sellerId === currentUser?.id) {
      setCurrentPage("profile");
    } else {
      setCurrentPage(`seller/${sellerId}`);
    }
  };

  const handleProfileClick = () => {
    if (currentUser?.role === "admin") {
      setCurrentPage("admin");
    } else {
      setCurrentPage("profile");
    }
  };

  const handleEditProfile = () => {
    setCurrentPage('profile/edit');
  };

  const handleProfileSave = (updatedUser: any) => {
    // Merge updated user into currentUser and persist
    const next = { ...currentUser, ...updatedUser };
    setCurrentUser(next);
    try { sessionStorage.setItem('nm_currentUser', JSON.stringify(next)); } catch (e) {}
    setCurrentPage('profile');
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
    setItems(prev => {
      const next = prev.map(item => {
        const currentItemId = item.id || (item as any)._id;
        return currentItemId === itemId ? { ...item, ...updates } : item;
      });
      try { sessionStorage.setItem('nm_items', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  const handleItemDelete = (itemId: string) => {
    setItems(prev => {
      const next = prev.filter(item => {
        const currentItemId = item.id || (item as any)._id;
        return currentItemId !== itemId;
      });
      try { sessionStorage.setItem('nm_items', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  const handleReviewSubmit = async (review: any) => {
    try {
      console.log('Submitting review:', review);

      // Submit review to backend
      const response = await reviewsAPI.create({
        reviewedUserId: review.sellerId,
        transactionId: review.transactionId,
        rating: review.overallRating,
        comment: review.comment,
        categories: {
          communication: review.ratings.communication || 0,
          itemCondition: review.ratings.item_condition || 0,
          punctuality: review.ratings.transaction || 0
        }
      });

      console.log('Review submitted successfully:', response);

      // Refresh items to get updated seller ratings
      try {
        const itemsData = await itemsAPI.getAll();
        if (itemsData?.items) {
          setItems(itemsData.items);
          try { sessionStorage.setItem('nm_items', JSON.stringify(itemsData.items)); } catch (e) {}
        }
      } catch (e) {
        console.error('Failed to refresh items:', e);
      }

      setReviews(prev => [...prev, review]);
      setCurrentPage("marketplace");
      setSelectedTransaction(null);

      toast("Review submitted successfully!", {
        description: "Thank you for your feedback"
      });
    } catch (error: any) {
      console.error('Failed to submit review:', error);
      console.error('Error details:', error.response?.data || error.message);

      const errorMessage = error.response?.data?.error || error.message || "Failed to submit review";
      const errorDetails = error.response?.data?.errors
        ? error.response.data.errors.map((e: any) => e.msg).join(', ')
        : "Please try again later";

      toast(errorMessage, {
        description: errorDetails
      });
    }
  };

  const handleViewRatings = (user: any) => {
    setSelectedUserForRatings(user);
    setCurrentPage("ratings");
  };

  const handleSubmitReviewClick = (transaction: any) => {
    setSelectedTransaction(transaction);
    setCurrentPage("review");
  };

  const handleTransactionComplete = async (item: Item) => {
    try {
      // Create transaction in backend
      const sellerId = item.seller.id || (item.seller as any)._id;
      const itemId = item.id || (item as any)._id;

      console.log('=== Transaction Debug ===');
      console.log('Item:', item);
      console.log('Seller from item:', item.seller);
      console.log('Seller ID:', sellerId);
      console.log('Item ID:', itemId);
      console.log('Current User ID:', currentUser?.id || (currentUser as any)?._id);
      console.log('========================');

      if (!sellerId || sellerId === 'undefined') {
        toast('Error: Seller ID is missing', {
          description: 'Cannot complete transaction without valid seller information'
        });
        return;
      }

      const transactionData = await transactionsAPI.create({
        itemId,
        sellerId,
        amount: item.price
      });

      // Complete the transaction immediately (for demo purposes)
      const completedData = await transactionsAPI.complete(transactionData.transaction._id);

      // Update the item's availability in local state
      setItems(prev => {
        const next = prev.map(i => {
          const currentItemId = i.id || (i as any)._id;
          return currentItemId === itemId ? { ...i, isAvailable: false } : i;
        });
        try { sessionStorage.setItem('nm_items', JSON.stringify(next)); } catch (e) {}
        return next;
      });

      // Also update selectedItem if it's the same item
      if (selectedItem && ((selectedItem.id || (selectedItem as any)._id) === itemId)) {
        setSelectedItem({ ...selectedItem, isAvailable: false });
      }

      const transaction = {
        id: completedData.transaction._id,
        item: { ...item, isAvailable: false },
        seller: item.seller,
        completedDate: new Date().toISOString().split('T')[0],
        amount: item.price
      };

      // Skip the intermediate modal and go directly to review submission
      setSelectedTransaction(transaction);
      setCurrentPage("review");

      toast("Transaction completed!", {
        description: "Please submit a review for this transaction"
      });
    } catch (error: any) {
      console.error('Failed to complete transaction:', error);
      toast(error.message || "Failed to complete transaction", {
        description: "Please try again later"
      });
    }
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
    const userId = currentUser?.id || (currentUser as any)?._id;
    return items.filter(item => {
      // Filter out items with null sellers (deleted users)
      if (!item.seller) {
        return false;
      }
      const sellerId = item.seller.id || (item.seller as any)?._id;
      return sellerId === userId;
    });
  };

  // Show authentication screens if not logged in
  // persist currentUser and currentPage to sessionStorage
  useEffect(() => {
    try {
      if (currentUser) sessionStorage.setItem('nm_currentUser', JSON.stringify(currentUser));
      else sessionStorage.removeItem('nm_currentUser');
    } catch (e) {}
  }, [currentUser]);

  useEffect(() => {
    try {
      if (currentPage) sessionStorage.setItem('nm_currentPage', currentPage);
    } catch (e) {}
  }, [currentPage]);

  // Lightweight URL sync using History API (avoids react-router-dom hooks)
  useEffect(() => {
    // initialize currentPage from URL on mount
    const path = window.location.pathname;
    if (path === '/' || path === '/marketplace') {
      setCurrentPage('marketplace');
    } else {
      setCurrentPage(path.startsWith('/') ? path.slice(1) : path);
    }

    // if visiting /item/:id directly, load the item
    if (path.startsWith('/item/')) {
      const parts = path.split('/').filter(Boolean);
      const id = parts[1] || parts[0];
      // guard against malformed URLs like /item/undefined
      if (id && id !== 'undefined') {
        (async () => {
          try {
            const res = await itemsAPI.getById(id);
            if (res?.item) setSelectedItem(res.item);
          } catch (err) {
            console.error('Failed to load item by id', err);
          }
        })();
      }
    }

    const onPop = (e: PopStateEvent) => {
      const p = window.location.pathname;
      if (p === '/' || p === '/marketplace') setCurrentPage('marketplace');
      else setCurrentPage(p.startsWith('/') ? p.slice(1) : p);
    };

    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // push history when currentPage changes
  useEffect(() => {
    const desiredPath = currentPage === 'marketplace' ? '/' : `/${currentPage}`;
    if (window.location.pathname !== desiredPath) {
      window.history.pushState({}, '', desiredPath);
    }

    // if navigating to an item detail, load it
    if (currentPage.startsWith('item/')) {
      const id = currentPage.split('/')[1];
      // guard against malformed ids (e.g. 'undefined')
      if (id && id !== 'undefined') {
        (async () => {
          try {
            const res = await itemsAPI.getById(id);
            if (res?.item) setSelectedItem(res.item);
          } catch (err) {
            console.error('Failed to load item by id', err);
          }
        })();
      }
    }
  }, [currentPage]);

  // Load items from backend (useful after login or on initial load)
  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await itemsAPI.getAll();
        if (data?.items) {
          setItems(data.items);
          try { sessionStorage.setItem('nm_items', JSON.stringify(data.items)); } catch (e) {}
        }
      } catch (e) {
        // ignore load errors (server may be offline during dev)
      }
    };

    loadItems();
  }, [currentUser]);

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
    return <AdminDashboard currentUser={currentUser} onSignOut={handleSignOut} />;
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
            onEdit={handleEditProfile}
            userItems={getUserItems()}
            onManageListings={handleManageListingsClick}
            onViewRatings={() => handleViewRatings(currentUser)}
          />
          <MessagingInterface
            isOpen={showMessages}
            onClose={handleCloseMessages}
            currentUserId={currentUser.id}
            selectedSeller={selectedSellerForMessage}
            selectedItem={selectedItemForMessage}
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
            onSubmit={async (newItem) => {
              await handlePostItem(newItem);
              setCurrentPage("marketplace");
            }}
            currentUser={currentUser}
          />
          <MessagingInterface
            isOpen={showMessages}
            onClose={handleCloseMessages}
            currentUserId={currentUser.id}
            selectedSeller={selectedSellerForMessage}
            selectedItem={selectedItemForMessage}
          />
        </div>
    );
  }

  // Show seller profile page
  if (currentPage.startsWith('seller/')) {
    const id = currentPage.split('/')[1];
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
        <SellerProfile sellerId={id} onBack={handleBackToMarketplace} onContactSeller={handleContactSeller} />
        <MessagingInterface
          isOpen={showMessages}
          onClose={handleCloseMessages}
          currentUserId={currentUser.id}
          selectedSeller={selectedSellerForMessage}
          selectedItem={selectedItemForMessage}
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
            onClose={handleCloseMessages}
            currentUserId={currentUser.id}
            selectedSeller={selectedSellerForMessage}
            selectedItem={selectedItemForMessage}
          />
        </div>
    );
  }

  // Show edit profile page
  if (currentPage === 'profile/edit') {
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
        <div className="max-w-6xl mx-auto p-6">
          <EditProfile
            currentUser={currentUser}
            onCancel={() => setCurrentPage('profile')}
            onSave={handleProfileSave}
          />
        </div>
        <MessagingInterface
          isOpen={showMessages}
          onClose={handleCloseMessages}
          currentUserId={currentUser.id}
          selectedSeller={selectedSellerForMessage}
          selectedItem={selectedItemForMessage}
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
            onTransactionComplete={
              // Only allow transaction completion if user is not the seller
              currentUser &&
              (selectedItem.seller.id || (selectedItem.seller as any)._id) !== (currentUser.id || (currentUser as any)._id)
                ? handleTransactionComplete
                : undefined
            }
          />
          <MessagingInterface
            isOpen={showMessages}
            onClose={handleCloseMessages}
            currentUserId={currentUser.id}
            selectedSeller={selectedSellerForMessage}
            selectedItem={selectedItemForMessage}
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
          selectedAvailability={selectedAvailability}
          onDepartmentChange={setSelectedDepartment}
          onSemesterChange={setSelectedSemester}
          onTypeChange={setSelectedType}
          onAvailabilityChange={setSelectedAvailability}
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
            {filteredItems.map((item, idx) => (
              <ItemCard
                key={item.id ?? (item as any)._id ?? idx}
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
        onClose={handleCloseMessages}
        currentUserId={currentUser.id}
        selectedSeller={selectedSellerForMessage}
        selectedItem={selectedItemForMessage}
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