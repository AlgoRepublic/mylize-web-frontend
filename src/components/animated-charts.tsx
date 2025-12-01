import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

// Your brand colors
const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

// Sample data for different chart types
const lineData = [
  { month: "Jan", value: 2400, earnings: 1200 },
  { month: "Feb", value: 1398, earnings: 1500 },
  { month: "Mar", value: 9800, earnings: 2200 },
  { month: "Apr", value: 3908, earnings: 1800 },
  { month: "May", value: 4800, earnings: 2800 },
  { month: "Jun", value: 3800, earnings: 3200 },
  { month: "Jul", value: 4300, earnings: 2900 }
];

const areaData = [
  { time: "00:00", income: 4000, expenses: 2400 },
  { time: "04:00", income: 3000, expenses: 1398 },
  { time: "08:00", income: 2000, expenses: 9800 },
  { time: "12:00", income: 2780, expenses: 3908 },
  { time: "16:00", income: 1890, expenses: 4800 },
  { time: "20:00", income: 2390, expenses: 3800 },
  { time: "24:00", income: 3490, expenses: 4300 }
];

const barData = [
  { category: "Savings", amount: 4000 },
  { category: "Expenses", amount: 3000 },
  { category: "Investments", amount: 2000 },
  { category: "Income", amount: 2780 }
];

const pieData = [
  { name: "Savings", value: 45, color: COLORS.primary },
  { name: "Expenses", value: 30, color: COLORS.dark },
  { name: "Investments", value: 15, color: "#8B5A2B" },
  { name: "Other", value: 10, color: COLORS.lightGray }
];

interface AnimatedLineChartProps {
  title?: string;
  subtitle?: string;
  height?: number;
}

export function AnimatedLineChart({ title = "Revenue Growth", subtitle = "Monthly performance", height = 200 }: AnimatedLineChartProps) {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 card-hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-card-title font-serif" style={{ color: COLORS.dark }}>{title}</h4>
          <p className="text-sm font-sans" style={{ color: COLORS.dark + "80" }}>{subtitle}</p>
        </div>
        <motion.div 
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: COLORS.primary + "20", color: COLORS.primary }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          +24.5%
        </motion.div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.lightGray} opacity={0.6} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: COLORS.dark + "80" }}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{
                backgroundColor: COLORS.light,
                border: `1px solid ${COLORS.lightGray}`,
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={COLORS.primary}
              strokeWidth={3}
              dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: COLORS.primary, strokeWidth: 2, fill: COLORS.light }}
              animationDuration={2000}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <motion.div 
        className="mt-4 flex items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: animationComplete ? 1 : 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.primary }}></div>
          <span className="text-sm font-sans" style={{ color: COLORS.dark + "80" }}>Revenue</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function AnimatedAreaChart({ title = "Income vs Expenses", subtitle = "Daily overview", height = 200 }: AnimatedLineChartProps) {
  return (
    <motion.div 
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 card-hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-card-title font-serif" style={{ color: COLORS.dark }}>{title}</h4>
          <p className="text-sm font-sans" style={{ color: COLORS.dark + "80" }}>{subtitle}</p>
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={areaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.lightGray} opacity={0.6} />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: COLORS.dark + "80" }}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{
                backgroundColor: COLORS.light,
                border: `1px solid ${COLORS.lightGray}`,
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}
            />
            <Area 
              type="monotone" 
              dataKey="income" 
              stackId="1"
              stroke={COLORS.primary}
              fill={COLORS.primary}
              fillOpacity={0.8}
              animationDuration={2500}
              animationEasing="ease-out"
            />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              stackId="1"
              stroke={COLORS.dark}
              fill={COLORS.dark}
              fillOpacity={0.6}
              animationDuration={2500}
              animationEasing="ease-out"
              animationBegin={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function AnimatedBarChart({ title = "Category Breakdown", subtitle = "Financial overview", height = 200 }: AnimatedLineChartProps) {
  return (
    <motion.div 
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 card-hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-card-title font-serif" style={{ color: COLORS.dark }}>{title}</h4>
          <p className="text-sm font-sans" style={{ color: COLORS.dark + "80" }}>{subtitle}</p>
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.lightGray} opacity={0.6} />
            <XAxis 
              dataKey="category" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: COLORS.dark + "80" }}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{
                backgroundColor: COLORS.light,
                border: `1px solid ${COLORS.lightGray}`,
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}
            />
            <Bar 
              dataKey="amount" 
              fill={COLORS.primary}
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function AnimatedPieChart({ title = "Portfolio Distribution", subtitle = "Asset allocation" }: AnimatedLineChartProps) {
  const [activeIndex, setActiveIndex] = useState(-1);

  return (
    <motion.div 
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 card-hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-card-title font-serif" style={{ color: COLORS.dark }}>{title}</h4>
          <p className="text-sm font-sans" style={{ color: COLORS.dark + "80" }}>{subtitle}</p>
        </div>
      </div>

      <div className="h-48 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              animationDuration={2000}
              animationEasing="ease-out"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(-1)}
            >
              {pieData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke={activeIndex === index ? COLORS.light : "none"}
                  strokeWidth={activeIndex === index ? 2 : 0}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: COLORS.light,
                border: `1px solid ${COLORS.lightGray}`,
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {pieData.map((entry, index) => (
          <motion.div 
            key={entry.name}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-xs font-sans" style={{ color: COLORS.dark + "80" }}>
              {entry.name} ({entry.value}%)
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Enhanced gradient line chart for statistics
export function EnhancedStatisticsChart() {
  return (
    <motion.div 
      className="h-20 mb-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <motion.svg 
        className="w-full h-full" 
        viewBox="0 0 300 80"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.primary} stopOpacity="0.8" />
            <stop offset="50%" stopColor={COLORS.primary} stopOpacity="1" />
            <stop offset="100%" stopColor={COLORS.primary} stopOpacity="0.6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <motion.path 
          d="M0,60 Q30,55 60,50 T120,45 Q150,40 180,35 T240,30 Q270,35 300,40" 
          stroke="url(#lineGradient)"
          strokeWidth="3" 
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        <motion.circle 
          cx="240" 
          cy="30" 
          r="4" 
          fill={COLORS.primary}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5, ease: "easeOut" }}
        />
        
        <motion.circle 
          cx="240" 
          cy="30" 
          r="8" 
          fill="none"
          stroke={COLORS.primary}
          strokeWidth="2"
          opacity="0.5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2, duration: 0.5, ease: "easeOut" }}
        />
      </motion.svg>
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{ backgroundColor: COLORS.primary + "30" }}
            initial={{ 
              x: Math.random() * 300, 
              y: Math.random() * 80,
              opacity: 0 
            }}
            animate={{ 
              y: [null, Math.random() * 80, Math.random() * 80],
              opacity: [0, 0.6, 0]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}