import { useState } from "react";
import { ArrowLeft, Star, TrendingUp, User, Calendar, ThumbsUp, MoreHorizontal, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";

interface ViewRatingsProps {
  onBack: () => void;
  userId: string;
  userName: string;
}

// Mock reviews data
const mockReviews = [
  {
    id: "1",
    reviewerName: "Priya Sharma",
    reviewerAvatar: undefined,
    overallRating: 5,
    ratings: {
      communication: 5,
      item_condition: 5,
      transaction: 5,
      overall: 5
    },
    comment: "Excellent seller! The textbook was exactly as described and in perfect condition. Very responsive to messages and made the pickup process super convenient. Highly recommend!",
    itemTitle: "Advanced Engineering Mathematics - Kreyszig",
    submittedAt: "2024-01-15",
    helpful: 8,
    verified: true
  },
  {
    id: "2",
    reviewerName: "Karthik Kumar",
    reviewerAvatar: undefined,
    overallRating: 4,
    ratings: {
      communication: 4,
      item_condition: 5,
      transaction: 4,
      overall: 4
    },
    comment: "Good transaction overall. The lab equipment was in great working condition. Communication was good, though there was a slight delay in scheduling the pickup. Would deal with again.",
    itemTitle: "Digital Oscilloscope Rental",
    submittedAt: "2024-01-10",
    helpful: 5,
    verified: true
  },
  {
    id: "3",
    reviewerName: "Sneha Patel",
    reviewerAvatar: undefined,
    overallRating: 5,
    ratings: {
      communication: 5,
      item_condition: 4,
      transaction: 5,
      overall: 5
    },
    comment: "Amazing experience! The seller was very kind and patient. The stationery set was almost new and saved me a lot of money. Great for the NITC community spirit!",
    itemTitle: "Complete Stationery Set",
    submittedAt: "2024-01-08",
    helpful: 12,
    verified: true
  },
  {
    id: "4",
    reviewerName: "Rahul Nair",
    reviewerAvatar: undefined,
    overallRating: 3,
    ratings: {
      communication: 3,
      item_condition: 3,
      transaction: 3,
      overall: 3
    },
    comment: "Average experience. The item was okay but had more wear than expected from the description. Communication was decent. Fair price though.",
    itemTitle: "Computer Graphics Textbook",
    submittedAt: "2024-01-05",
    helpful: 2,
    verified: true
  },
  {
    id: "5",
    reviewerName: "Ananya Reddy",
    reviewerAvatar: undefined,
    overallRating: 5,
    ratings: {
      communication: 5,
      item_condition: 5,
      transaction: 5,
      overall: 5
    },
    comment: "Perfect seller! Quick responses, item exactly as described, and very fair pricing. Made my semester much easier. Thank you!",
    itemTitle: "Engineering Drawing Kit",
    submittedAt: "2024-01-02",
    helpful: 15,
    verified: true
  }
];

const aspectLabels = {
  communication: "Communication",
  item_condition: "Item Condition",
  transaction: "Transaction",
  overall: "Overall"
};

export function ViewRatings({ onBack, userId, userName }: ViewRatingsProps) {
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate statistics
  const totalReviews = mockReviews.length;
  const averageRating = mockReviews.reduce((acc, review) => acc + review.overallRating, 0) / totalReviews;
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: mockReviews.filter(review => review.overallRating === rating).length,
    percentage: (mockReviews.filter(review => review.overallRating === rating).length / totalReviews) * 100
  }));

  const aspectAverages = Object.keys(aspectLabels).reduce((acc, aspect) => {
    acc[aspect] = mockReviews.reduce((sum, review) => sum + review.ratings[aspect as keyof typeof aspectLabels], 0) / totalReviews;
    return acc;
  }, {} as Record<string, number>);

  // Filter and sort reviews
  const filteredReviews = mockReviews.filter(review => {
    const matchesSearch = searchQuery === "" || 
      review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.itemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.reviewerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = filterRating === "all" || 
      review.overallRating === parseInt(filterRating);

    return matchesSearch && matchesRating;
  }).sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      case "oldest":
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      case "highest":
        return b.overallRating - a.overallRating;
      case "lowest":
        return a.overallRating - b.overallRating;
      case "helpful":
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  const handleMarkHelpful = (reviewId: string) => {
    // This would update the helpful count in real app
    console.log("Mark helpful:", reviewId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div className="text-center">
            <h1 className="text-3xl">Reviews & Ratings</h1>
            <p className="text-muted-foreground">for {userName}</p>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rating Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Rating Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Rating */}
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                  <div className="flex justify-center space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(averageRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on {totalReviews} reviews
                  </p>
                </div>

                <Separator />

                {/* Rating Distribution */}
                <div className="space-y-3">
                  <h4 className="font-medium">Rating Distribution</h4>
                  {ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center space-x-3">
                      <span className="text-sm w-8">{rating} ★</span>
                      <Progress value={percentage} className="flex-1" />
                      <span className="text-sm text-muted-foreground w-8">{count}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Aspect Ratings */}
                <div className="space-y-3">
                  <h4 className="font-medium">Category Breakdown</h4>
                  {Object.entries(aspectAverages).map(([aspect, average]) => (
                    <div key={aspect} className="flex items-center justify-between">
                      <span className="text-sm">{aspectLabels[aspect as keyof typeof aspectLabels]}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{average.toFixed(1)}</span>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Reviews ({filteredReviews.length})</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Search reviews..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-48"
                    />
                    <Select value={filterRating} onValueChange={setFilterRating}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="1">1 Star</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="highest">Highest Rated</SelectItem>
                        <SelectItem value="lowest">Lowest Rated</SelectItem>
                        <SelectItem value="helpful">Most Helpful</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredReviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={review.reviewerAvatar} />
                          <AvatarFallback>{review.reviewerName[0]}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-3">
                          {/* Review Header */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{review.reviewerName}</span>
                                {review.verified && (
                                  <Badge variant="secondary" className="text-xs">
                                    Verified Purchase
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="flex space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= review.overallRating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {review.submittedAt}
                                </span>
                              </div>
                            </div>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  Report Review
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Share Review
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Item Info */}
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {review.itemTitle}
                            </Badge>
                          </div>

                          {/* Review Content */}
                          <p className="text-muted-foreground">{review.comment}</p>

                          {/* Detailed Ratings */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Object.entries(review.ratings).map(([aspect, rating]) => (
                              <div key={aspect} className="text-center p-2 bg-muted rounded-lg">
                                <div className="text-sm font-medium">{rating}/5</div>
                                <div className="text-xs text-muted-foreground">
                                  {aspectLabels[aspect as keyof typeof aspectLabels]}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Review Actions */}
                          <div className="flex items-center justify-between pt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkHelpful(review.id)}
                              className="flex items-center space-x-2"
                            >
                              <ThumbsUp className="w-4 h-4" />
                              <span>Helpful ({review.helpful})</span>
                            </Button>
                            
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>{review.submittedAt}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredReviews.length === 0 && (
                    <div className="text-center py-12">
                      <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3>No reviews found</h3>
                      <p className="text-muted-foreground">
                        {mockReviews.length === 0 
                          ? "No reviews have been submitted yet."
                          : "No reviews match your current filters."
                        }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}