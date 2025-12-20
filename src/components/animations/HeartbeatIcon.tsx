import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface HeartbeatIconProps {
  className?: string;
  size?: number;
}

const HeartbeatIcon = ({ className = "", size = 24 }: HeartbeatIconProps) => {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.15, 1, 1.1, 1],
      }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Heart size={size} className="fill-destructive text-destructive" />
    </motion.div>
  );
};

export default HeartbeatIcon;
