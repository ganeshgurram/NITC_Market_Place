
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Upload, X, Plus, MapPin, Info, DollarSign } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ListItemPageProps {
  onBack: () => void;
  onSubmit: (item: any) => void;
  currentUser: {
    name: string;
    department: string;
    year: string;
  };
}

const departments = [
  "Computer Science & Engineering",
  "Electronics & Communication Engineering", 
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Electrical Engineering",
  "Architecture & Planning",
  "Mathematics",
  "Physics",
  "Chemistry",
  "All Departments"
];

const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

const conditions = [
  { value: "new", label: "Brand New", description: "Unopened or barely used" },
  { value: "like-new", label: "Like New", description: "Minimal signs of wear" },
  { value: "good", label: "Good", description: "Some wear but fully functional" },
  { value: "fair", label: "Fair", description: "Noticeable wear but usable" }
];

const categories = [
  { value: "textbook", label: "Textbooks", icon: "📚" },
  { value: "lab-equipment", label: "Lab Equipment", icon: "🔬" },
  { value: "stationery", label: "Stationery", icon: "✏️" },
  { value: "electronics", label: "Electronics", icon: "💻" },
  { value: "other", label: "Other", icon: "📦" }
];

export function ListItemPage({ onBack, onSubmit, currentUser }: ListItemPageProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    type: "sale" as "sale" | "rent" | "free",
    category: "",
    department: currentUser.department || "",
    semester: "",
    courseCode: "",
    condition: "",
    location: "",
    contactInfo: "",
    availableUntil: "",
    images: [] as string[]
  });


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [step, setStep] = useState(1);

  // Cleanup object URLs when component unmounts or images change
  useEffect(() => {
    return () => {
      formData.images.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [formData.images]);

  // Upload image to backend and store returned path
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    setUploadingImage(true);
    try {
      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      const form = new FormData();
      form.append('image', file);
      // Upload to backend (use VITE_API_URL if set, otherwise default to localhost:5000)
      const uploadEndpoint = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/upload`;
      const res = await fetch(uploadEndpoint, {
        method: 'POST',
        body: form
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        toast.error('Image upload failed');
        return;
      }

      // Build a full URL for the uploaded file so the image loads correctly from any origin
      const backendBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api$/i, '');
      const fullUrl = data.url.startsWith('http') ? data.url : `${backendBase}${data.url}`;

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, fullUrl]
      }));
    } catch (error) {
      toast.error('Image upload error');
    } finally {
      setUploadingImage(false);
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.type) newErrors.type = "Please select listing type";
  // Price is mandatory for all listings
  if (!formData.price || (typeof formData.price === 'string' && formData.price.trim() === '')) newErrors.price = "Price is required";
  else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) newErrors.price = "Enter a valid non-negative price";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.condition) newErrors.condition = "Condition is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate submission delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onSubmit({
        ...formData,
        price: formData.price !== undefined && formData.price !== null && formData.price !== '' ? Number(formData.price) : undefined
      });
    } catch (error) {
      console.error("Error submitting item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

 
  

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </Button>
          
          {/* Progress Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              2
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">List Your Item</h1>
          <p className="text-muted-foreground">
            {step === 1 ? "Tell us about your item" : "Add details and location"}
          </p>
        </div>

        {step === 1 ? (
          <div className="space-y-8">
            {/* Item Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>What do you want to do?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={formData.type} 
                  onValueChange={(value:any) => setFormData({...formData, type: value})}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="sale" id="sale" />
                    <Label htmlFor="sale" className="flex-1">
                      <div>
                        <div className="font-medium">Sell</div>
                        <div className="text-sm text-muted-foreground">Set a price for your item</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="rent" id="rent" />
                    <Label htmlFor="rent" className="flex-1">
                      <div>
                        <div className="font-medium">Rent</div>
                        <div className="text-sm text-muted-foreground">Lend temporarily</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="free" id="free" />
                    <Label htmlFor="free" className="flex-1">
                      <div>
                        <div className="font-medium">Give Away</div>
                        <div className="text-sm text-muted-foreground">Donate for free</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                {errors.type && <p className="text-sm text-destructive mt-2">{errors.type}</p>}
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Item Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Advanced Engineering Mathematics - 10th Edition"
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the condition, usage, and any other relevant details..."
                    rows={4}
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={formData.category} onValueChange={(value:any) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <span className="flex items-center space-x-2">
                              <span>{category.icon}</span>
                              <span>{category.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="Enter price in rupees"
                    />
                    {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                  </div>
                </div>

                {/* Academic Details */}
                {(formData.category === "textbook" || formData.category === "lab-equipment") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Semester</Label>
                      <Select value={formData.semester} onValueChange={(value:any) => setFormData({...formData, semester: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {semesters.map((sem) => (
                            <SelectItem key={sem} value={sem}>
                              Semester {sem}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="courseCode">Course Code</Label>
                      <Input
                        id="courseCode"
                        value={formData.courseCode}
                        onChange={(e) => setFormData({...formData, courseCode: e.target.value})}
                        placeholder="e.g., CS2001, MA1001"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleNextStep} className="px-8">
                Next Step
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Item Details */}
            <Card>
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Department *</Label>
                    <Select value={formData.department} onValueChange={(value:any) => setFormData({...formData, department: value})}>
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
                    {errors.department && <p className="text-sm text-destructive">{errors.department}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Condition *</Label>
                    <Select value={formData.condition} onValueChange={(value:any) => setFormData({...formData, condition: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((condition) => (
                          <SelectItem key={condition.value} value={condition.value}>
                            <div>
                              <div className="font-medium">{condition.label}</div>
                              <div className="text-sm text-muted-foreground">{condition.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.condition && <p className="text-sm text-destructive">{errors.condition}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Pickup Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g., CS Block, Hostel H3, Library"
                  />
                  {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactInfo">Additional Contact Info (Optional)</Label>
                  <Input
                    id="contactInfo"
                    value={formData.contactInfo}
                    onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
                    placeholder="Phone number, WhatsApp, etc."
                  />
                </div>

                {formData.type === "rent" && (
                  <div className="space-y-2">
                    <Label htmlFor="availableUntil">Available Until</Label>
                    <Input
                      id="availableUntil"
                      type="date"
                      value={formData.availableUntil}
                      onChange={(e) => setFormData({...formData, availableUntil: e.target.value})}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <ImageWithFallback
                          src={image}
                          alt={`Item image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    
                    {formData.images.length < 5 && (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                          disabled={uploadingImage}
                        />
                        <Button
                          variant="outline"
                          className="h-32 border-dashed flex flex-col items-center justify-center"
                          onClick={() => document.getElementById('image-upload')?.click()}
                          disabled={uploadingImage}
                        >
                          {uploadingImage ? (
                            <div className="flex flex-col items-center">
                              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                              <span className="text-sm">Uploading...</span>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-6 h-6 mb-2" />
                              <span className="text-sm">Upload Image</span>
                              <span className="text-xs text-muted-foreground">Max size: 5MB</span>
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Add up to 5 images to help buyers see your item clearly. Good photos increase your chances of a successful transaction.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                Previous Step
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="px-8">
                {isSubmitting ? "Listing Item..." : "List Item"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}