import { useState } from "react";
import { X, Upload, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Card, CardContent } from "./ui/card";

interface PostItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: any) => void;
}

const departments = [
  "Computer Science & Engineering",
  "Electronics & Communication",
  "Mechanical Engineering", 
  "Civil Engineering",
  "Chemical Engineering",
  "Electrical Engineering",
  "Architecture",
  "Mathematics",
  "Physics",
  "Chemistry"
];

const categories = [
  { value: "textbook", label: "Textbook" },
  { value: "lab-equipment", label: "Lab Equipment" },
  { value: "stationery", label: "Stationery" },
  { value: "other", label: "Other" }
];

const conditions = [
  { value: "new", label: "New" },
  { value: "like-new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" }
];

export function PostItemDialog({ isOpen, onClose, onSubmit }: PostItemDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "sale",
    category: "",
    department: "",
    semester: "",
    courseCode: "",
    condition: "",
    price: "",
    location: "",
    images: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      title: "",
      description: "",
      type: "sale", 
      category: "",
      department: "",
      semester: "",
      courseCode: "",
      condition: "",
      price: "",
      location: "",
      images: []
    });
  };

  const handleImageUpload = () => {
    // Mock image URLs for demonstration
    const mockImages = [
      "https://images.unsplash.com/photo-1595315342809-fa10945ed07c?w=400",
      "https://images.unsplash.com/photo-1758876569703-ea9b21463691?w=400"
    ];
    setFormData({
      ...formData,
      images: [...formData.images, mockImages[formData.images.length % 2]]
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>List Your Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Item Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Advanced Engineering Mathematics by Kreyszig"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the item condition, usage, and any other relevant details..."
                rows={4}
                required
              />
            </div>
          </div>

          {/* Type Selection */}
          <div>
            <Label>Listing Type *</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value:any) => setFormData({ ...formData, type: value })}
              className="flex space-x-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sale" id="sale" />
                <Label htmlFor="sale">For Sale</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rent" id="rent" />
                <Label htmlFor="rent">For Rent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="free" id="free" />
                <Label htmlFor="free">Free/Donation</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Price */}
          {formData.type === "sale" && (
            <div>
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Enter price in rupees"
                required
              />
            </div>
          )}

          {/* Category & Academic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category *</Label>
              <Select value={formData.category} onValueChange={(value:any) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Department *</Label>
              <Select value={formData.department} onValueChange={(value:any) => setFormData({ ...formData, department: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="semester">Semester (Optional)</Label>
              <Input
                id="semester"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                placeholder="e.g., 3"
              />
            </div>

            <div>
              <Label htmlFor="courseCode">Course Code (Optional)</Label>
              <Input
                id="courseCode"
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                placeholder="e.g., MA2001"
              />
            </div>
          </div>

          {/* Condition & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Condition *</Label>
              <Select value={formData.condition} onValueChange={(value:any) => setFormData({ ...formData, condition: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((cond) => (
                    <SelectItem key={cond.value} value={cond.value}>
                      {cond.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Pickup Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Hostel H3, Room 201"
                required
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <Label>Photos (Optional)</Label>
            <div className="mt-2 space-y-3">
              {formData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 w-6 h-6"
                        onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== index);
                          setFormData({ ...formData, images: newImages });
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">Add photos to showcase your item</p>
                  <Button type="button" variant="outline" onClick={handleImageUpload}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Photo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              List Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}