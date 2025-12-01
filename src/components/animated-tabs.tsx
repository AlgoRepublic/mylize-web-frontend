import { useState } from "react";
import { motion } from "motion/react";

// Your brand colors
const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface Tab {
  id: string;
  label: string;
  value: string;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function AnimatedTabs({ tabs, defaultValue, onChange }: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value || "");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onChange?.(value);
  };

  return (
    <div className="flex gap-6">
      {tabs.map((tab, index) => (
        <div key={tab.id} className="relative">
          <input
            type="radio"
            id={tab.id}
            name="navigation-tabs"
            value={tab.value}
            checked={activeTab === tab.value}
            onChange={() => handleTabChange(tab.value)}
            className="sr-only"
          />
          <label
            htmlFor={tab.id}
            className={`
              relative flex items-center justify-center cursor-pointer
              px-6 py-2 rounded-xl font-serif text-banking-title
              border-2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
              select-none overflow-hidden
              ${activeTab === tab.value 
                ? 'border-transparent text-white scale-110 shadow-lg' 
                : `text-gray-300 hover:text-[${COLORS.primary}]`
              }
            `}
            style={{
              borderColor: activeTab === tab.value ? 'transparent' : COLORS.lightGray,
              ...(activeTab !== tab.value && {
                '&:hover': {
                  borderColor: COLORS.primary,
                  color: COLORS.primary
                }
              })
            }}
            style={{
              transformOrigin: '0 0'
            }}
          >
            {/* Background for active state */}
            <motion.div
              className="absolute inset-0 rounded-xl -z-10"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary}E0)`
              }}
              initial={{ opacity: 0, scale: 0, y: '-50%' }}
              animate={activeTab === tab.value ? { 
                opacity: 1, 
                scale: 1, 
                y: '0%',
                boxShadow: [
                  `0rem 6px 13px ${COLORS.primary}1A`,
                  `0rem 24px 24px ${COLORS.primary}16`, 
                  `0rem 55px 33px ${COLORS.primary}0D`,
                  `0rem 97px 39px ${COLORS.primary}03`,
                  `0rem 152px 43px ${COLORS.primary}00`
                ].join(", ")
              } : { 
                opacity: 0, 
                scale: 0, 
                y: '-50%' 
              }}
              transition={{ 
                duration: 0.48, 
                ease: [0.23, 1, 0.32, 1] 
              }}
            />

            {/* Bottom indicator dot */}
            <motion.div
              className="absolute bottom-0 left-1/2 w-2 h-2 rounded-full -z-20"
              style={{ 
                transform: 'translateX(-50%)',
                backgroundColor: COLORS.primary
              }}
              initial={{ 
                y: '32px', 
                opacity: 0, 
                scale: 0 
              }}
              animate={activeTab === tab.value ? { 
                y: '16px', 
                opacity: 1, 
                scale: 1,
                boxShadow: [
                  `0rem 6px 13px ${COLORS.primary}1A`,
                  `0rem 24px 24px ${COLORS.primary}16`, 
                  `0rem 55px 33px ${COLORS.primary}0D`,
                  `0rem 97px 39px ${COLORS.primary}03`,
                  `0rem 152px 43px ${COLORS.primary}00`
                ].join(", ")
              } : { 
                y: '32px', 
                opacity: 0, 
                scale: 0 
              }}
              transition={{ 
                duration: 0.48, 
                delay: 0.2, 
                ease: [0.23, 1, 0.32, 1] 
              }}
            />

            {/* Tab text */}
            <span className="relative z-10 transition-all duration-300">
              {tab.label}
            </span>

            {/* Hover shimmer effect */}
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{
                background: `linear-gradient(90deg, transparent, ${COLORS.primary}1A, transparent)`
              }}
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
          </label>
        </div>
      ))}
    </div>
  );
}