import { useState } from "react";
import { ArrowLeft, Star, User, Package, Send, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Item } from "./ItemCard";
import { toast } from "sonner@2.0.3";

interface SubmitReviewProps {
  onBack: () => void;
  onSubmit: (review: any) => void;
  transaction: {
    id: string;
    item: Item;
    seller: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
      rating: number;
      reviewCount: number;
    };
    completedDate: string;
    amount?: number;
  };
}

const ratingLabels = {
  1: "Poor",
  2: "Fair", 
  3: "Good",
  4: "Very Good",
  5: "Excellent"
};

const reviewAspects = [
  {
    id: "communication",
    label: "Communication",
    description: "How well did the seller communicate?"
  },
  {
    id: "item_condition",
    label: "Item Condition", 
    description: "Was the item as described?"
  },
  {
    id: "transaction",
    label: "Transaction Process",
    description: "How smooth was the pickup/exchange?"
  },
  {
    id: "overall",
    label: "Overall Experience",
    description: "Your overall satisfaction"
  }
];

export function SubmitReview({ onBack, onSubmit, transaction }: SubmitReviewProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [hoverRatings, setHoverRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRatingChange = (aspectId: string, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [aspectId]: rating
    }));
  };

  const handleSubmit = async () => {
    // Validate that all aspects are rated
    const missingRatings = reviewAspects.filter(aspect => !ratings[aspect.id]);
    if (missingRatings.length > 0) {
      toast("Please rate all aspects", {
        description: "All rating categories are required"
      });
      return;
    }

    if (!comment.trim()) {
      toast("Please add a comment", {
        description: "A written review is required"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate overall rating as average
      const overallRating = Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length;

      const review = {
        id: Date.now().toString(),
        transactionId: transaction.id,
        sellerId: transaction.seller.id,
        itemId: transaction.item.id,
        buyerName: "Current User", // This would come from auth
        ratings,
        overallRating: Math.round(overallRating * 10) / 10,
        comment: comment.trim(),
        submittedAt: new Date().toISOString(),
        helpful: 0
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      onSubmit(review);
      setIsSubmitted(true);
      
      toast("Review submitted successfully!", {
        description: "Thank you for helping the NITC community"
      });
    } catch (error) {
      toast("Failed to submit review", {
        description: "Please try again later"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto p-6">
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl mb-4">Review Submitted!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for taking the time to review your transaction. Your feedback helps build trust in the NITC marketplace community.
            </p>
            <div className="space-y-3">
              <Button onClick={onBack} className="w-full">
                Back to Marketplace
              </Button>
              <Button variant="outline" onClick={onBack} className="w-full">
                Submit Another Review
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <h1 className="text-3xl">Submit Review</h1>
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Transaction Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Transaction Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <ImageWithFallback
                src={transaction.item.images[0]}
                alt={transaction.item.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium mb-2">{transaction.item.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                  <span>Completed: {transaction.completedDate}</span>
                  {transaction.amount && <span>Amount: ₹{transaction.amount}</span>}
                  <Badge variant="outline">{transaction.item.type}</Badge>
                </div>
                
                {/* Seller Info */}
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={transaction.seller.avatar} />
                    <AvatarFallback>{transaction.seller.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{transaction.seller.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{transaction.seller.rating}</span>
                      <span>({transaction.seller.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Rate Your Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {reviewAspects.map((aspect) => (
              <div key={aspect.id} className="space-y-3">
                <div>
                  <Label className="text-base">{aspect.label}</Label>
                  <p className="text-sm text-muted-foreground">{aspect.description}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="p-1 transition-colors"
                        onMouseEnter={() => setHoverRatings(prev => ({ ...prev, [aspect.id]: star }))}
                        onMouseLeave={() => setHoverRatings(prev => ({ ...prev, [aspect.id]: 0 }))}
                        onClick={() => handleRatingChange(aspect.id, star)}
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            (hoverRatings[aspect.id] || ratings[aspect.id] || 0) >= star
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  
                  {ratings[aspect.id] && (
                    <span className="text-sm text-muted-foreground ml-3">
                      {ratingLabels[ratings[aspect.id] as keyof typeof ratingLabels]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Written Review */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Written Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comment">Share your experience *</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell other students about your experience with this seller. Was the item as described? Was the transaction smooth? Any other helpful details..."
                rows={4}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">
                Minimum 10 characters ({comment.length}/500)
              </p>
            </div>

            <Alert>
              <User className="h-4 w-4" />
              <AlertDescription>
                Your review will be publicly visible and help other students make informed decisions. Please be honest and constructive.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex space-x-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || Object.keys(ratings).length < reviewAspects.length || !comment.trim()}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Submitting Review...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Review
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}