import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

interface GlowingBorderCardProps {
  children: ReactNode;
  isVisible: boolean;
}

const neonColors = [
  { border: "#00d4ff", glow: "rgba(0, 212, 255, 0.5)" },   // Neon Blue
  { border: "#a855f7", glow: "rgba(168, 85, 247, 0.5)" },  // Purple
  { border: "#22c55e", glow: "rgba(34, 197, 94, 0.5)" },   // Green
  { border: "#ec4899", glow: "rgba(236, 72, 153, 0.5)" },  // Pink
  { border: "#f97316", glow: "rgba(249, 115, 22, 0.5)" },  // Orange
  { border: "#06b6d4", glow: "rgba(6, 182, 212, 0.5)" },   // Cyan
];

const GlowingBorderCard = ({ children, isVisible }: GlowingBorderCardProps) => {
  const [colorIndex, setColorIndex] = useState(0);
  const [showCount, setShowCount] = useState(0);

  // Change color each time the card becomes visible
  useEffect(() => {
    if (isVisible) {
      setShowCount(prev => prev + 1);
      setColorIndex(prev => (prev + 1) % neonColors.length);
    }
  }, [isVisible]);

  const currentColor = neonColors[colorIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isVisible ? { 
        opacity: 1, 
        y: 0, 
        scale: 1,
      } : { 
        opacity: 0, 
        y: 50, 
        scale: 0.9,
      }}
      transition={{ 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative"
    >
      {/* Animated glowing border */}
      <motion.div
        className="absolute -inset-[2px] rounded-2xl opacity-75"
        animate={isVisible ? {
          boxShadow: [
            `0 0 20px 5px ${currentColor.glow}`,
            `0 0 40px 10px ${currentColor.glow}`,
            `0 0 20px 5px ${currentColor.glow}`,
          ],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `linear-gradient(135deg, ${currentColor.border}, transparent, ${currentColor.border})`,
          backgroundSize: "200% 200%",
        }}
      />
      
      {/* Border animation overlay */}
      <motion.div
        className="absolute -inset-[2px] rounded-2xl"
        animate={isVisible ? {
          background: [
            `linear-gradient(0deg, ${currentColor.border} 0%, transparent 50%, ${currentColor.border} 100%)`,
            `linear-gradient(90deg, ${currentColor.border} 0%, transparent 50%, ${currentColor.border} 100%)`,
            `linear-gradient(180deg, ${currentColor.border} 0%, transparent 50%, ${currentColor.border} 100%)`,
            `linear-gradient(270deg, ${currentColor.border} 0%, transparent 50%, ${currentColor.border} 100%)`,
            `linear-gradient(360deg, ${currentColor.border} 0%, transparent 50%, ${currentColor.border} 100%)`,
          ],
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ opacity: 0.5 }}
      />
      
      {/* Glassmorphism card */}
      <div 
        className="relative rounded-2xl p-8 backdrop-blur-xl"
        style={{
          background: "rgba(20, 20, 30, 0.8)",
          border: `2px solid ${isVisible ? currentColor.border : "transparent"}`,
          boxShadow: isVisible 
            ? `inset 0 0 30px rgba(255, 255, 255, 0.05), 0 25px 50px -12px rgba(0, 0, 0, 0.5)`
            : "none",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default GlowingBorderCard;
