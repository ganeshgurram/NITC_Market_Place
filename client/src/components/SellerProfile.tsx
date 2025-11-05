import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { usersAPI } from "../utils/api";
import { ItemCard, Item } from "./ItemCard";
import { MessageCircle } from "lucide-react";

interface SellerProfileProps {
  sellerId: string;
  onBack: () => void;
  onContactSeller: (item: Item) => void;
}

export default function SellerProfile({ sellerId, onBack, onContactSeller }: SellerProfileProps) {
  const [seller, setSeller] = useState<any | null>(null);
  const [items, setItems] = useState<Item[]>([]);
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
        if (!mounted) return;
        setSeller(user);
        setItems(Array.isArray(sellerItems) ? sellerItems : []);
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
                <p className="mt-2 text-sm">Roll: {seller.rollNumber}</p>
                <p className="text-sm">Phone: {seller.phone}</p>
                {seller.hostel && <p className="text-sm">Hostel: {seller.hostel}</p>}
                <div className="mt-3 flex items-center space-x-2">
                  <Button onClick={() => { /* placeholder for messaging */ }}>
                    <MessageCircle className="w-4 h-4 mr-2" /> Message
                  </Button>
                </div>
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
      </div>
    </div>
  );
}
