import { useState } from "react";
import { Eye, EyeOff, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface SignInProps {
  onSignIn: (user: any) => void;
  onSwitchToSignUp: () => void;
}

export function SignIn({ onSignIn, onSwitchToSignUp }: SignInProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Mock authentication - in real app this would call an API
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (!formData.email.endsWith("@nitc.ac.in")) {
        throw new Error("Please use your NITC email address");
      }
      
      if (formData.password.length < 6) {
        throw new Error("Invalid credentials");
      }

      // Check for admin login
      const isAdmin = formData.email === "admin@nitc.ac.in" && formData.password === "admin123";

      // Mock user data
      const user = {
        id: isAdmin ? "admin" : "1",
        name: isAdmin ? "Admin User" : formData.email.split("@")[0].replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()),
        email: formData.email,
        rating: isAdmin ? 5.0 : 4.6,
        reviewCount: isAdmin ? 0 : 23,
        department: isAdmin ? "Administration" : "Computer Science & Engineering",
        year: isAdmin ? "Admin" : "3rd Year",
        role: isAdmin ? "admin" : "student"
      };

      onSignIn(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Hero Image */}
      <div className="hidden lg:flex lg:flex-1 relative">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1693011142814-aa33d7d1535c?w=800&h=1200&fit=crop"
          alt="NITC Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white max-w-md">
            <BookOpen className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-3xl mb-4">Welcome to NITC Marketplace</h1>
            <p className="text-lg opacity-90">
              Connect with fellow students to buy, sell, rent, or donate academic resources within the NITC community.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Sign In Form */}
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
            <h3 className="text-xl">Sign in to your account</h3>
            <p className="text-muted-foreground">
              Enter your NITC credentials to access the marketplace
            </p>
          </div>

          {/* Sign In Form */}
          <Card>
            <CardHeader>
              <CardTitle>Student Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">NITC Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.name@nitc.ac.in"
                    required
                    disabled={isLoading}
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
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Remember me</span>
                  </label>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Forgot password?
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Signing in..."
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <Separator className="my-4" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto"
                      onClick={onSwitchToSignUp}
                      disabled={isLoading}
                    >
                      Sign up here
                    </Button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Demo Credentials</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Student:</strong> student.demo@nitc.ac.in / password123</p>
                <p><strong>Admin:</strong> admin@nitc.ac.in / admin123</p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              By signing in, you agree to our{" "}
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