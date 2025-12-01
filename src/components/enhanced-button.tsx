import { motion } from "motion/react";
import { forwardRef } from "react";

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  glowEffect?: boolean;
  floatingEffect?: boolean;
}

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    variant = "primary", 
    size = "md", 
    children, 
    className = "", 
    glowEffect = false,
    floatingEffect = true,
    ...props 
  }, ref) => {
    const baseClasses = "relative overflow-hidden font-sans font-medium tracking-wide rounded-lg transition-all duration-300 ease-out focus:outline-none";
    
    const variantClasses = {
      primary: "bg-gray-900 text-white shadow-lg shadow-gray-900/25 hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-900/40 focus:ring-4 focus:ring-gray-900/20",
      secondary: "bg-white text-gray-900 border border-gray-300 shadow-md shadow-gray-200/60 hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg hover:shadow-gray-300/40 focus:ring-4 focus:ring-gray-200/60",
      ghost: "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-4 focus:ring-gray-200/40"
    };

    const sizeClasses = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base"
    };

    return (
      <motion.button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        whileHover={floatingEffect ? { 
          y: -2, 
          scale: 1.02,
          transition: { duration: 0.2 }
        } : undefined}
        whileTap={{ 
          y: 0, 
          scale: 0.95,
          transition: { duration: 0.1 }
        }}
        {...props}
      >
        {/* Glow effect */}
        {glowEffect && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ 
              x: "100%",
              transition: { duration: 0.6, ease: "easeInOut" }
            }}
          />
        )}

        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 bg-white/10 rounded-lg"
          initial={{ scale: 0, opacity: 0 }}
          whileTap={{ 
            scale: 1, 
            opacity: [0, 1, 0],
            transition: { duration: 0.3 }
          }}
        />

        {/* Content */}
        <span className="relative z-10">
          {children}
        </span>
      </motion.button>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";