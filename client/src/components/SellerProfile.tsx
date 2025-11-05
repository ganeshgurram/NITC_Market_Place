import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { usersAPI, reviewsAPI } from "../utils/api";
import { ItemCard, Item } from "./ItemCard";
import { MessageCircle, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface SellerProfileProps {
  sellerId: string;
  onBack: () => void;
  onContactSeller: (item: Item) => void;
}

export default function SellerProfile({ sellerId, onBack, onContactSeller }: SellerProfileProps) {
  const [seller, setSeller] = useState<any | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Guard: don't attempt to fetch when sellerId is falsy or the literal string 'undefined'
    if (!sellerId || sellerId === 'undefined') {
      setLoading(false);
      return;
    }
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const s = await usersAPI.getById(sellerId);
        const user = s.user || s; // API may return { user }
        const r = await usersAPI.getUserItems(sellerId);
        const sellerItems = r.items || r;

        // Fetch reviews
        const reviewsData = await reviewsAPI.getUserReviews(sellerId);
        const userReviews = reviewsData.reviews || [];

        if (!mounted) return;
        setSeller(user);
        setItems(Array.isArray(sellerItems) ? sellerItems : []);
        setReviews(userReviews);
      } catch (err) {
        console.error('Failed to load seller profile', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [sellerId]);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p>Loading seller profile…</p>
      </div>
    );
  }

  if (!sellerId || sellerId === 'undefined') {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p>Invalid seller id.</p>
        <Button onClick={onBack} variant="ghost">Back</Button>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p>Seller not found.</p>
        <Button onClick={onBack} variant="ghost">Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>Back to listings</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Seller Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                <ImageWithFallback src={seller.avatarUrl || seller.avatar || ''} alt={seller.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{seller.name}</h3>
                <p className="text-sm text-muted-foreground">{seller.department} • Semester {seller.semester}</p>

                {/* Rating Display */}
                <div className="mt-2 flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(seller.rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{seller.rating?.toFixed(1) || '0.0'}</span>
                  <span className="text-sm text-muted-foreground">
                    ({seller.reviewCount || 0} {seller.reviewCount === 1 ? 'review' : 'reviews'})
                  </span>
                </div>

                <p className="mt-2 text-sm">Roll: {seller.rollNumber}</p>
                <p className="text-sm">Phone: {seller.phone}</p>
                {seller.hostel && <p className="text-sm">Hostel: {seller.hostel}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h4 className="text-lg font-medium mb-3">Items from this seller</h4>
          {items.length === 0 ? (
            <p className="text-muted-foreground">No items found from this user.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((it) => (
                <ItemCard key={it.id ?? (it as any)._id} item={it} onClick={() => {}} onContactSeller={onContactSeller} />
              ))}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div>
          <h4 className="text-lg font-medium mb-3">Reviews ({reviews.length})</h4>
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No reviews yet for this seller.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review: any) => {
                const reviewId = review.id || review._id;
                const reviewerName = review.reviewer?.name || review.buyerName || 'Anonymous';
                const reviewerInitial = reviewerName[0]?.toUpperCase() || 'U';
                const reviewDate = review.createdAt || review.submittedAt;
                const overallRating = review.overallRating || review.rating || 0;

                return (
                  <Card key={reviewId}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>{reviewerInitial}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{reviewerName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {reviewDate ? new Date(reviewDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : 'Date not available'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium mr-1">{overallRating.toFixed(1)}</span>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(overallRating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Review Comment */}
                      <p className="text-sm text-muted-foreground mb-3">{review.comment}</p>

                      {/* Detailed Ratings */}
                      {review.ratings && typeof review.ratings === 'object' && (
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t">
                          {Object.entries(review.ratings).map(([key, value]) => {
                            const label = key.split('_').map(word =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ');
                            return (
                              <div key={key} className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">{label}:</span>
                                <div className="flex items-center space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < (value as number)
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
