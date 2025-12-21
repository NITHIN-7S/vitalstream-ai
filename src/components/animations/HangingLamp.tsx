import { motion, AnimatePresence } from "framer-motion";

interface HangingLampProps {
  isOn: boolean;
  onToggle: () => void;
}

const HangingLamp = ({ isOn, onToggle }: HangingLampProps) => {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
      {/* Ceiling mount */}
      <div className="w-8 h-3 bg-zinc-700 rounded-b-sm" />
      
      {/* Lamp cord/thread - clickable */}
      <motion.div
        className="relative cursor-pointer group"
        onClick={onToggle}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* The cord */}
        <motion.div
          className="w-1 bg-gradient-to-b from-zinc-600 to-zinc-500 rounded-full mx-auto"
          style={{ height: "120px" }}
          animate={{
            rotateZ: isOn ? [0, 1, -1, 0] : 0,
          }}
          transition={{
            duration: 2,
            repeat: isOn ? Infinity : 0,
            ease: "easeInOut",
          }}
        />
        
        {/* Click hint */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ scale: 0.8 }}
          animate={{ scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-6 rounded-full border-2 border-dashed border-primary/50" />
        </motion.div>
      </motion.div>
      
      {/* Lamp fixture */}
      <motion.div
        className="relative"
        animate={{
          rotateZ: isOn ? [0, 0.5, -0.5, 0] : 0,
        }}
        transition={{
          duration: 2,
          repeat: isOn ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {/* Lamp shade */}
        <div 
          className="w-32 h-16 relative"
          style={{
            background: "linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%)",
            borderRadius: "0 0 50% 50% / 0 0 100% 100%",
            clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
          }}
        >
          {/* Inner shade detail */}
          <div 
            className="absolute inset-x-2 inset-y-1"
            style={{
              background: "linear-gradient(180deg, #4a4a4a 0%, #3a3a3a 100%)",
              borderRadius: "0 0 50% 50% / 0 0 100% 100%",
              clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
            }}
          />
        </div>
        
        {/* Bulb */}
        <motion.div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-10 rounded-full"
          style={{
            background: isOn 
              ? "radial-gradient(circle, #fff9c4 0%, #ffeb3b 50%, #ffc107 100%)"
              : "linear-gradient(180deg, #555 0%, #333 100%)",
          }}
          animate={{
            boxShadow: isOn
              ? [
                  "0 0 20px 10px rgba(255, 235, 59, 0.3)",
                  "0 0 40px 20px rgba(255, 235, 59, 0.4)",
                  "0 0 20px 10px rgba(255, 235, 59, 0.3)",
                ]
              : "0 0 0px 0px rgba(0, 0, 0, 0)",
          }}
          transition={{
            duration: 2,
            repeat: isOn ? Infinity : 0,
            ease: "easeInOut",
          }}
        />
        
        {/* Light glow effect */}
        <AnimatePresence>
          {isOn && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5 }}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2"
            >
              {/* Main light cone */}
              <div
                className="w-0 h-0"
                style={{
                  borderLeft: "150px solid transparent",
                  borderRight: "150px solid transparent",
                  borderTop: "400px solid rgba(255, 235, 59, 0.08)",
                  filter: "blur(20px)",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Click instruction text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute top-[180px] text-xs text-muted-foreground/50 whitespace-nowrap"
      >
        Click the cord to {isOn ? "turn off" : "turn on"}
      </motion.p>
    </div>
  );
};

export default HangingLamp;
