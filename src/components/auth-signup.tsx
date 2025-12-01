import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle, Play, CreditCard, Star } from "lucide-react";
import { toast } from "sonner";
import { TermsOfService } from "./terms-of-service";
import { PrivacyPolicy } from "./privacy-policy";
import { useAuth } from "../contexts/AuthContext";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface SignupProps {
  onSwitchToLogin: () => void;
}

export function AuthSignup({ onSwitchToLogin }: SignupProps) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPostSignup, setShowPostSignup] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'demo' | 'subscribe' | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    
    // Show post-signup screen to choose account type
    setTimeout(() => {
      setIsLoading(false);
      setShowPostSignup(true);
    }, 1000);
  };

  const handleActionSelect = async (action: 'demo' | 'subscribe') => {
    setSelectedAction(action);
    setIsLoading(true);

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        accountType: action
      });
    } catch (error) {
      // Error already handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (showPostSignup) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{ backgroundColor: COLORS.lightGray }}
      >
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-1/4 -right-1/4 w-96 h-96 rounded-full opacity-10"
            style={{ backgroundColor: COLORS.primary }}
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="w-full max-w-2xl relative z-10">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: COLORS.primary }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="font-serif mb-2" style={{ color: COLORS.dark }}>
              Welcome to Forex Analyst!
            </h1>
            <p className="text-gray-600">
              Your account has been created successfully. Choose how to get started:
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Demo Option */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card 
                className={`border-2 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  selectedAction === 'demo' ? 'border-blue-400 bg-blue-50/50' : 'border-gray-200 hover:border-blue-200'
                }`}
                onClick={() => handleActionSelect('demo')}
              >
                <CardHeader className="text-center">
                  <div 
                    className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center"
                    style={{ backgroundColor: "#3B82F6" + "20", color: "#3B82F6" }}
                  >
                    <Play className="w-6 h-6" />
                  </div>
                  <CardTitle style={{ color: COLORS.dark }}>
                    Request Demo Access
                  </CardTitle>
                  <CardDescription>
                    Explore our platform with sample data and limited features
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Sample trading data</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Basic analytics</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>7-day access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4" />
                      <span>Manual approval required</span>
                    </div>
                  </div>
                  
                  <Badge variant="outline" className="w-full justify-center">
                    FREE
                  </Badge>
                  
                  <Button
                    className="w-full"
                    variant="outline"
                    style={{ borderColor: "#3B82F6", color: "#3B82F6" }}
                    onClick={() => handleActionSelect('demo')}
                    disabled={isLoading}
                  >
                    Request Demo Access
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Subscribe Option */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card 
                className={`border-2 cursor-pointer transition-all duration-300 hover:shadow-xl relative ${
                  selectedAction === 'subscribe' ? 'border-orange-400 bg-orange-50/50' : 'border-gray-200 hover:border-orange-200'
                }`}
                onClick={() => handleActionSelect('subscribe')}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge 
                    className="text-white px-3 py-1"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    <Star className="w-3 h-3 mr-1" />
                    RECOMMENDED
                  </Badge>
                </div>
                
                <CardHeader className="text-center">
                  <div 
                    className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center"
                    style={{ backgroundColor: COLORS.primary + "20", color: COLORS.primary }}
                  >
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <CardTitle style={{ color: COLORS.dark }}>
                    Subscribe & Start Setup
                  </CardTitle>
                  <CardDescription>
                    Get full access and start configuring your analyst dashboard
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Full platform access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Real-time data & signals</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Advanced analytics</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Live streaming & consultations</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Subscriber management</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                      KWD 29/month
                    </div>
                    <div className="text-sm text-gray-500">
                      14-day free trial
                    </div>
                  </div>
                  
                  <Button
                    className="w-full relative overflow-hidden group"
                    style={{ backgroundColor: COLORS.primary }}
                    onClick={() => handleActionSelect('subscribe')}
                    disabled={isLoading}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Subscribe & Setup
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Back to Login */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                className="font-medium hover:underline transition-colors"
                style={{ color: COLORS.primary }}
                onClick={onSwitchToLogin}
              >
                Sign in
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: COLORS.lightGray }}
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/4 -right-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: COLORS.primary }}
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-1/4 -left-1/4 w-80 h-80 rounded-full opacity-5"
          style={{ backgroundColor: COLORS.dark }}
          animate={{ 
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: COLORS.primary }}
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="w-8 h-8 text-white" />
          </motion.div>
          
          <h1 className="font-serif" style={{ color: COLORS.dark }}>
            Join Forex Analyst
          </h1>
          <p className="text-gray-600 mt-2">
            Create your professional trading account
          </p>
        </motion.div>

        {/* Signup Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle style={{ color: COLORS.dark }}>
                Create Account
              </CardTitle>
              <CardDescription>
                Start your journey as a professional analyst
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name Field */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="pl-10 border-gray-200 focus:border-orange-300 focus:ring-orange-200"
                      disabled={isLoading}
                    />
                  </div>
                </motion.div>

                {/* Email Field */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="analyst@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 border-gray-200 focus:border-orange-300 focus:ring-orange-200"
                      disabled={isLoading}
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 border-gray-200 focus:border-orange-300 focus:ring-orange-200"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>

                {/* Confirm Password Field */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10 pr-10 border-gray-200 focus:border-orange-300 focus:ring-orange-200"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>

                {/* Create Account Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    type="submit"
                    className="w-full relative overflow-hidden group"
                    style={{ backgroundColor: COLORS.primary }}
                    disabled={isLoading}
                    size="lg"
                  >
                    <motion.div
                      className="flex items-center justify-center gap-2"
                      animate={isLoading ? { opacity: 0 } : { opacity: 1 }}
                    >
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                    
                    {isLoading && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Terms */}
              <motion.p 
                className="text-xs text-gray-500 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                By creating an account, you agree to our{" "}
                <button
                  type="button"
                  className="hover:underline transition-colors"
                  style={{ color: COLORS.primary }}
                  onClick={() => setShowTerms(true)}
                  disabled={isLoading}
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="hover:underline transition-colors"
                  style={{ color: COLORS.primary }}
                  onClick={() => setShowPrivacy(true)}
                  disabled={isLoading}
                >
                  Privacy Policy
                </button>
              </motion.p>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              {/* Sign In Link */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="font-medium hover:underline transition-colors"
                    style={{ color: COLORS.primary }}
                    onClick={onSwitchToLogin}
                    disabled={isLoading}
                  >
                    Sign in
                  </button>
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Terms and Privacy Dialogs */}
        <TermsOfService 
          isOpen={showTerms} 
          onClose={() => setShowTerms(false)} 
        />
        <PrivacyPolicy 
          isOpen={showPrivacy} 
          onClose={() => setShowPrivacy(false)} 
        />
      </div>
    </div>
  );
}