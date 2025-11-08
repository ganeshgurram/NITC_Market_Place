import { Star, MapPin, Clock, MessageCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { formatDate } from "./ui/utils";

export interface Item {
  id: string;
  title: string;
  description: string;
  price?: number;
  type: "sale" | "rent" | "free";
  category: "textbook" | "lab-equipment" | "stationery" | "other";
  department: string;
  semester?: string;
  courseCode?: string;
  condition: "new" | "like-new" | "good" | "fair";
  images: string[];
  seller: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    reviewCount: number;
  };
  location: string;
  createdAt: string;
  isAvailable: boolean;
}

interface ItemCardProps {
  item: Item;
  onClick: (item: Item) => void;
  onContactSeller: (item: Item) => void;
}

export function ItemCard({ item, onClick, onContactSeller }: ItemCardProps) {
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
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      <div onClick={() => onClick(item)}>
        <div className="aspect-video relative bg-gray-100">
          <ImageWithFallback
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2">
            <Badge className={getTypeColor(item.type)}>
              {item.type === "sale" ? "For Sale" : 
               item.type === "rent" ? "For Rent" : "Free"}
            </Badge>
          </div>
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <Badge variant="destructive" className="text-base px-4 py-2">SOLD</Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-medium line-clamp-2">{item.title}</h3>
              {item.type === "sale" && item.price && (
                <span className="font-semibold text-primary">₹{item.price}</span>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>

            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs">
                {item.department}
              </Badge>
              {item.semester && (
                <Badge variant="outline" className="text-xs">
                  Sem {item.semester}
                </Badge>
              )}
              {item.courseCode && (
                <Badge variant="outline" className="text-xs">
                  {item.courseCode}
                </Badge>
              )}
              <Badge className={`text-xs ${getConditionColor(item.condition)}`}>
                {item.condition}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatDate(item.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-xs">{item.seller?.name[0]}</span>
                </div>
                <div>
                  <p className="text-xs">{item.seller?.name}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{item.seller?.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({item.seller?.reviewCount})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
      
      <div className="px-4 pb-4">
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            onContactSeller(item);
          }}
          className="w-full" 
          size="sm"
          disabled={!item.isAvailable}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Contact Seller
        </Button>
      </div>
    </Card>
  );
}