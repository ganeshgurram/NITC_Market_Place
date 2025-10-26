import { Star, MapPin, Clock, MessageCircle, ArrowLeft, Share2, Heart, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Item } from "./ItemCard";

interface ItemDetailProps {
  item: Item;
  onBack: () => void;
  onContactSeller: (item: Item) => void;
  onViewProfile: (sellerId: string) => void;
  onTransactionComplete?: (item: Item) => void;
}

export function ItemDetail({ item, onBack, onContactSeller, onViewProfile, onTransactionComplete }: ItemDetailProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "sale": return "bg-blue-100 text-blue-800";
      case "rent": return "bg-green-100 text-green-800";
      case "free": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new": return "bg-emerald-100 text-emerald-800";
      case "like-new": return "bg-teal-100 text-teal-800";
      case "good": return "bg-yellow-100 text-yellow-800";
      case "fair": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to listings</span>
        </Button>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
            <ImageWithFallback
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge className={getTypeColor(item.type)}>
                {item.type === "sale" ? "For Sale" : 
                 item.type === "rent" ? "For Rent" : "Free"}
              </Badge>
            </div>
            {!item.isAvailable && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Badge variant="destructive" className="text-lg">Not Available</Badge>
              </div>
            )}
          </div>
          
          {item.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {item.images.slice(1, 5).map((image, index) => (
                <div key={index} className="aspect-square rounded-md overflow-hidden bg-gray-100">
                  <ImageWithFallback
                    src={image}
                    alt={`${item.title} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl font-semibold">{item.title}</h1>
              {item.type === "sale" && item.price && (
                <span className="text-2xl font-bold text-primary">₹{item.price}</span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{item.department}</Badge>
              {item.semester && (
                <Badge variant="outline">Semester {item.semester}</Badge>
              )}
              {item.courseCode && (
                <Badge variant="outline">{item.courseCode}</Badge>
              )}
              <Badge className={getConditionColor(item.condition)}>
                {item.condition}
              </Badge>
            </div>

            <p className="text-muted-foreground">{item.description}</p>
          </div>

          <Separator />

          {/* Location & Time */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Location: {item.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Posted: {item.postedAt}</span>
            </div>
          </div>

          <Separator />

          {/* Seller Info */}
          <Card>
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-lg">{item.seller.name[0]}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.seller.name}</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{item.seller.rating}</span>
                      <span className="text-muted-foreground">
                        ({item.seller.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => onViewProfile(item.seller.id)}
                >
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Button */}
          <div className="space-y-3">
            <Button 
              onClick={() => onContactSeller(item)}
              className="w-full"
              size="lg"
              disabled={!item.isAvailable}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Seller
            </Button>
            
            {/* Demo Transaction Complete Button */}
            {onTransactionComplete && item.isAvailable && (
              <Button 
                onClick={() => onTransactionComplete(item)}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Complete Transaction (Demo)
              </Button>
            )}
            
            <p className="text-xs text-center text-muted-foreground">
              All communication happens through our secure messaging system
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}