import { CheckCircle, Star, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Item } from "./ItemCard";

interface TransactionCompleteProps {
  transaction: {
    id: string;
    item: Item;
    seller: {
      id: string;
      name: string;
      email: string;
      rating: number;
      reviewCount: number;
    };
    completedDate: string;
    amount?: number;
  };
  onSubmitReview: (transaction: any) => void;
  onSkip: () => void;
}

export function TransactionComplete({ transaction, onSubmitReview, onSkip }: TransactionCompleteProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle>Transaction Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Transaction Summary */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <ImageWithFallback
                src={transaction.item.images[0]}
                alt={transaction.item.title}
                className="w-12 h-12 rounded-md object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-sm">{transaction.item.title}</p>
                <div className="flex items-center space-x-2">
                  {transaction.amount && (
                    <span className="text-sm text-muted-foreground">₹{transaction.amount}</span>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {transaction.item.type}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Seller: {transaction.seller.name}</span>
            </div>
          </div>

          {/* Review Prompt */}
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              How was your experience? Help other students by leaving a review.
            </p>
            
            <div className="space-y-2">
              <Button onClick={() => onSubmitReview(transaction)} className="w-full">
                <Star className="w-4 h-4 mr-2" />
                Submit Review
              </Button>
              <Button variant="outline" onClick={onSkip} className="w-full">
                Skip for Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}