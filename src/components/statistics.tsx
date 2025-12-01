import { MoreHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { EnhancedStatisticsChart } from "./animated-charts";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

export function Statistics() {
  return (
    <motion.div 
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 card-hover transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-card-title font-serif" style={{ color: COLORS.dark }}>Your Statistics</h4>
        <motion.div 
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-sm font-sans font-medium" style={{ color: COLORS.dark + "80" }}>Month</span>
          <motion.svg 
            className="w-4 h-4" 
            style={{ color: COLORS.dark + "60" }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            animate={{ rotate: 0 }}
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.div>
      </div>
      
      <motion.div 
        className="text-caption font-sans mb-4"
        style={{ color: COLORS.dark + "80" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        16 Nov - 16 Dec 2024
      </motion.div>
      
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <motion.div 
          className="text-financial mb-2"
          style={{ color: COLORS.dark }}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
        >
          74%
        </motion.div>
        <div className="text-caption font-sans" style={{ color: COLORS.dark + "A0" }}>
          Increase in earnings
        </div>
      </motion.div>
      
      {/* Enhanced Chart */}
      <EnhancedStatisticsChart />
      
      {/* Additional Stats */}
      <motion.div 
        className="flex items-center justify-between pt-4 border-t"
        style={{ borderColor: COLORS.lightGray }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-2">
          <motion.div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: COLORS.primary }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs font-sans" style={{ color: COLORS.dark + "80" }}>
            Active Growth
          </span>
        </div>
        <motion.span 
          className="text-xs font-sans font-medium"
          style={{ color: COLORS.primary }}
          whileHover={{ scale: 1.05 }}
        >
          View Details
        </motion.span>
      </motion.div>
    </motion.div>
  );
}