import React, { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Eye, EyeOff, Phone, Lock, ArrowRight, Shield, TrendingUp, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface LoginProps {
  onSwitchToSignup: () => void;
}

export function AuthLogin({ onSwitchToSignup }: LoginProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    phone: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number
    if (!formData.phone) {
      toast.error("Please enter your phone number");
      return;
    }

    // if (!isValidPhoneNumber(formData.phone)) {
    //   setPhoneError("Please enter a valid phone number");
    //   toast.error("Please enter a valid phone number");
    //   return;
    // }

    if (!formData.password) {
      toast.error("Please enter your password");
      return;
    }

    setPhoneError("");
    setIsLoading(true);
    
    try {
      await login({
        phone: formData.phone,
        password: formData.password,
        platform: "web",
        type: "analyst"
      });
      // Login successful - redirect is handled automatically by App.tsx
      // when isAuthenticated becomes true
    } catch (error) {
      // Error already handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === "phone" && phoneError) {
      setPhoneError("");
    }
  };

  const handlePhoneChange = (value: string | undefined) => {
    const phoneValue = value || "";
    handleInputChange("phone", phoneValue);
    if (phoneValue && !isValidPhoneNumber(phoneValue)) {
      setPhoneError("Invalid phone number format");
    } else {
      setPhoneError("");
    }
  };

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
            <TrendingUp className="w-8 h-8 text-white" />
          </motion.div>
          
          <h1 className="font-serif" style={{ color: COLORS.dark }}>
            Forex Analyst
          </h1>
          <p className="text-gray-600 mt-2">
            Professional Trading Dashboard
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle style={{ color: COLORS.dark }}>
                Welcome Back
              </CardTitle>
              <CardDescription>
                Sign in to access your analyst dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Phone Number Field */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    {/* <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" /> */}
                    <div className="pl-0">
                      <PhoneInput
                        international
                        defaultCountry="KW"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        placeholder="Enter phone number"
                        disabled={isLoading}
                        className="phone-input-custom"
                        
                      />
                    </div>
                    {phoneError && (
                      <p className="text-sm text-red-500 mt-1">{phoneError}</p>
                    )}
                  </div>
                  <style>{`
                    .phone-input-custom {
                      display: flex;
                      align-items: center;
                      width: 100%;
                    }
                    .phone-input-custom .PhoneInputCountry {
                      margin-right: 0.5rem;
                      display: flex;
                      align-items: center;
                    }
                    .phone-input-custom .PhoneInputCountrySelect {
                      border: 1px solid #e5e7eb;
                      border-radius: 0.375rem;
                      padding: 0.5rem;
                      background: white;
                      font-size: 0.875rem;
                      cursor: pointer;
                    }
                    .phone-input-custom .PhoneInputCountrySelect:focus {
                      outline: none;
                      border-color: #fb923c;
                      ring: 2px;
                      ring-color: #fed7aa;
                    }
                    .phone-input-custom .PhoneInputInput {
                      flex: 1;
                      border: 1px solid #e5e7eb;
                      border-radius: 0.375rem;
                      padding: 0.5rem 0.75rem;
                      font-size: 0.875rem;
                      height: 2.5rem;
                      background: white;
                    }
                    .phone-input-custom .PhoneInputInput:focus {
                      outline: none;
                      border-color: #fb923c;
                      ring: 2px;
                      ring-color: #fed7aa;
                    }
                    .phone-input-custom .PhoneInputInput:disabled {
                      cursor: not-allowed;
                      opacity: 0.5;
                      background: #f9fafb;
                    }
                    .phone-input-custom .PhoneInputInput::placeholder {
                      color: #9ca3af;
                    }
                  `}</style>
                </motion.div>

                {/* Password Field */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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

                {/* Forgot Password */}
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm hover:underline transition-colors"
                    style={{ color: COLORS.primary }}
                    disabled={isLoading}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Login Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
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
                      <span>Sign In</span>
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

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="font-medium hover:underline transition-colors"
                    style={{ color: COLORS.primary }}
                    onClick={onSwitchToSignup}
                    disabled={isLoading}
                  >
                    Sign up
                  </button>
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          className="mt-8 grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {[
            { icon: Shield, label: "Secure" },
            { icon: TrendingUp, label: "Analytics" },
            { icon: BarChart3, label: "Reports" }
          ].map((feature, index) => (
            <motion.div
              key={feature.label}
              className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center"
              whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
            >
              <feature.icon 
                className="w-6 h-6 mx-auto mb-1" 
                style={{ color: COLORS.primary }} 
              />
              <p className="text-xs text-gray-600">{feature.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}