import { ArrowLeft, Star, MapPin, Calendar, BookOpen, MessageCircle, Settings, Edit, Award, TrendingUp, Package, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ItemCard, Item } from "./ItemCard";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    department: string;
    year: string;
    rollNumber?: string;
    rating: number;
    reviewCount: number;
    avatar?: string;
    bio?: string;
    joinedDate?: string;
    location?: string;
  };
  onBack: () => void;
  onEdit?: () => void;
  isOwnProfile?: boolean;
  userItems?: Item[];
  onManageListings?: () => void;
  onViewRatings?: () => void;
}

// Mock user items
const mockUserItems: Item[] = [
  {
    id: "user1",
    title: "Data Structures and Algorithms - Cormen",
    description: "Well-maintained textbook with bookmarks and notes",
    price: 950,
    type: "sale",
    category: "textbook",
    department: "Computer Science & Engineering",
    semester: "4",
    courseCode: "CS2001",
    condition: "good",
    images: ["https://images.unsplash.com/photo-1595315342809-fa10945ed07c?w=400&h=400&fit=crop"],
    seller: {
      id: "1",
      name: "Alex Student",
      rating: 4.6,
      reviewCount: 23
    },
    location: "CS Block",
    postedAt: "3 days ago",
    isAvailable: true
  },
  {
    id: "user2",
    title: "Scientific Calculator - Casio fx-991ES",
    description: "Excellent condition calculator, rarely used",
    price: 800,
    type: "sale",
    category: "stationery",
    department: "All Departments",
    condition: "like-new",
    images: ["https://images.unsplash.com/photo-1693011142814-aa33d7d1535c?w=400&h=400&fit=crop"],
    seller: {
      id: "1",
      name: "Alex Student", 
      rating: 4.6,
      reviewCount: 23
    },
    location: "Hostel H1",
    postedAt: "1 week ago",
    isAvailable: true
  }
];

// Mock reviews
const mockReviews = [
  {
    id: "1",
    reviewer: "Priya Sharma",
    rating: 5,
    comment: "Great seller! Book was exactly as described and very helpful.",
    date: "2 weeks ago",
    item: "Engineering Mathematics Textbook"
  },
  {
    id: "2", 
    reviewer: "Rahul Kumar",
    rating: 4,
    comment: "Quick response and fair price. Recommended!",
    date: "1 month ago",
    item: "Lab Equipment Rental"
  },
  {
    id: "3",
    reviewer: "Sneha Patel",
    rating: 5,
    comment: "Very reliable and trustworthy. Will deal again!",
    date: "1 month ago",
    item: "Stationery Bundle"
  }
];

export function UserProfile({ user, onBack, onEdit, isOwnProfile = false, userItems = mockUserItems, onManageListings, onViewRatings }: UserProfileProps) {
  const handleItemClick = (item: Item) => {
    // Handle item click - could navigate to item detail
    console.log("Item clicked:", item);
  };

  const handleContactSeller = (item: Item) => {
    // Handle contact seller
    console.log("Contact seller for:", item);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          {isOwnProfile ? (
            <div className="flex space-x-2">
              <Button onClick={onManageListings} variant="outline" className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>Manage Listings</span>
              </Button>
              <Button onClick={onEdit} variant="outline" className="flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </Button>
            </div>
          ) : (
            <Button onClick={onViewRatings} variant="outline" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>View All Ratings</span>
            </Button>
          )}
        </div>

        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h1 className="text-3xl">{user.name}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  {!isOwnProfile && (
                    <Button className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Message</span>
                    </Button>
                  )}
                </div>

                {/* Rating and Stats */}
                <div className="flex items-center space-x-6 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(user.rating) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{user.rating}</span>
                    <span className="text-muted-foreground">({user.reviewCount} reviews)</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {user.joinedDate || "6 months ago"}</span>
                  </div>
                </div>

                {/* Academic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-medium">{user.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                    <Award className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Academic Year</p>
                      <p className="font-medium">{user.year}</p>
                    </div>
                  </div>
                  
                  {user.rollNumber && (
                    <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Roll Number</p>
                        <p className="font-medium">{user.rollNumber}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {user.bio && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">About</h3>
                    <p className="text-muted-foreground">{user.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="listings">Active Listings ({userItems.length})</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({user.reviewCount})</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-6">
            {userItems.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3>No active listings</h3>
                  <p className="text-muted-foreground">
                    {isOwnProfile 
                      ? "You haven't posted any items yet. Start selling to earn some extra income!" 
                      : "This user hasn't posted any items yet."
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onClick={handleItemClick}
                    onContactSeller={handleContactSeller}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {mockReviews.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <Star className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3>No reviews yet</h3>
                  <p className="text-muted-foreground">
                    {isOwnProfile 
                      ? "Complete some transactions to start receiving reviews!" 
                      : "This user hasn't received any reviews yet."
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>{review.reviewer[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{review.reviewer}</h4>
                            <p className="text-sm text-muted-foreground">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">{review.comment}</p>
                      <Badge variant="outline" className="text-xs">
                        {review.item}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">Listed a new item: "Advanced Engineering Mathematics"</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">Received a 5-star review from Priya Sharma</p>
                      <p className="text-xs text-muted-foreground">2 weeks ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">Completed transaction for "Lab Equipment"</p>
                      <p className="text-xs text-muted-foreground">1 month ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}