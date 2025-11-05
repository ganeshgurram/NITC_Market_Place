import { useState } from "react";
import { Eye, EyeOff, ArrowRight, BookOpen, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { authAPI } from "../utils/api";
import { toast } from "sonner";

interface SignUpProps {
  onSignUp: (user: any) => void;
  onSwitchToSignIn: () => void;
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
  "Chemistry"
];

const years = [
  "1st Year",
  "2nd Year", 
  "3rd Year",
  "4th Year",
  "PhD Scholar"
];

export function SignUp({ onSignUp, onSwitchToSignIn }: SignUpProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    year: "",
    rollNumber: "",
    phone: "",
    hostel: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const validateStep1 = () => {
    if (!formData.fullName.trim()) return "Full name is required";
    if (!formData.email.endsWith("@nitc.ac.in")) return "Please use your NITC email address";
    if (formData.password.length < 6) return "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) return "Passwords don't match";
    if (!formData.phone || formData.phone.trim().length < 6) return "Please enter a valid phone number";
    return null;
  };

  const validateStep2 = () => {
    if (!formData.department) return "Please select your department";
    if (!formData.year) return "Please select your academic year";
    if (!formData.rollNumber.trim()) return "Roll number is required";
    return null;
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateStep1();
    if (error) {
      setError(error);
      return;
    }
    setError("");
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateStep2();
    if (error) {
      setError(error);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Extract semester from year
      const semester = formData.year.split(' ')[0]; // "1st Year" -> "1st" -> "1"
      
      const response = await authAPI.signup({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        rollNumber: formData.rollNumber,
        department: formData.department,
        semester: semester,
        phone: formData.phone || "0000000000", // Default if not provided
        hostel: formData.hostel
      });

      toast.success("Account created successfully!");
      onSignUp(response.user);
    } catch (err: any) {
      const errorMessage = err.message || "Sign up failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Hero Image */}
      <div className="hidden lg:flex lg:flex-1 relative">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1595315342809-fa10945ed07c?w=800&h=1200&fit=crop"
          alt="NITC Students"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white max-w-md">
            <BookOpen className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-3xl mb-4">Join NITC Marketplace</h1>
            <p className="text-lg opacity-90 mb-6">
              Become part of a thriving community where students share, trade, and support each other's academic journey.
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Buy and sell textbooks at student-friendly prices</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Rent lab equipment for your projects</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Get free stationery and materials</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Connect with students in your department</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-medium">NM</span>
              </div>
              <h2 className="text-2xl">NITC Marketplace</h2>
            </div>
            <h3 className="text-xl">Create your account</h3>
            <p className="text-muted-foreground">
              Join the NITC student community marketplace
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-2">
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

          {/* Sign Up Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 ? "Account Information" : "Academic Details"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {step === 1 ? (
                <form onSubmit={handleStep1Submit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">NITC Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.name@nitc.ac.in"
                      required
                    />
                  </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                        required
                      />
                    </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Create a strong password"
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="Confirm your password"
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleFinalSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select value={formData.department} onValueChange={(value:any) => setFormData({ ...formData, department: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your department" />
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

                  <div className="space-y-2">
                    <Label>Academic Year</Label>
                    <Select value={formData.year} onValueChange={(value:any) => setFormData({ ...formData, year: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your academic year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input
                      id="rollNumber"
                      type="text"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      placeholder="Enter your roll number"
                      required
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(1)}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </div>
                </form>
              )}

              <div className="mt-6">
                <Separator className="my-4" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto"
                      onClick={onSwitchToSignIn}
                      disabled={isLoading}
                    >
                      Sign in here
                    </Button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              By creating an account, you agree to our{" "}
              <Button variant="link" className="p-0 h-auto text-sm">
                Terms of Service
              </Button>
              {" "}and{" "}
              <Button variant="link" className="p-0 h-auto text-sm">
                Privacy Policy
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}