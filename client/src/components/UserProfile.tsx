import { ArrowLeft, Star, MapPin, Calendar, BookOpen, MessageCircle, Settings, Edit, Award, TrendingUp, Package, Eye, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ItemCard, Item } from "./ItemCard";
import { itemsAPI, usersAPI, reviewsAPI } from "../utils/api";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    department: string;
    semester?: string; // mapped from backend 'semester'
    rollNumber?: string;
    rating: number;
    reviewCount: number;
    avatar?: string;
    bio?: string;
    createdAt?: string; // use createdAt for Joined date
    location?: string;
  };
  onBack: () => void;
  onEdit?: () => void;
  isOwnProfile?: boolean;
  userItems?: Item[];
  onManageListings?: () => void;
  onViewRatings?: () => void;
}



// reviews will be loaded from API

export function UserProfile({ user, onBack, onEdit, isOwnProfile = false, onManageListings, onViewRatings }: UserProfileProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  const handleItemClick = (item: Item) => {
    // Handle item click - could navigate to item detail
    console.log("Item clicked:", item);
  };

  const handleContactSeller = (item: Item) => {
    // Handle contact seller
    console.log("Contact seller for:", item);
  };

  // Load items for this profile from backend. If viewing own profile, use my-items endpoint.
  useEffect(() => {
    let mounted = true;
    const loadItems = async () => {
      try {
        const userId = (user as any).id || (user as any)._id;
        if (isOwnProfile) {
          const data = await itemsAPI.getMyItems();
          if (!mounted) return;
          if (data?.items) setItems(data.items);
        } else if (userId) {
          const data = await usersAPI.getUserItems(userId);
          if (!mounted) return;
          if (data?.items) setItems(data.items);
        }
      } catch (err) {
        console.error('Failed to load user items', err);
      }
    };

    loadItems();
    return () => { mounted = false; };
  }, [user, isOwnProfile]);

  // Load reviews for this user
  useEffect(() => {
    let mounted = true;
    const loadReviews = async () => {
      try {
        const userId = (user as any).id || (user as any)._id;
        if (userId) {
          const data = await reviewsAPI.getUserReviews(userId);
          if (!mounted) return;
          if (data?.reviews) setReviews(data.reviews);
        }
      } catch (err) {
        console.error('Failed to load user reviews', err);
      }
    };

    loadReviews();
    return () => { mounted = false; };
  }, [user]);

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
                {((user as any).avatar || (user as any).avatarUrl) ? (
                  <AvatarImage src={(user as any).avatar || (user as any).avatarUrl} />
                ) : (
                  <AvatarFallback className="text-2xl">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  </AvatarFallback>
                )}
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
                            i < Math.floor(user.rating || 0)  // Added fallback for rating
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{user.rating?.toFixed(1) || 'No ratings'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {user.createdAt 
                        ? `Joined ${new Date(user.createdAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}`
                        : "Join date not available"
                      }
                    </span>
                  </div>
                </div>                {/* Academic Info */}
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
                      <p className="text-sm text-muted-foreground">Semester</p>
                      <p className="font-medium">{user.semester || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {user.rollNumber && (
                    <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                      
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="listings">Active Listings ({items.length})</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({user.reviewCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-6">
            {items.length === 0 ? (
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
                {items.map((item, idx) => (
                  <ItemCard
                    key={(item as any)._id || (item as any).id || idx}
                    item={item}
                    onClick={handleItemClick}
                    onContactSeller={handleContactSeller}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {reviews.length === 0 ? (
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
                {reviews.map((review: any) => (
                  <Card key={review._id || review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>{(review.reviewer && review.reviewer.name) ? review.reviewer.name[0] : 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{(review.reviewer && review.reviewer.name) ? review.reviewer.name : 'Anonymous'}</h4>
                            <p className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
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
                        {review.transaction && review.transaction.item && review.transaction.item.title ? review.transaction.item.title : (review.item || 'Item')}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Activity tab removed as requested */}
        </Tabs>
      </div>
    </div>
  );
}